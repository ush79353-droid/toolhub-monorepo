import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateMarginSummary,
  calculatePointValue,
  calculatePointsDifference,
  calculatePositionProfitLoss,
  formatMarginCallMoney,
  formatMarginCallPoints,
} from './calculation';
import type {
  MarginCallFieldErrors,
  MarginCallInput,
  MarginCallResult,
} from './types';

export interface MarginCallValidation {
  isValid: boolean;
  errors: MarginCallFieldErrors;
  result: MarginCallResult | null;
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

/**
 * Live validation. Point value needs tick × ticks. P/L needs prices + contracts.
 * Margin totals need deposit + both margins + contracts (P/L treated as 0 until
 * prices are complete). Counts/ticks/points never convert.
 */
export function validateMarginCallInput(
  input: MarginCallInput,
  rates?: CurrencyRatesSnapshot | null
): MarginCallValidation {
  const errors: MarginCallFieldErrors = {};

  const deposit = parseNumber(input.initialDeposit);
  const initialMargin = parseNumber(input.initialMarginPerContract);
  const maintenanceMargin = parseNumber(input.maintenanceMarginPerContract);
  const contracts = parseNumber(input.numberOfContracts);
  const tickValue = parseNumber(input.tickValue);
  const ticksPerPoint = parseNumber(input.ticksPerPoint);
  const buying = parseNumber(input.buyingPrice);
  const selling = parseNumber(input.sellingPrice);

  if (!deposit.blank && (deposit.invalid || deposit.value === null)) {
    errors.initialDeposit = 'Enter a valid initial deposit.';
  } else if (!deposit.blank && deposit.value !== null && deposit.value < 0) {
    errors.initialDeposit = 'Initial deposit cannot be negative.';
  }

  if (
    !initialMargin.blank &&
    (initialMargin.invalid || initialMargin.value === null)
  ) {
    errors.initialMarginPerContract = 'Enter a valid initial margin per contract.';
  } else if (
    !initialMargin.blank &&
    initialMargin.value !== null &&
    initialMargin.value < 0
  ) {
    errors.initialMarginPerContract = 'Initial margin cannot be negative.';
  }

  if (
    !maintenanceMargin.blank &&
    (maintenanceMargin.invalid || maintenanceMargin.value === null)
  ) {
    errors.maintenanceMarginPerContract =
      'Enter a valid maintenance margin per contract.';
  } else if (
    !maintenanceMargin.blank &&
    maintenanceMargin.value !== null &&
    maintenanceMargin.value < 0
  ) {
    errors.maintenanceMarginPerContract =
      'Maintenance margin cannot be negative.';
  }

  if (!contracts.blank && (contracts.invalid || contracts.value === null)) {
    errors.numberOfContracts = 'Enter a valid number of contracts.';
  } else if (
    !contracts.blank &&
    contracts.value !== null &&
    (!Number.isInteger(contracts.value) || contracts.value < 0)
  ) {
    errors.numberOfContracts = 'Contracts must be a whole number of 0 or more.';
  }

  if (tickValue.blank) {
    errors.tickValue = 'Enter a tick value.';
  } else if (tickValue.invalid || tickValue.value === null) {
    errors.tickValue = 'Enter a valid tick value.';
  } else if (tickValue.value < 0) {
    errors.tickValue = 'Tick value cannot be negative.';
  }

  if (ticksPerPoint.blank) {
    errors.ticksPerPoint = 'Enter ticks per point.';
  } else if (ticksPerPoint.invalid || ticksPerPoint.value === null) {
    errors.ticksPerPoint = 'Enter a valid number of ticks per point.';
  } else if (ticksPerPoint.value <= 0) {
    errors.ticksPerPoint = 'Ticks per point must be greater than zero.';
  }

  if (!buying.blank && (buying.invalid || buying.value === null)) {
    errors.buyingPrice = 'Enter a valid buying contract price.';
  }

  if (!selling.blank && (selling.invalid || selling.value === null)) {
    errors.sellingPrice = 'Enter a valid selling contract price.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const pointValueInTick = calculatePointValue({
    tickValue: tickValue.value!,
    ticksPerPoint: ticksPerPoint.value!,
  });
  if (pointValueInTick === null) {
    errors.form = 'This combination does not produce a finite point value.';
    return { isValid: false, errors, result: null };
  }

  const accountCurrency = input.initialDepositCurrency;
  const tickCurrency = input.tickValueCurrency;

  const pointValueDisplayed = convertMoney(
    pointValueInTick,
    tickCurrency,
    input.pointValueCurrency,
    rates
  );
  if (!pointValueDisplayed.ok) {
    errors.form = pointValueDisplayed.message;
    return { isValid: false, errors, result: null };
  }

  const pointValueInAccount = convertMoney(
    pointValueInTick,
    tickCurrency,
    accountCurrency,
    rates
  );
  if (!pointValueInAccount.ok) {
    errors.form = pointValueInAccount.message;
    return { isValid: false, errors, result: null };
  }

