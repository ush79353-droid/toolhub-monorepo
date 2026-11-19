import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateDepreciation,
  formatDepreciationMoney,
  methodLabel,
} from './calculation';
import {
  DEPRECIATION_METHODS,
  type DepreciationFieldErrors,
  type DepreciationInput,
  type DepreciationResult,
} from './types';

export interface DepreciationValidation {
  isValid: boolean;
  errors: DepreciationFieldErrors;
  result: DepreciationResult | null;
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
 * Normalize cost + salvage into original-cost currency, compute selected-year
 * expense and end book value, then FX-convert results into their display
 * currencies. Lifetime / years / rates never convert.
 */
export function validateDepreciationInput(
  input: DepreciationInput,
  rates?: CurrencyRatesSnapshot | null
): DepreciationValidation {
  const errors: DepreciationFieldErrors = {};

  if (!DEPRECIATION_METHODS.includes(input.method)) {
    errors.method = 'Choose a depreciation method.';
  }

  const cost = parseNumber(input.originalCost);
  const salvage = parseNumber(input.salvageValue);
  const life = parseNumber(input.lifetimeYears);
  const after = parseNumber(input.endBookAfterYears);
  const ratePct = parseNumber(input.decliningBalanceRatePercent);

  if (!cost.blank && (cost.invalid || cost.value === null)) {
    errors.originalCost = 'Enter a valid original cost.';
  } else if (cost.value !== null && cost.value < 0) {
    errors.originalCost = 'Original cost cannot be negative.';
  }

  if (!salvage.blank && (salvage.invalid || salvage.value === null)) {
    errors.salvageValue = 'Enter a valid salvage value.';
  } else if (salvage.value !== null && salvage.value < 0) {
    errors.salvageValue = 'Salvage value cannot be negative.';
  }

  if (!life.blank && (life.invalid || life.value === null)) {
    errors.lifetimeYears = 'Enter a valid lifetime.';
  } else if (life.value !== null) {
    if (!(life.value > 0)) {
      errors.lifetimeYears = 'Lifetime must be greater than zero.';
    } else if (!Number.isInteger(life.value)) {
      errors.lifetimeYears = 'Lifetime must be a whole number of years.';
    }
  }

  if (!after.blank && (after.invalid || after.value === null)) {
    errors.endBookAfterYears = 'Enter a valid year count.';
  } else if (after.value !== null) {
    if (after.value < 0) {
      errors.endBookAfterYears = 'Year count cannot be negative.';
    } else if (!Number.isInteger(after.value)) {
      errors.endBookAfterYears = 'Use a whole number of years.';
    } else if (
      life.value !== null &&
      Number.isInteger(life.value) &&
      after.value > life.value
    ) {
      errors.endBookAfterYears = 'Selected year cannot exceed useful life.';
    } else if (after.value === 0) {
      errors.endBookAfterYears = 'Select a year of at least 1 within useful life.';
    }
  }

  if (input.method === 'declining-balance') {
    if (ratePct.blank) {
      errors.decliningBalanceRatePercent = 'Enter a declining-balance rate.';
    } else if (ratePct.invalid || ratePct.value === null) {
      errors.decliningBalanceRatePercent = 'Enter a valid declining-balance rate.';
    } else if (!(ratePct.value > 0)) {
      errors.decliningBalanceRatePercent = 'Declining-balance rate must be greater than zero.';
    }
  }

  const incomplete =
    cost.blank ||
    salvage.blank ||
    life.blank ||
    after.blank ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  // Normalize salvage into cost currency before comparing / calculating.
  const calcCurrency = input.originalCostCurrency;
  const salvageInCalc = convertMoney(
    salvage.value!,
    input.salvageValueCurrency,
    calcCurrency,
    rates
  );
  if (!salvageInCalc.ok) {
    errors.form = salvageInCalc.message;
    return { isValid: false, errors, result: null };
  }

  if (salvageInCalc.amount > cost.value!) {
    errors.salvageValue = 'Salvage value cannot exceed original cost.';
    return { isValid: false, errors, result: null };
  }

  const decliningRate =
    input.method === 'declining-balance' ? ratePct.value! / 100 : null;

  const computed = calculateDepreciation({
    method: input.method,
    originalCost: cost.value!,
    salvageValue: salvageInCalc.amount,
    lifetimeYears: life.value!,
    endBookAfterYears: after.value!,
    decliningBalanceRate: decliningRate,
  });

  if (!computed) {
    errors.form = 'Unable to calculate depreciation with the given inputs.';
    return { isValid: false, errors, result: null };
  }

  const expenseDisplay = convertMoney(
    computed.depreciationExpense,
    calcCurrency,
    input.expenseCurrency,
    rates
  );
  if (!expenseDisplay.ok) {
    errors.form = expenseDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const bookDisplay = convertMoney(
    computed.endBookValue,
    calcCurrency,
    input.endBookCurrency,
    rates
  );
  if (!bookDisplay.ok) {
    errors.form = bookDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const formattedDepreciationExpense = formatDepreciationMoney(
    expenseDisplay.amount,
    input.expenseCurrency
  );
  const formattedEndBookValue = formatDepreciationMoney(
    bookDisplay.amount,
    input.endBookCurrency
  );

  const result: DepreciationResult = {
    method: computed.method,
    calcCurrency,
    originalCostCanonical: cost.value!,
    salvageValueCanonical: salvageInCalc.amount,
    lifetimeYears: computed.lifetimeYears,
    endBookAfterYears: computed.endBookAfterYears,
    decliningBalanceRate: computed.decliningBalanceRate,
    depreciationExpenseCanonical: computed.depreciationExpense,
    endBookValueCanonical: computed.endBookValue,
    depreciationExpenseDisplay: expenseDisplay.amount,
    endBookValueDisplay: bookDisplay.amount,
    expenseCurrency: input.expenseCurrency,
    endBookCurrency: input.endBookCurrency,
    formattedDepreciationExpense,
    formattedEndBookValue,
    summaryText: `${methodLabel(computed.method)} · year ${computed.endBookAfterYears} expense ${formattedDepreciationExpense} · end book ${formattedEndBookValue}.`,
  };

  return { isValid: true, errors: {}, result };
}
