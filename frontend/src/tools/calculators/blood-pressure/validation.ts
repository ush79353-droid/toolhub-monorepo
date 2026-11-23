import { calculateBloodPressure } from './calculation';
import type {
  BloodPressureFieldErrors,
  BloodPressureInput,
  BloodPressureResult,
} from './types';

export interface BloodPressureValidation {
  isValid: boolean;
  errors: BloodPressureFieldErrors;
  result: BloodPressureResult | null;
}

/** Practical physiologic display bounds for a single office reading entry. */
export const MIN_MMHG = 1;
export const MAX_MMHG = 300;

function parseMmHg(raw: string): {
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
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

/**
 * Category stays inactive until both systolic and diastolic are valid positive
 * mmHg values within the supported entry range.
 */
export function validateBloodPressureInput(
  input: BloodPressureInput
): BloodPressureValidation {
  const errors: BloodPressureFieldErrors = {};
  const sys = parseMmHg(input.systolic);
  const dia = parseMmHg(input.diastolic);

  if (sys.blank && dia.blank) {
    return { isValid: false, errors, result: null };
  }

  if (sys.blank) {
    errors.systolic = 'Enter systolic blood pressure in mmHg.';
  } else if (sys.invalid || sys.value === null || sys.value <= 0) {
    errors.systolic = 'Enter a valid positive systolic value in mmHg.';
  } else if (sys.value < MIN_MMHG || sys.value > MAX_MMHG) {
    errors.systolic = `Systolic must be between ${MIN_MMHG} and ${MAX_MMHG} mmHg.`;
  }

  if (dia.blank) {
    errors.diastolic = 'Enter diastolic blood pressure in mmHg.';
  } else if (dia.invalid || dia.value === null || dia.value <= 0) {
    errors.diastolic = 'Enter a valid positive diastolic value in mmHg.';
  } else if (dia.value < MIN_MMHG || dia.value > MAX_MMHG) {
    errors.diastolic = `Diastolic must be between ${MIN_MMHG} and ${MAX_MMHG} mmHg.`;
  }

  if (errors.systolic || errors.diastolic) {
    return { isValid: false, errors, result: null };
  }

  const systolicMmHg = sys.value!;
  const diastolicMmHg = dia.value!;
  const result = calculateBloodPressure(input, systolicMmHg, diastolicMmHg);

  if (result.inconsistentOrder) {
    errors.form =
      'Systolic is usually higher than diastolic. Check the reading order (XXX/YY mmHg).';
  }

  return {
    isValid: true,
    errors,
    result,
  };
}
