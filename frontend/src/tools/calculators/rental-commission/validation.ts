import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  annualFromMonthly,
  calculateRentalCommission,
  formatRentalCommissionMoney,
  monthlyFromAnnual,
} from './calculation';
import type {
  RentalCommissionFieldErrors,
  RentalCommissionInput,
  RentalCommissionResult,
} from './types';

export interface RentalCommissionValidation {
  isValid: boolean;
  errors: RentalCommissionFieldErrors;
  result: RentalCommissionResult | null;
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
 * Validates rent + custom %, syncs annual/monthly from rentSource, normalizes to
 * annualCurrency for the engine, then converts each money result to its display currency.
 */
export function validateRentalCommissionInput(
  input: RentalCommissionInput,
  rates?: CurrencyRatesSnapshot | null
): RentalCommissionValidation {
  const errors: RentalCommissionFieldErrors = {};

  const annual = parseNumber(input.annualRent);
  const monthly = parseNumber(input.monthlyRent);
  const customPercent = parseNumber(input.customPercent);

  if (!annual.blank && (annual.invalid || annual.value === null)) {
    errors.annualRent = 'Enter a valid annual rent.';
  } else if (!annual.blank && annual.value !== null && annual.value < 0) {
    errors.annualRent = 'Annual rent cannot be negative.';
  }

  if (!monthly.blank && (monthly.invalid || monthly.value === null)) {
    errors.monthlyRent = 'Enter a valid monthly rent.';
  } else if (!monthly.blank && monthly.value !== null && monthly.value < 0) {
    errors.monthlyRent = 'Monthly rent cannot be negative.';
  }

  if (customPercent.blank) {
    errors.customPercent = 'Enter a custom percentage.';
  } else if (customPercent.invalid || customPercent.value === null) {
    errors.customPercent = 'Enter a valid percentage.';
  } else if (customPercent.value < 0) {
    errors.customPercent = 'Percentage cannot be negative.';
  }

  const hasRent =
    (input.rentSource === 'annual' && !annual.blank && annual.value !== null) ||
    (input.rentSource === 'monthly' && !monthly.blank && monthly.value !== null) ||
    (!annual.blank && annual.value !== null) ||
    (!monthly.blank && monthly.value !== null);

  if (!hasRent) {
    return { isValid: false, errors, result: null };
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  // Resolve annual + monthly in their own currencies, then normalize to annualCurrency.
  let annualInOwn: number;
  let monthlyInOwn: number;

  if (input.rentSource === 'monthly' && monthly.value !== null) {
    monthlyInOwn = monthly.value;
    annualInOwn = annualFromMonthly(monthlyInOwn);
    // annual displayed currency may differ — convert monthly→annual currency for annual value
    const annualConverted = convertMoney(
      annualInOwn,
      input.monthlyCurrency,
      input.annualCurrency,
      rates
    );
    if (!annualConverted.ok) {
      errors.form = annualConverted.message;
      return { isValid: false, errors, result: null };
    }
    annualInOwn = annualConverted.amount;
    // Keep monthly in monthlyCurrency; for engine use monthly in annualCurrency
  } else if (annual.value !== null) {
    annualInOwn = annual.value;
    const monthlyCanon = monthlyFromAnnual(annualInOwn);
    const monthlyConverted = convertMoney(
      monthlyCanon,
      input.annualCurrency,
      input.monthlyCurrency,
      rates
    );
    if (!monthlyConverted.ok) {
      errors.form = monthlyConverted.message;
      return { isValid: false, errors, result: null };
    }
    monthlyInOwn = monthlyConverted.amount;
  } else if (monthly.value !== null) {
    monthlyInOwn = monthly.value;
    const annualConverted = convertMoney(
      annualFromMonthly(monthlyInOwn),
      input.monthlyCurrency,
      input.annualCurrency,
      rates
    );
    if (!annualConverted.ok) {
      errors.form = annualConverted.message;
      return { isValid: false, errors, result: null };
    }
    annualInOwn = annualConverted.amount;
  } else {
    return { isValid: false, errors, result: null };
  }

  // Engine currency = annualCurrency
  const monthlyInAnnual = convertMoney(
    monthlyInOwn,
    input.monthlyCurrency,
    input.annualCurrency,
    rates
  );
  if (!monthlyInAnnual.ok) {
    errors.form = monthlyInAnnual.message;
    return { isValid: false, errors, result: null };
  }

  // When source is annual, prefer exact annual and derived monthly in annual currency
  let annualCanonical = annualInOwn;
  let monthlyCanonical = monthlyInAnnual.amount;
  if (input.rentSource === 'annual' && annual.value !== null) {
    annualCanonical = annual.value;
    monthlyCanonical = monthlyFromAnnual(annualCanonical);
  } else if (input.rentSource === 'monthly' && monthly.value !== null) {
    monthlyCanonical = monthlyInAnnual.amount;
    annualCanonical = annualFromMonthly(monthlyCanonical);
  }

  const calc = calculateRentalCommission({
    annualRent: annualCanonical,
    monthlyRent: monthlyCanonical,
    customPercent: customPercent.value!,
  });
  if (!calc) {
    errors.form = 'This combination does not produce a finite estimate.';
    return { isValid: false, errors, result: null };
  }

  const toDisplay = (
    amount: number,
    to: SupportedCurrency
  ): { ok: true; amount: number } | { ok: false; message: string } =>
    convertMoney(amount, input.annualCurrency, to, rates);

  const half = toDisplay(calc.halfMonth, input.halfMonthCurrency);
  const one = toDisplay(calc.oneMonth, input.oneMonthCurrency);
  const oneHalf = toDisplay(calc.oneHalfMonth, input.oneHalfMonthCurrency);
  const custom = toDisplay(calc.customAmount, input.customAmountCurrency);
  const annualDisplay = toDisplay(annualCanonical, input.annualCurrency);
  const monthlyDisplay = toDisplay(monthlyCanonical, input.monthlyCurrency);

  for (const part of [half, one, oneHalf, custom, annualDisplay, monthlyDisplay]) {
    if (!part.ok) {
      errors.form = part.message;
      return { isValid: false, errors, result: null };
    }
  }

  const result: RentalCommissionResult = {
    annualRentCanonical: annualCanonical,
    monthlyRentCanonical: monthlyCanonical,
    halfMonthCanonical: calc.halfMonth,
    oneMonthCanonical: calc.oneMonth,
    oneHalfMonthCanonical: calc.oneHalfMonth,
    customAmountCanonical: calc.customAmount,
    halfMonth: half.amount,
    oneMonth: one.amount,
    oneHalfMonth: oneHalf.amount,
    customAmount: custom.amount,
    annualCurrency: input.annualCurrency,
    monthlyCurrency: input.monthlyCurrency,
    halfMonthCurrency: input.halfMonthCurrency,
    oneMonthCurrency: input.oneMonthCurrency,
    oneHalfMonthCurrency: input.oneHalfMonthCurrency,
    customAmountCurrency: input.customAmountCurrency,
    formattedHalfMonth: formatRentalCommissionMoney(half.amount, input.halfMonthCurrency),
    formattedOneMonth: formatRentalCommissionMoney(one.amount, input.oneMonthCurrency),
    formattedOneHalfMonth: formatRentalCommissionMoney(
      oneHalf.amount,
      input.oneHalfMonthCurrency
    ),
    formattedCustomAmount: formatRentalCommissionMoney(
      custom.amount,
      input.customAmountCurrency
    ),
    formattedAnnualRent: formatRentalCommissionMoney(
      annualDisplay.amount,
      input.annualCurrency
    ),
    formattedMonthlyRent: formatRentalCommissionMoney(
      monthlyDisplay.amount,
      input.monthlyCurrency
    ),
    customPercent: customPercent.value!,
  };

  return { isValid: true, errors: {}, result };
}
