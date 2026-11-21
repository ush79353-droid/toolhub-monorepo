import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateOptionsSpread,
  formatSpreadMoney,
  isStrikeOrderValid,
} from './calculation';
import type {
  OptionsSpreadFieldErrors,
  OptionsSpreadInput,
  OptionsSpreadResult,
} from './types';

export interface OptionsSpreadValidation {
  isValid: boolean;
  errors: OptionsSpreadFieldErrors;
  result: OptionsSpreadResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

function convertMoney(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: CurrencyRatesSnapshot | null | undefined
): { ok: true; amount: number } | { ok: false; message: string } {
  if (from === to) return { ok: true, amount };
  if (!rates?.available) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  const converted = convertCurrency({
    amount,
    from,
    to,
    rates: rates.rates,
  });
  if (!converted.ok) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  return { ok: true, amount: converted.amount };
}

function convertOut(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: CurrencyRatesSnapshot | null | undefined
): number | null {
  const c = convertMoney(amount, from, to, rates);
  return c.ok ? c.amount : null;
}

export function validateOptionsSpreadInput(
  input: OptionsSpreadInput,
  rates?: CurrencyRatesSnapshot | null
): OptionsSpreadValidation {
  const errors: OptionsSpreadFieldErrors = {};
  const target = parseNumber(input.targetPrice);
  const contracts = parseNumber(input.contracts);
  const longStrike = parseNumber(input.longStrike);
  const longPremium = parseNumber(input.longPremium);
  const shortStrike = parseNumber(input.shortStrike);
  const shortPremium = parseNumber(input.shortPremium);

  if (target.blank) errors.targetPrice = 'Enter a target price.';
  else if (target.invalid || target.value === null || target.value < 0) {
    errors.targetPrice = 'Enter a valid non-negative target price.';
  }

  if (contracts.blank) errors.contracts = 'Enter the number of options.';
  else if (
    contracts.invalid ||
    contracts.value === null ||
    !Number.isInteger(contracts.value) ||
    contracts.value <= 0
  ) {
    errors.contracts = 'Enter a whole number of contracts greater than zero.';
  }

  if (longStrike.blank) errors.longStrike = 'Enter the long strike.';
  else if (longStrike.invalid || longStrike.value === null || longStrike.value < 0) {
    errors.longStrike = 'Enter a valid non-negative strike.';
  }

  if (longPremium.blank) errors.longPremium = 'Enter the long premium.';
  else if (
    longPremium.invalid ||
    longPremium.value === null ||
    longPremium.value < 0
  ) {
    errors.longPremium = 'Enter a valid non-negative premium.';
  }

  if (shortStrike.blank) errors.shortStrike = 'Enter the short strike.';
  else if (
    shortStrike.invalid ||
    shortStrike.value === null ||
    shortStrike.value < 0
  ) {
    errors.shortStrike = 'Enter a valid non-negative strike.';
  }

  if (shortPremium.blank) errors.shortPremium = 'Enter the short premium.';
  else if (
    shortPremium.invalid ||
    shortPremium.value === null ||
    shortPremium.value < 0
  ) {
    errors.shortPremium = 'Enter a valid non-negative premium.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const calc = input.targetCurrency;
  const pairs: {
    amount: number;
    from: SupportedCurrency;
    key: keyof OptionsSpreadFieldErrors;
  }[] = [
    { amount: longStrike.value!, from: input.longStrikeCurrency, key: 'longStrike' },
    {
      amount: longPremium.value!,
      from: input.longPremiumCurrency,
      key: 'longPremium',
    },
    {
      amount: shortStrike.value!,
      from: input.shortStrikeCurrency,
      key: 'shortStrike',
    },
    {
      amount: shortPremium.value!,
      from: input.shortPremiumCurrency,
      key: 'shortPremium',
    },
  ];

  const converted: number[] = [];
  for (const pair of pairs) {
    const c = convertMoney(pair.amount, pair.from, calc, rates);
    if (!c.ok) {
      errors.form = c.message;
      return { isValid: false, errors, result: null };
    }
    converted.push(c.amount);
  }

  const [kLong, pLong, kShort, pShort] = converted as [
    number,
    number,
    number,
    number,
  ];

  if (!isStrikeOrderValid(input.strategy, kLong, kShort)) {
    errors.form =
      input.strategy === 'bull-call' || input.strategy === 'bull-put'
        ? 'For this bullish spread the long strike must be lower than the short strike.'
        : 'For this bearish spread the short strike must be lower than the long strike.';
    return { isValid: false, errors, result: null };
  }

  const computation = calculateOptionsSpread({
    strategy: input.strategy,
    targetPrice: target.value!,
    contracts: contracts.value!,
    longStrike: kLong,
    longPremium: pLong,
    shortStrike: kShort,
    shortPremium: pShort,
  });

  if (!computation) {
    errors.form =
      'Spread premiums are not economically coherent for this strike width (max profit/loss would be negative).';
    return { isValid: false, errors, result: null };
  }

  const outNet = convertOut(
    computation.netSpreadTotal,
    calc,
    input.netSpreadCurrency,
    rates
  );
  const outLoss = convertOut(
    computation.maxLoss,
    calc,
    input.maxLossCurrency,
    rates
  );
  const outProfit = convertOut(
    computation.maxProfit,
    calc,
    input.maxProfitCurrency,
    rates
  );
  const outBe = convertOut(
    computation.breakevenPrice,
    calc,
    input.breakevenCurrency,
    rates
  );
  const outPot = convertOut(
    computation.potentialProfit,
    calc,
    input.potentialProfitCurrency,
    rates
  );

  if (
    outNet === null ||
    outLoss === null ||
    outProfit === null ||
    outBe === null ||
    outPot === null
  ) {
    errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
    return { isValid: false, errors, result: null };
  }

  const result: OptionsSpreadResult = {
    strategy: computation.strategy,
    contracts: computation.contracts,
    contractMultiplier: computation.contractMultiplier,
    calcCurrency: calc,
    targetPrice: computation.targetPrice,
    longStrike: computation.longStrike,
    shortStrike: computation.shortStrike,
    longPremium: computation.longPremium,
    shortPremium: computation.shortPremium,
    netPerShare: computation.netPerShare,
    netKind: computation.netKind,
    netSpreadTotal: computation.netSpreadTotal,
    maxLoss: computation.maxLoss,
    maxProfit: computation.maxProfit,
    breakevenPrice: computation.breakevenPrice,
    potentialProfit: computation.potentialProfit,
    strikeWidth: computation.strikeWidth,
    formattedNetSpread: formatSpreadMoney(outNet, input.netSpreadCurrency),
    formattedMaxLoss: formatSpreadMoney(outLoss, input.maxLossCurrency),
    formattedMaxProfit: formatSpreadMoney(outProfit, input.maxProfitCurrency),
    formattedBreakeven: formatSpreadMoney(outBe, input.breakevenCurrency),
    formattedPotentialProfit: formatSpreadMoney(
      outPot,
      input.potentialProfitCurrency
    ),
    strategyNote: computation.strategyNote,
    netSpreadLabel: computation.netSpreadLabel,
  };

  return { isValid: true, errors: {}, result };
}
