import { calculateGssIiFromParsed, assessFilingDeadline } from './calculation';
import type {
  CaliforniaStimulusCheckIiFieldErrors,
  CaliforniaStimulusCheckIiInput,
  CaliforniaStimulusCheckIiResult,
} from './types';

export interface CaliforniaStimulusCheckIiValidation {
  isValid: boolean;
  errors: CaliforniaStimulusCheckIiFieldErrors;
  result: CaliforniaStimulusCheckIiResult | null;
}

function parseMoney(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '').replace(/^\$/, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

export function validateCaliforniaStimulusCheckIiInput(
  input: CaliforniaStimulusCheckIiInput
): CaliforniaStimulusCheckIiValidation {
  const errors: CaliforniaStimulusCheckIiFieldErrors = {};

  const agi = parseMoney(input.californiaAgi);
  if (!agi.blank && (agi.invalid || agi.value === null)) {
    errors.californiaAgi = 'Enter a valid California Adjusted Gross Income.';
  } else if (!agi.blank && agi.value !== null && agi.value < 0) {
    errors.californiaAgi = 'California Adjusted Gross Income cannot be negative.';
  }

  const filing = assessFilingDeadline({
    taxFileId: input.taxFileId,
    taxFilingDate: input.taxFilingDate,
  });
  if (filing.status === 'invalid') {
    errors.taxFilingDate = filing.note;
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors: {},
    result: calculateGssIiFromParsed(input, agi.blank ? null : agi.value),
  };
}
