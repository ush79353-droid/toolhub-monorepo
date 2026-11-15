import { calculateFutureValue } from './calculation';
import type {
  FutureValueFieldErrors,
  FutureValueInput,
  FutureValueResult,
} from './types';

export interface FutureValueValidation {
  isValid: boolean;
  errors: FutureValueFieldErrors;
  result: FutureValueResult | null;
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

export function validateFutureValueInput(input: FutureValueInput): FutureValueValidation {
  const errors: FutureValueFieldErrors = {};

  const pv = parseNumber(input.presentValue);
  const periods = parseNumber(input.periods);
  const rate = parseNumber(input.interestRatePercent);
  const pmt = parseNumber(input.periodicAmount);

  if (!pv.blank && (pv.invalid || pv.value === null)) {
    errors.presentValue = 'Enter a valid present value.';
  }

  if (!periods.blank && (periods.invalid || periods.value === null)) {
    errors.periods = 'Enter a valid number of periods.';
  } else if (!periods.blank && periods.value !== null) {
    if (periods.value < 0) errors.periods = 'Number of periods cannot be negative.';
    else if (!Number.isInteger(periods.value)) {
      errors.periods = 'Number of periods must be a whole number.';
    }
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (!rate.blank && rate.value !== null && !(rate.value > -100)) {
    errors.interestRatePercent = 'Interest rate must be greater than −100%.';
  }

  if (input.includePeriodic) {
    if (!pmt.blank && (pmt.invalid || pmt.value === null)) {
      errors.periodicAmount = 'Enter a valid periodic amount.';
    }
  }

  const needsPmt = input.includePeriodic;
  const incomplete =
    pv.blank ||
    periods.blank ||
    rate.blank ||
    (needsPmt && pmt.blank) ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateFutureValue({
    presentValue: pv.value!,
    periods: periods.value!,
    interestRatePercent: rate.value!,
    includePeriodic: input.includePeriodic,
    periodicAmount: needsPmt ? pmt.value! : 0,
    periodicTiming: input.periodicTiming,
    currency: input.currency,
  });

  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
