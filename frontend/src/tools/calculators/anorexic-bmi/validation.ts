import {
  ADULT_BMI_AGE_MAX,
  calculateAnorexicBmi,
  heightToMeters,
  usHeightToMeters,
  weightToKg,
} from './calculation';
import type {
  AnorexicBmiFieldErrors,
  AnorexicBmiInput,
  AnorexicBmiResult,
} from './types';

export interface AnorexicBmiValidation {
  isValid: boolean;
  errors: AnorexicBmiFieldErrors;
  result: AnorexicBmiResult | null;
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

export function validateAnorexicBmiInput(
  input: AnorexicBmiInput
): AnorexicBmiValidation {
  const errors: AnorexicBmiFieldErrors = {};
  let hasFieldError = false;

  const age = parseNumber(input.age);
  if (age.blank) {
    errors.age = 'Enter age in years.';
    hasFieldError = true;
  } else if (
    age.invalid ||
    age.value === null ||
    !Number.isInteger(age.value)
  ) {
    errors.age = 'Enter a whole age in years.';
    hasFieldError = true;
  } else if (age.value < 1 || age.value > ADULT_BMI_AGE_MAX) {
    errors.age = `Age must be between 1 and ${ADULT_BMI_AGE_MAX}.`;
    hasFieldError = true;
  }

  let heightMeters: number | null = null;
  let weightKg: number | null = null;

  if (input.unitSystem === 'metric') {
    const h = parseNumber(input.heightCm);
    if (h.blank) {
      errors.height = 'Enter height in centimeters.';
      hasFieldError = true;
    } else if (h.invalid || h.value === null) {
      errors.height = 'Enter a valid height.';
      hasFieldError = true;
    } else if (h.value <= 0 || h.value > 300) {
      errors.height = 'Height must be greater than 0 and at most 300 cm.';
      hasFieldError = true;
    } else {
      heightMeters = heightToMeters(h.value, 'cm');
    }

    const w = parseNumber(input.weightKg);
    if (w.blank) {
      errors.weight = 'Enter weight in kilograms.';
      hasFieldError = true;
    } else if (w.invalid || w.value === null) {
      errors.weight = 'Enter a valid weight.';
      hasFieldError = true;
    } else if (w.value <= 0 || w.value > 500) {
      errors.weight = 'Weight must be greater than 0 and at most 500 kg.';
      hasFieldError = true;
    } else {
      weightKg = w.value;
    }
  } else if (input.unitSystem === 'us') {
    const ft = parseNumber(input.heightFt);
    const inches = parseNumber(input.heightIn);
    const ftVal = ft.blank ? 0 : ft.value;
    const inVal = inches.blank ? 0 : inches.value;

    if ((ft.blank && inches.blank) || ftVal === null || inVal === null) {
      errors.height = 'Enter height in feet and inches.';
      hasFieldError = true;
    } else if (ft.invalid || inches.invalid) {
      errors.height = 'Enter a valid height.';
      hasFieldError = true;
    } else if (ftVal < 0 || inVal < 0 || (ftVal === 0 && inVal === 0)) {
      errors.height = 'Height must be greater than zero.';
      hasFieldError = true;
    } else if (inVal >= 12) {
      errors.height = 'Inches must be less than 12 (use feet for larger values).';
      hasFieldError = true;
    } else if (ftVal > 8) {
      errors.height = 'Height cannot exceed 8 feet in this calculator.';
      hasFieldError = true;
    } else {
      heightMeters = usHeightToMeters(ftVal, inVal);
    }

    const w = parseNumber(input.weightLb);
    if (w.blank) {
      errors.weight = 'Enter weight in pounds.';
      hasFieldError = true;
    } else if (w.invalid || w.value === null) {
      errors.weight = 'Enter a valid weight.';
      hasFieldError = true;
    } else if (w.value <= 0 || w.value > 1100) {
      errors.weight = 'Weight must be greater than 0 and at most 1,100 lb.';
      hasFieldError = true;
    } else {
      weightKg = weightToKg(w.value, 'lb');
    }
  } else {
    const h = parseNumber(input.otherHeight);
    if (h.blank) {
      errors.height = 'Enter height.';
      hasFieldError = true;
    } else if (h.invalid || h.value === null) {
      errors.height = 'Enter a valid height.';
      hasFieldError = true;
    } else if (h.value <= 0) {
      errors.height = 'Height must be greater than zero.';
      hasFieldError = true;
    } else {
      const meters = heightToMeters(h.value, input.otherHeightUnit);
      if (meters > 3.5) {
        errors.height = 'Height is outside the supported range.';
        hasFieldError = true;
      } else {
        heightMeters = meters;
      }
    }

    const w = parseNumber(input.otherWeight);
    if (w.blank) {
      errors.weight = 'Enter weight.';
      hasFieldError = true;
    } else if (w.invalid || w.value === null) {
      errors.weight = 'Enter a valid weight.';
      hasFieldError = true;
    } else if (w.value <= 0) {
      errors.weight = 'Weight must be greater than zero.';
      hasFieldError = true;
    } else {
      const kg = weightToKg(w.value, input.otherWeightUnit);
      if (kg > 500) {
        errors.weight = 'Weight is outside the supported range.';
        hasFieldError = true;
      } else {
        weightKg = kg;
      }
    }
  }

  if (hasFieldError || age.value === null || heightMeters === null || weightKg === null) {
    return { isValid: false, errors, result: null };
  }

  try {
    const result = calculateAnorexicBmi({
      age: age.value,
      sex: input.sex,
      heightMeters,
      weightKg,
    });
    return { isValid: true, errors: {}, result };
  } catch {
    errors.form = 'Unable to calculate BMI from the entered values.';
    return { isValid: false, errors, result: null };
  }
}
