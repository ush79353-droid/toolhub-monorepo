import { calculateTimeValueOfMoney } from './calculation';
import type {
  TimeValueOfMoneyFieldErrors,
  TimeValueOfMoneyInput,
  TimeValueOfMoneyResult,
} from './types';

export interface TimeValueOfMoneyValidation {
  isValid: boolean;
  errors: TimeValueOfMoneyFieldErrors;
  result: TimeValueOfMoneyResult | null;
}

function parseNumber(raw: string): { value: number | null; blank: boolean; invalid: boolean } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

function parseNonNegative(
  raw: string,
  label: string,
  blankAsZero = false
): { value: number | null; blank: boolean; error?: string } {
  const parsed = parseNumber(raw);
  if (parsed.blank) {
    return blankAsZero ? { value: 0, blank: true } : { value: null, blank: true };
  }
  if (parsed.invalid || parsed.value === null) {
    return { value: null, blank: false, error: `Enter a valid ${label}.` };
  }
  if (parsed.value < 0) {
    return { value: null, blank: false, error: `${label} cannot be negative.` };
  }
  return { value: parsed.value, blank: false };
}

export function validateTimeValueOfMoneyInput(
  input: TimeValueOfMoneyInput
): TimeValueOfMoneyValidation {
  const errors: TimeValueOfMoneyFieldErrors = {};

  const rate = parseNumber(input.interestRatePercent);
  const years = parseNonNegative(input.years, 'Years', true);
  const months = parseNonNegative(input.months, 'Months', true);
  const presentValue = parseNonNegative(input.presentValue, 'Present value');
  const futureValue = parseNonNegative(input.futureValue, 'Future value');

  if (rate.blank) {
    errors.interestRatePercent = 'Enter an interest rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  }

  if (years.error) errors.years = years.error;
  if (months.error) errors.months = months.error;

  if (input.sourceField === 'presentValue') {
    if (presentValue.blank) {
      errors.presentValue = 'Enter a present value.';
    } else if (presentValue.error) {
      errors.presentValue = presentValue.error;
    }
  } else if (futureValue.blank) {
    errors.futureValue = 'Enter a future value.';
  } else if (futureValue.error) {
    errors.futureValue = futureValue.error;
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateTimeValueOfMoney({
    interestRatePercent: rate.value!,
    years: years.value ?? 0,
    months: months.value ?? 0,
    compounding: input.compounding,
    presentValue: presentValue.value ?? 0,
    futureValue: futureValue.value ?? 0,
    sourceField: input.sourceField,
    currency: input.currency,
  });

  if (!result) {
    errors.form =
      'This combination does not produce a finite result. Check the rate and compound frequency.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
