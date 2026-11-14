import { calculateFromTotalReturn, calculateFromValues } from './calculation';
import type {
  AnnualizedReturnDraft,
  AnnualizedReturnFieldErrors,
  AnnualizedReturnResult,
} from './types';

export interface AnnualizedReturnValidation {
  incomplete: boolean;
  errors: AnnualizedReturnFieldErrors;
  result: AnnualizedReturnResult | null;
}

function parseNumber(
  raw: string,
  label: string
): { value: number | null; blank: boolean; error?: string } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, error: `Enter a valid ${label}.` };
  }
  if (!/^[+-]?\d+(\.\d+)?$/.test(cleaned)) {
    return { value: null, blank: false, error: `${label} must be a number.` };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, error: `Enter a valid ${label}.` };
  }
  return { value, blank: false };
}

export function validateAnnualizedReturnDraft(
  draft: AnnualizedReturnDraft
): AnnualizedReturnValidation {
  const errors: AnnualizedReturnFieldErrors = {};
  const years = parseNumber(draft.holdingPeriodYears, 'Holding period');

  if (!years.blank && years.error) errors.holdingPeriodYears = years.error;
  if (!years.blank && years.value !== null && years.value <= 0) {
    errors.holdingPeriodYears = 'Holding period must be greater than zero.';
  }

  if (draft.mode === 'total-return') {
    const total = parseNumber(draft.totalReturnPercent, 'Total return');
    if (!total.blank && total.error) errors.totalReturnPercent = total.error;
    if (!total.blank && total.value !== null && total.value < -100) {
      errors.totalReturnPercent = 'Total return cannot be below −100%.';
    }

    const incomplete = total.blank || years.blank;
    if (incomplete || Object.keys(errors).length > 0) {
      return {
        incomplete: incomplete && Object.keys(errors).length === 0,
        errors,
        result: null,
      };
    }

    const result = calculateFromTotalReturn(total.value!, years.value!);
    if (!result) {
      errors.form = 'This combination does not produce a finite annualized return.';
      return { incomplete: false, errors, result: null };
    }
    return { incomplete: false, errors: {}, result };
  }

  const beginning = parseNumber(draft.beginningValue, 'Beginning value');
  const ending = parseNumber(draft.endingValue, 'Ending value');

  if (!beginning.blank && beginning.error) errors.beginningValue = beginning.error;
  if (!ending.blank && ending.error) errors.endingValue = ending.error;

  if (!beginning.blank && beginning.value !== null && beginning.value <= 0) {
    errors.beginningValue = 'Beginning value must be greater than zero.';
  }
  if (!ending.blank && ending.value !== null && ending.value < 0) {
    errors.endingValue = 'Ending value cannot be negative.';
  }

  const incomplete = beginning.blank || ending.blank || years.blank;
  if (incomplete || Object.keys(errors).length > 0) {
    return {
      incomplete: incomplete && Object.keys(errors).length === 0,
      errors,
      result: null,
    };
  }

  const result = calculateFromValues(beginning.value!, ending.value!, years.value!);
  if (!result) {
    errors.form = 'This combination does not produce a finite annualized return.';
    return { incomplete: false, errors, result: null };
  }
  return { incomplete: false, errors: {}, result };
}
