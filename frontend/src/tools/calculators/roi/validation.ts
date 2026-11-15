import { calculateRoi } from './calculation';
import type { RoiFieldErrors, RoiInput, RoiResult } from './types';

export interface RoiValidation {
  isValid: boolean;
  errors: RoiFieldErrors;
  result: RoiResult | null;
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

export function validateRoiInput(input: RoiInput): RoiValidation {
  const errors: RoiFieldErrors = {};

  const period = parseNumber(input.periodValue);
  const initial = parseNumber(input.initialInvestment);
  const contrib = parseNumber(input.contributionAmount);
  const rate = parseNumber(input.rateOfReturnPercent);
  const returned = parseNumber(input.returnedAmount);

  if (!period.blank && (period.invalid || period.value === null || period.value <= 0)) {
    errors.periodValue = 'Enter a positive investment period.';
  }

  if (
    !initial.blank &&
    (initial.invalid || initial.value === null || initial.value <= 0)
  ) {
    errors.initialInvestment = 'Enter a positive initial invested amount.';
  }

  if (input.contributionFrequency !== 'none') {
    if (contrib.blank) {
      // wait for amount
    } else if (contrib.invalid || contrib.value === null || contrib.value < 0) {
      errors.contributionAmount = 'Enter a valid non-negative contribution.';
    }
  }

  if (input.sourceField === 'rate') {
    if (!rate.blank && (rate.invalid || rate.value === null)) {
      errors.rateOfReturnPercent = 'Enter a valid rate of return.';
    } else if (!rate.blank && rate.value !== null && rate.value <= -100) {
      errors.rateOfReturnPercent = 'Rate of return must be greater than -100%.';
    }
  } else {
    if (!returned.blank && (returned.invalid || returned.value === null)) {
      errors.returnedAmount = 'Enter a valid returned amount.';
    } else if (!returned.blank && returned.value !== null && returned.value < 0) {
      errors.returnedAmount = 'Returned amount cannot be negative.';
    }
  }

  if (input.annualizedMode === 'annualized') {
    if (!input.startDate.trim()) {
      errors.startDate = 'Enter a start date.';
    }
    if (!input.endDate.trim()) {
      errors.endDate = 'Enter an end date.';
    }
  }

  const needsContrib =
    input.contributionFrequency !== 'none' &&
    (contrib.blank || errors.contributionAmount);

  const incomplete =
    period.blank ||
    initial.blank ||
    needsContrib ||
    (input.sourceField === 'rate' ? rate.blank : returned.blank) ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateRoi({
    periodValue: period.value!,
    periodUnit: input.periodUnit,
    initialInvestment: initial.value!,
    contributionFrequency: input.contributionFrequency,
    contributionAmount:
      input.contributionFrequency === 'none' ? 0 : (contrib.value ?? 0),
    rateOfReturnPercent: rate.value,
    returnedAmount: returned.value,
    sourceField: input.sourceField,
    startDate: input.startDate,
    endDate: input.endDate,
    currency: input.currency,
  });

  if (!result) {
    errors.form = 'This combination does not produce a finite ROI.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
