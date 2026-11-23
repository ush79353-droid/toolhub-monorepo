import { calculateClomidOvulation, isValidIsoDate } from './calculation';
import type {
  ClomidOvulationFieldErrors,
  ClomidOvulationInput,
  ClomidOvulationResult,
} from './types';

export interface ClomidOvulationValidation {
  isValid: boolean;
  errors: ClomidOvulationFieldErrors;
  result: ClomidOvulationResult | null;
}

/** Practical upper bound for an educational course length (not a clinical max dose days). */
export const MAX_DURATION_DAYS = 14;

function parseDuration(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  if (!/^\d+$/.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isInteger(value) || !Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function validateClomidOvulationInput(
  input: ClomidOvulationInput
): ClomidOvulationValidation {
  const errors: ClomidOvulationFieldErrors = {};
  const start = input.treatmentStart.trim();
  const duration = parseDuration(input.durationDays);

  if (!start) {
    errors.treatmentStart = 'Enter the treatment start date.';
  } else if (!isValidIsoDate(start)) {
    errors.treatmentStart = 'Enter a valid treatment start date.';
  }

  if (duration.blank) {
    // Inactive ovulation field until duration is provided (screenshot).
    return {
      isValid: false,
      errors,
      result: null,
    };
  }

  if (duration.invalid || duration.value === null || duration.value < 1) {
    errors.durationDays = 'Enter a whole number of days (at least 1).';
    return { isValid: false, errors, result: null };
  }

  if (duration.value > MAX_DURATION_DAYS) {
    errors.durationDays = `Duration above ${MAX_DURATION_DAYS} days is outside this educational worksheet.`;
    return { isValid: false, errors, result: null };
  }

  if (errors.treatmentStart) {
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors,
    result: calculateClomidOvulation(input, duration.value),
  };
}
