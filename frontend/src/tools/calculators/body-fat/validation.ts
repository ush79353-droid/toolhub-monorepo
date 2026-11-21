import { computeBodyFat, parseLoose, toCm, toKg, computeBmi } from './calculation';
import type {
  BodyFatFieldErrors,
  BodyFatInput,
  BodyFatResult,
} from './types';

export interface BodyFatValidation {
  isValid: boolean;
  errors: BodyFatFieldErrors;
  result: BodyFatResult | null;
}

export function validateBodyFatInput(input: BodyFatInput): BodyFatValidation {
  const errors: BodyFatFieldErrors = {};

  const age = parseLoose(input.age);
  if (age === null) {
    errors.age = 'Enter age in years.';
  } else if (input.method === 'navy') {
    if (age < 17 || age > 120) {
      errors.age = 'Navy estimate supports ages 17–120.';
    }
  } else if (age < 18 || age > 120) {
    errors.age = 'ADA and BMI methods support ages 18–120.';
  }

  const heightRaw = parseLoose(input.height);
  if (heightRaw === null || heightRaw <= 0) {
    errors.height = 'Enter a positive height.';
  } else {
    const cm = toCm(heightRaw, input.heightUnit);
    if (!(cm >= 50 && cm <= 275)) {
      errors.height = 'Height is outside a realistic range.';
    }
  }

  const weightRaw = parseLoose(input.weight);
  if (weightRaw === null || weightRaw <= 0) {
    errors.weight = 'Enter a positive body weight.';
  } else {
    const kg = toKg(weightRaw, input.weightUnit);
    if (!(kg >= 20 && kg <= 400)) {
      errors.weight = 'Weight is outside a realistic range.';
    }
  }

  if (input.method === 'navy') {
    const neckRaw = parseLoose(input.neck);
    if (neckRaw === null || neckRaw <= 0) {
      errors.neck = 'Enter neck circumference.';
    } else {
      const neckCm = toCm(neckRaw, input.circumferenceUnit);
      if (!(neckCm >= 20 && neckCm <= 80)) {
        errors.neck = 'Neck circumference is outside a realistic range.';
      }
    }

    const waistRaw = parseLoose(input.waist);
    if (waistRaw === null || waistRaw <= 0) {
      errors.waist = 'Enter waist circumference.';
    } else {
      const waistCm = toCm(waistRaw, input.circumferenceUnit);
      if (!(waistCm >= 40 && waistCm <= 200)) {
        errors.waist = 'Waist circumference is outside a realistic range.';
      }
    }

    if (input.sex === 'female') {
      const hipRaw = parseLoose(input.hip);
      if (hipRaw === null || hipRaw <= 0) {
        errors.hip = 'Enter hip circumference for the Navy female equation.';
      } else {
        const hipCm = toCm(hipRaw, input.circumferenceUnit);
        if (!(hipCm >= 50 && hipCm <= 200)) {
          errors.hip = 'Hip circumference is outside a realistic range.';
        }
      }
    }

    // Structural Navy guard: waist−neck (male) or waist+hip−neck (female) > 0
    if (!errors.neck && !errors.waist && !(input.sex === 'female' && errors.hip)) {
      const neckCm = toCm(neckRaw!, input.circumferenceUnit);
      const waistCm = toCm(waistRaw!, input.circumferenceUnit);
      if (input.sex === 'male') {
        if (!(waistCm - neckCm > 0)) {
          errors.waist = 'Waist must be larger than neck for the Navy male equation.';
        }
      } else {
        const hipCm = toCm(parseLoose(input.hip)!, input.circumferenceUnit);
        if (!(waistCm + hipCm - neckCm > 0)) {
          errors.form =
            'Waist + hip must be larger than neck for the Navy female equation.';
        }
      }
    }
  }

  if (
    !errors.height &&
    !errors.weight &&
    heightRaw !== null &&
    weightRaw !== null
  ) {
    const bmi = computeBmi(
      toKg(weightRaw, input.weightUnit),
      toCm(heightRaw, input.heightUnit),
    );
    if (!(bmi > 10 && bmi < 80)) {
      errors.form = 'BMI from height and weight is outside a supported model range.';
    }
  }

  const hasErrors = Object.keys(errors).length > 0;
  if (hasErrors) {
    return { isValid: false, errors, result: null };
  }

  const result = computeBodyFat(input);
  if (!result) {
    return {
      isValid: false,
      errors: {
        form: 'Could not estimate body fat for these inputs (unsupported combination or out-of-range result).',
      },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
