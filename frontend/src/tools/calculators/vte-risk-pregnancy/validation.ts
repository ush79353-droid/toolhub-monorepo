import {
  calculateBmi,
  calculateVteRiskScore,
  heightToMeters,
  weightToKg,
} from './calculation';
import type {
  VteRiskPregnancyFieldErrors,
  VteRiskPregnancyInput,
  VteRiskPregnancyResult,
} from './types';

export interface VteRiskPregnancyValidation {
  isValid: boolean;
  errors: VteRiskPregnancyFieldErrors;
  result: VteRiskPregnancyResult | null;
  /** Derived BMI even when incomplete anthropometrics (null). */
  bmi: number | null;
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
 * Score always computes. Height/weight are optional for obesity points;
 * invalid numbers (when present) produce field errors but other ticks still score.
 */
export function validateVteRiskPregnancyInput(
  input: VteRiskPregnancyInput
): VteRiskPregnancyValidation {
  const errors: VteRiskPregnancyFieldErrors = {};
  let heightM: number | null = null;
  let weightKg: number | null = null;

  const h = parseNumber(input.heightValue);
  if (!h.blank) {
    if (h.invalid || h.value === null || h.value <= 0) {
      errors.heightValue = 'Enter a valid height.';
    } else {
      heightM = heightToMeters(h.value, input.heightUnit);
      if (heightM == null || heightM < 1 || heightM > 2.5) {
        errors.heightValue = 'Height is outside the supported range.';
        heightM = null;
      }
    }
  }

  const w = parseNumber(input.weightValue);
  if (!w.blank) {
    if (w.invalid || w.value === null || w.value <= 0) {
      errors.weightValue = 'Enter a valid weight.';
    } else {
      weightKg = weightToKg(w.value, input.weightUnit);
      if (weightKg == null || weightKg < 30 || weightKg > 300) {
        errors.weightValue = 'Weight is outside the supported range.';
        weightKg = null;
      }
    }
  }

  const bmi =
    heightM != null && weightKg != null
      ? calculateBmi(heightM, weightKg)
      : null;

  const result = calculateVteRiskScore(input, bmi);
  const hasHardError = Boolean(errors.heightValue || errors.weightValue);

  return {
    isValid: !hasHardError,
    errors,
    result: hasHardError ? null : result,
    bmi,
  };
}
