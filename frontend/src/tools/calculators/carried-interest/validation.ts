import { calculateCarriedInterest } from './calculation';
import type {
  CarriedInterestFieldErrors,
  CarriedInterestInput,
  CarriedInterestResult,
} from './types';

export interface CarriedInterestValidation {
  isValid: boolean;
  errors: CarriedInterestFieldErrors;
  result: CarriedInterestResult | null;
  /** Fund return when initial/final alone are valid. */
  partialFundReturn: { percent: number; formatted: string } | null;
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

export function validateCarriedInterestInput(
  input: CarriedInterestInput
): CarriedInterestValidation {
  const errors: CarriedInterestFieldErrors = {};

  const initial = parseNumber(input.initialFundValue);
  const final = parseNumber(input.finalFundValue);
  const years = parseNumber(input.holdPeriodYears);
  const hurdle = parseNumber(input.hurdleRatePercent);
  const carry = parseNumber(input.carriedInterestPercent);

  if (!initial.blank && (initial.invalid || initial.value === null)) {
    errors.initialFundValue = 'Enter a valid initial fund value.';
  } else if (!initial.blank && initial.value !== null && !(initial.value > 0)) {
    errors.initialFundValue = 'Initial fund value must be greater than zero.';
  }

  if (!final.blank && (final.invalid || final.value === null)) {
    errors.finalFundValue = 'Enter a valid final fund value.';
  } else if (!final.blank && final.value !== null && final.value < 0) {
    errors.finalFundValue = 'Final fund value cannot be negative.';
  }

  if (!years.blank && (years.invalid || years.value === null)) {
    errors.holdPeriodYears = 'Enter a valid hold period.';
  } else if (!years.blank && years.value !== null && !(years.value > 0)) {
    errors.holdPeriodYears = 'Hold period must be greater than zero.';
  }

  if (!hurdle.blank && (hurdle.invalid || hurdle.value === null)) {
    errors.hurdleRatePercent = 'Enter a valid hurdle rate.';
  } else if (!hurdle.blank && hurdle.value !== null && hurdle.value < 0) {
    errors.hurdleRatePercent = 'Hurdle rate cannot be negative.';
  }

  if (!carry.blank && (carry.invalid || carry.value === null)) {
    errors.carriedInterestPercent = 'Enter a valid carried interest rate.';
  } else if (!carry.blank && carry.value !== null && carry.value < 0) {
    errors.carriedInterestPercent = 'Carried interest cannot be negative.';
  } else if (!carry.blank && carry.value !== null && !(carry.value < 100)) {
    errors.carriedInterestPercent = 'Carried interest must be below 100%.';
  }

  let partialFundReturn: CarriedInterestValidation['partialFundReturn'] = null;
  if (
    !initial.blank &&
    !final.blank &&
    initial.value !== null &&
    final.value !== null &&
    !errors.initialFundValue &&
    !errors.finalFundValue
  ) {
    const pct = ((final.value - initial.value) / initial.value) * 100;
    if (Number.isFinite(pct)) {
      const rounded = Math.round(pct * 1e6) / 1e6;
      const formatted =
        Object.is(rounded, -0) || rounded === 0
          ? '0'
          : new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(rounded);
      partialFundReturn = { percent: rounded, formatted };
    }
  }

  const moneyBlank = initial.blank || final.blank;
  if (
    moneyBlank ||
    years.blank ||
    hurdle.blank ||
    carry.blank ||
    Object.keys(errors).length > 0 ||
    initial.value === null ||
    final.value === null ||
    years.value === null ||
    hurdle.value === null ||
    carry.value === null
  ) {
    return { isValid: false, errors, result: null, partialFundReturn };
  }

  const result = calculateCarriedInterest({
    initialFundValue: initial.value,
    finalFundValue: final.value,
    holdPeriodYears: years.value,
    hurdleRatePercent: hurdle.value,
    carriedInterestPercent: carry.value,
    gpCatchUp: input.gpCatchUp,
    currency: input.currency,
  });

  if (!result) {
    errors.form = 'Unable to calculate a finite carried interest amount.';
    return { isValid: false, errors, result: null, partialFundReturn };
  }

  return { isValid: true, errors: {}, result, partialFundReturn };
}
