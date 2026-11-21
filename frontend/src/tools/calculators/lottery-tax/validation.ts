import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { calculateLotteryTax, formatLotteryTaxMoney } from './calculation';
import type {
  LotteryTaxDraft,
  LotteryTaxFieldErrors,
  LotteryTaxResult,
} from './types';

export interface LotteryTaxValidation {
  isValid: boolean;
  errors: LotteryTaxFieldErrors;
  result: LotteryTaxResult | null;
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

export function validateLotteryTaxInput(
  input: LotteryTaxDraft,
  rates?: CurrencyRatesSnapshot | null
): LotteryTaxValidation {
  const errors: LotteryTaxFieldErrors = {};
  const annuityParsed = parseNumber(input.annuityPayout);
  const percentParsed = parseNumber(input.lumpSumPercent);
  const taxIParsed = parseNumber(input.taxRateI);
  const taxIIParsed = parseNumber(input.taxRateII);
  const yearsParsed = parseNumber(input.years);
  const growthParsed = parseNumber(input.growthPercent);

  if (annuityParsed.blank || annuityParsed.invalid || annuityParsed.value === null) {
    errors.annuityPayout = 'Enter a valid annuity payout amount.';
  } else if (annuityParsed.value < 0) {
    errors.annuityPayout = 'Annuity payout cannot be negative.';
  }

  if (percentParsed.blank || percentParsed.invalid || percentParsed.value === null) {
    errors.lumpSumPercent = 'Enter a lump-sum payout percentage.';
  } else if (percentParsed.value < 0 || percentParsed.value > 100) {
    errors.lumpSumPercent = 'Lump-sum percentage must be between 0 and 100.';
  }

  if (input.taxMode === 'custom') {
    if (taxIParsed.blank || taxIParsed.invalid || taxIParsed.value === null) {
      errors.taxRateI = 'Enter Tax rate I.';
    } else if (taxIParsed.value < 0) {
      errors.taxRateI = 'Tax rate I cannot be negative.';
    }
    if (taxIIParsed.blank || taxIIParsed.invalid || taxIIParsed.value === null) {
      errors.taxRateII = 'Enter Tax rate II.';
    } else if (taxIIParsed.value < 0) {
      errors.taxRateII = 'Tax rate II cannot be negative.';
    }
  }

  if (
    yearsParsed.blank ||
    yearsParsed.invalid ||
    yearsParsed.value === null ||
    !Number.isInteger(yearsParsed.value) ||
    yearsParsed.value < 1 ||
    yearsParsed.value > 100
  ) {
    errors.years = 'Enter a whole number of years between 1 and 100.';
  }

  if (growthParsed.blank || growthParsed.invalid || growthParsed.value === null) {
    errors.growthPercent = 'Enter an annual payout growth percentage.';
  } else if (growthParsed.value <= -100) {
    errors.growthPercent = 'Growth rate must be greater than −100%.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const annuityCanonical = convertMoney(
    annuityParsed.value!,
    input.annuityCurrency,
    input.annuityCurrency,
    rates
  );
  // Normalize into annuity currency for schedule; convert lump display later.
  void annuityCanonical;

  if (
    input.lumpSumCurrency !== input.annuityCurrency &&
    (!rates?.available ||
      convertMoney(1, input.annuityCurrency, input.lumpSumCurrency, rates).ok ===
        false)
  ) {
    return {
      isValid: false,
      errors: { form: CURRENCY_CONVERSION_UNAVAILABLE_NOTE },
      result: null,
    };
  }

  const computed = calculateLotteryTax({
    annuityAmount: annuityParsed.value!,
    lumpSumPercent: percentParsed.value!,
    taxMode: input.taxMode,
    taxRateI: input.taxMode === 'custom' ? taxIParsed.value! : 0,
    taxRateII: input.taxMode === 'custom' ? taxIIParsed.value! : 0,
    years: yearsParsed.value!,
    growthPercent: growthParsed.value!,
    calcCurrency: input.annuityCurrency,
    lumpSumCurrency: input.lumpSumCurrency,
    annuityCurrency: input.annuityCurrency,
  });

  if (!computed) {
    return {
      isValid: false,
      errors: { form: 'This combination does not produce a finite result.' },
      result: null,
    };
  }

  if (computed.lumpSum.net < 0 || computed.annuity.net < 0) {
    return {
      isValid: false,
      errors: {
        form: 'Combined tax rates exceed 100% of gross payout. Reduce Tax I and/or Tax II.',
      },
      result: null,
    };
  }

  // Convert lump-sum column display amounts into lumpSumCurrency when different.
  if (input.lumpSumCurrency !== input.annuityCurrency) {
    const mapAmt = (amount: number) =>
      convertMoney(amount, input.annuityCurrency, input.lumpSumCurrency, rates);
    const payout = mapAmt(computed.lumpSum.payout);
    const taxI = mapAmt(computed.lumpSum.taxI);
    const taxII = mapAmt(computed.lumpSum.taxII);
    const net = mapAmt(computed.lumpSum.net);
    if (!payout.ok || !taxI.ok || !taxII.ok || !net.ok) {
      return {
        isValid: false,
        errors: { form: CURRENCY_CONVERSION_UNAVAILABLE_NOTE },
        result: null,
      };
    }
    computed.lumpSum = {
      payout: payout.amount,
      taxI: taxI.amount,
      taxII: taxII.amount,
      net: net.amount,
      formattedPayout: formatLotteryTaxMoney(payout.amount, input.lumpSumCurrency),
      formattedTaxI: formatLotteryTaxMoney(taxI.amount, input.lumpSumCurrency),
      formattedTaxII: formatLotteryTaxMoney(taxII.amount, input.lumpSumCurrency),
      formattedNet: formatLotteryTaxMoney(net.amount, input.lumpSumCurrency),
    };
    // Difference stays in annuity/calc currency for nominal annuity comparison.
  }

  return { isValid: true, errors: {}, result: computed };
}