  const pricesReady = !buying.blank && !selling.blank;
  const contractsReady = !contracts.blank;
  const contractCount = contractsReady ? contracts.value! : 0;

  let numberOfPoints = 0;
  let longProfitLoss = 0;
  let shortProfitLoss = 0;
  let activeProfitLoss = 0;

  if (pricesReady) {
    const points = calculatePointsDifference({
      buyingPrice: buying.value!,
      sellingPrice: selling.value!,
    });
    if (points === null) {
      errors.form = 'Buying and selling prices must be finite.';
      return { isValid: false, errors, result: null };
    }
    numberOfPoints = points;

    if (contractsReady) {
      const pl = calculatePositionProfitLoss({
        numberOfPoints,
        pointValue: pointValueInAccount.amount,
        numberOfContracts: contractCount,
      });
      if (!pl) {
        errors.form = 'This combination does not produce a finite profit or loss.';
        return { isValid: false, errors, result: null };
      }
      longProfitLoss = pl.longProfitLoss;
      shortProfitLoss = pl.shortProfitLoss;
      activeProfitLoss =
        input.tradingDirection === 'long' ? longProfitLoss : shortProfitLoss;
    }
  }

  const profitLossDisplayed = convertMoney(
    activeProfitLoss,
    accountCurrency,
    input.profitLossCurrency,
    rates
  );
  if (!profitLossDisplayed.ok) {
    errors.form = profitLossDisplayed.message;
    return { isValid: false, errors, result: null };
  }

  const marginInputsReady =
    !deposit.blank &&
    !initialMargin.blank &&
    !maintenanceMargin.blank &&
    contractsReady;

  let totalInitialMargin = 0;
  let totalMaintenanceMargin = 0;
  let accountEquity = 0;
  let marginExcess = 0;
  let isMarginCall = false;

  if (marginInputsReady) {
    const initialMarginNormalized = convertMoney(
      initialMargin.value!,
      input.initialMarginCurrency,
      accountCurrency,
      rates
    );
    if (!initialMarginNormalized.ok) {
      errors.form = initialMarginNormalized.message;
      return { isValid: false, errors, result: null };
    }
    const maintenanceMarginNormalized = convertMoney(
      maintenanceMargin.value!,
      input.maintenanceMarginCurrency,
      accountCurrency,
      rates
    );
    if (!maintenanceMarginNormalized.ok) {
      errors.form = maintenanceMarginNormalized.message;
      return { isValid: false, errors, result: null };
    }

    const summary = calculateMarginSummary({
      initialDeposit: deposit.value!,
      initialMarginPerContract: initialMarginNormalized.amount,
      maintenanceMarginPerContract: maintenanceMarginNormalized.amount,
      numberOfContracts: contractCount,
      activeProfitLoss,
    });
    if (!summary) {
      errors.form = 'Margin totals could not be calculated for these inputs.';
      return { isValid: false, errors, result: null };
    }
    totalInitialMargin = summary.totalInitialMargin;
    totalMaintenanceMargin = summary.totalMaintenanceMargin;
    accountEquity = summary.accountEquity;
    marginExcess = summary.marginExcess;
    isMarginCall = summary.isMarginCall;
  }

  const result: MarginCallResult = {
    pointValueInTickCurrency: pointValueInTick,
    pointValueDisplayed: pointValueDisplayed.amount,
    numberOfPoints,
    longProfitLossInAccountCurrency: longProfitLoss,
    shortProfitLossInAccountCurrency: shortProfitLoss,
    activeProfitLossInAccountCurrency: activeProfitLoss,
    activeProfitLossDisplayed: profitLossDisplayed.amount,
    totalInitialMarginInAccountCurrency: totalInitialMargin,
    totalMaintenanceMarginInAccountCurrency: totalMaintenanceMargin,
    accountEquityInAccountCurrency: accountEquity,
    marginExcessInAccountCurrency: marginExcess,
    isMarginCall,
    accountCurrency,
    tickCurrency,
    pointValueCurrency: input.pointValueCurrency,
    profitLossCurrency: input.profitLossCurrency,
    formattedPointValue: formatMarginCallMoney(
      pointValueDisplayed.amount,
      input.pointValueCurrency
    ),
    formattedNumberOfPoints: pricesReady
      ? formatMarginCallPoints(numberOfPoints)
      : '',
    formattedProfitLoss:
      pricesReady && contractsReady
        ? formatMarginCallMoney(
            profitLossDisplayed.amount,
            input.profitLossCurrency
          )
        : '',
    formattedTotalInitialMargin: marginInputsReady
      ? formatMarginCallMoney(totalInitialMargin, accountCurrency)
      : '',
    formattedTotalMaintenanceMargin: marginInputsReady
      ? formatMarginCallMoney(totalMaintenanceMargin, accountCurrency)
      : '',
    formattedAccountEquity: marginInputsReady
      ? formatMarginCallMoney(accountEquity, accountCurrency)
      : '',
    formattedMarginExcess: marginInputsReady
      ? formatMarginCallMoney(marginExcess, accountCurrency)
      : '',
  };

  return { isValid: true, errors: {}, result };
}
