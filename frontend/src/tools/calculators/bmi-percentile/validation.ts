import {
  WHO_BMI_AGE_MONTHS_MAX,
  WHO_BMI_AGE_MONTHS_MIN,
} from './datasets';
import {
  ageToMonths,
  calculateBmiPercentile,
  computeBmiFromAnthropometry,
  heightToCm,
  weightToKg,
} from './calculation';
import type {
  BmiPercentileFieldErrors,
  BmiPercentileInput,
  BmiPercentileResult,
} from './types';

export interface BmiPercentileValidation {
  isValid: boolean;
  errors: BmiPercentileFieldErrors;
  result: BmiPercentileResult | null;
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

export function validateBmiPercentileInput(
  input: BmiPercentileInput
): BmiPercentileValidation {
  const errors: BmiPercentileFieldErrors = {};
  let hasError = false;

  const age = parseNumber(input.age);
  let ageMonths: number | null = null;
  if (age.blank) {
    errors.age = `Enter age in ${input.ageUnit === 'yrs' ? 'years' : 'months'}.`;
    hasError = true;
  } else if (age.invalid || age.value === null || age.value < 0) {
    errors.age = 'Enter a valid non-negative age.';
    hasError = true;
  } else {
    ageMonths = ageToMonths(age.value, input.ageUnit);
    if (
      ageMonths < WHO_BMI_AGE_MONTHS_MIN ||
      ageMonths > WHO_BMI_AGE_MONTHS_MAX
    ) {
      errors.age = `WHO child BMI standards cover ${WHO_BMI_AGE_MONTHS_MIN}–${WHO_BMI_AGE_MONTHS_MAX} months (0–5 years). Ages outside this range are not extrapolated.`;
      hasError = true;
      ageMonths = null;
    }
  }

  let bmi: number | null = null;

  if (input.knowBmi) {
    const b = parseNumber(input.bmi);
    if (b.blank) {
      errors.bmi = "Enter the child's BMI.";
      hasError = true;
    } else if (b.invalid || b.value === null || b.value <= 0) {
      errors.bmi = 'Enter a positive BMI.';
      hasError = true;
    } else if (b.value > 60) {
      errors.bmi = 'BMI is outside the supported range.';
      hasError = true;
    } else {
      bmi = b.value;
    }
  } else {
    const h = parseNumber(input.height);
    const w = parseNumber(input.weight);
    let heightCm: number | null = null;
    let weightKg: number | null = null;

    if (h.blank) {
      errors.height = 'Enter height.';
      hasError = true;
    } else if (h.invalid || h.value === null || h.value <= 0) {
      errors.height = 'Enter a valid positive height.';
      hasError = true;
    } else {
      heightCm = heightToCm(h.value, input.heightUnit);
      if (heightCm < 30 || heightCm > 150) {
        errors.height = 'Height is outside the supported child range.';
        hasError = true;
        heightCm = null;
      }
    }

    if (w.blank) {
      errors.weight = 'Enter weight.';
      hasError = true;
    } else if (w.invalid || w.value === null || w.value <= 0) {
      errors.weight = 'Enter a valid positive weight.';
      hasError = true;
    } else {
      weightKg = weightToKg(w.value, input.weightUnit);
      if (weightKg < 1 || weightKg > 50) {
        errors.weight = 'Weight is outside the supported child range.';
        hasError = true;
        weightKg = null;
      }
    }

    if (heightCm !== null && weightKg !== null) {
      try {
        bmi = computeBmiFromAnthropometry(heightCm, weightKg);
      } catch {
        errors.form = 'Unable to compute BMI from height and weight.';
        hasError = true;
      }
    }
  }

  if (hasError || ageMonths === null || bmi === null) {
    return { isValid: false, errors, result: null };
  }

  try {
    const result = calculateBmiPercentile({
      ageMonths,
      sex: input.sex,
      bmi,
    });
    return { isValid: true, errors: {}, result };
  } catch (err) {
    errors.form =
      err instanceof Error
        ? err.message
        : 'Unable to calculate BMI percentile.';
    return { isValid: false, errors, result: null };
  }
}
