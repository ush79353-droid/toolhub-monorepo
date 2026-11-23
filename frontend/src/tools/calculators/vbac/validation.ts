import {
  calculateVbac,
  heightToCm,
  weightToKg,
} from './calculation';
import type {
  VbacFieldErrors,
  VbacInput,
  VbacResult,
} from './types';

export interface VbacValidation {
  isValid: boolean;
  errors: VbacFieldErrors;
  result: VbacResult | null;
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
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

/**
 * Probability stays hidden until age, height, and pre-pregnancy weight are valid.
 * No probability cutoffs gate access — any valid inputs return a result.
 */
export function validateVbacInput(input: VbacInput): VbacValidation {
  const errors: VbacFieldErrors = {};

  const ageParsed = parseNumber(input.ageYears);
  if (ageParsed.blank) {
    return { isValid: false, errors, result: null };
  }
  if (ageParsed.invalid || ageParsed.value == null) {
    errors.ageYears = 'Enter a valid age in years.';
    return { isValid: false, errors, result: null };
  }
  if (ageParsed.value < 15 || ageParsed.value > 55) {
    errors.ageYears = 'Age should be between 15 and 55 years for this model.';
    return { isValid: false, errors, result: null };
  }

  const hParsed = parseNumber(input.heightValue);
  if (hParsed.blank) {
    return { isValid: false, errors, result: null };
  }
  if (hParsed.invalid || hParsed.value == null || hParsed.value <= 0) {
    errors.heightValue = 'Enter a valid height.';
    return { isValid: false, errors, result: null };
  }
  const heightCm = heightToCm(hParsed.value, input.heightUnit);
  if (heightCm == null || heightCm < 120 || heightCm > 220) {
    errors.heightValue = 'Height is outside the supported range.';
    return { isValid: false, errors, result: null };
  }

  const wParsed = parseNumber(input.weightValue);
  if (wParsed.blank) {
    return { isValid: false, errors, result: null };
  }
  if (wParsed.invalid || wParsed.value == null || wParsed.value <= 0) {
    errors.weightValue = 'Enter a valid pre-pregnancy weight.';
    return { isValid: false, errors, result: null };
  }
  const weightKg = weightToKg(wParsed.value, input.weightUnit);
  if (weightKg == null || weightKg < 35 || weightKg > 200) {
    errors.weightValue = 'Pre-pregnancy weight is outside the supported range.';
    return { isValid: false, errors, result: null };
  }

  const result = calculateVbac(
    {
      ageYears: ageParsed.value,
      weightKg,
      heightCm,
    },
    input
  );

  return { isValid: true, errors, result };
}