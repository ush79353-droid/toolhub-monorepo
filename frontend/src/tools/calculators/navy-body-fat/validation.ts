import {
  AGE_MAX,
  AGE_MIN,
  calculateNavyBodyFat,
  parseNumber,
  toCm,
} from './calculation';
import type {
  LengthUnit,
  NavyBodyFatFieldErrors,
  NavyBodyFatInput,
  NavyBodyFatResult,
} from './types';

const LENGTH_UNITS: readonly LengthUnit[] = ['cm', 'in'];

export interface NavyBodyFatValidation {
  isValid: boolean;
  errors: NavyBodyFatFieldErrors;
  result: NavyBodyFatResult | null;
}

export function collectFieldErrors(
  input: NavyBodyFatInput,
): NavyBodyFatFieldErrors {
  const errors: NavyBodyFatFieldErrors = {};

  if (!LENGTH_UNITS.includes(input.heightUnit)) {
    errors.height = 'Select a height unit.';
  }
  if (!LENGTH_UNITS.includes(input.neckUnit)) {
    errors.neck = 'Select a neck unit.';
  }
  if (!LENGTH_UNITS.includes(input.waistUnit)) {
    errors.waist = 'Select a waist unit.';
  }
  if (input.sex === 'female' && !LENGTH_UNITS.includes(input.hipUnit)) {
    errors.hip = 'Select a hip unit.';
  }

  if (input.age.trim() !== '') {
    const age = parseNumber(input.age);
    if (age == null) {
      errors.age = 'Enter a valid age in years.';
    } else if (age < AGE_MIN || age > AGE_MAX) {
      errors.age = `Age for this estimate is ${AGE_MIN}–${AGE_MAX} years.`;
    }
  }

  const heightVal = parseNumber(input.height);
  const neckVal = parseNumber(input.neck);
  const waistVal = parseNumber(input.waist);

  if (input.height.trim() !== '') {
    if (heightVal == null || !(heightVal > 0)) {
      errors.height = 'Enter a valid height.';
    } else {
      const cm = toCm(heightVal, input.heightUnit);
      if (!(cm > 50) || cm > 275) {
        errors.height = 'Height is out of a realistic range.';
      }
    }
  }

  if (input.neck.trim() !== '') {
    if (neckVal == null || !(neckVal > 0)) {
      errors.neck = 'Enter a valid neck circumference.';
    }
  }

  if (input.waist.trim() !== '') {
    if (waistVal == null || !(waistVal > 0)) {
      errors.waist = 'Enter a valid waist circumference.';
    }
  }

  if (input.sex === 'female') {
    if (input.hip.trim() !== '') {
      const hipVal = parseNumber(input.hip);
      if (hipVal == null || !(hipVal > 0)) {
        errors.hip = 'Enter a valid hip circumference.';
      }
    }
  }

  // Structural Navy guards when all required tape fields present.
  const heightOk =
    input.height.trim() !== '' && heightVal != null && heightVal > 0;
  const neckOk = input.neck.trim() !== '' && neckVal != null && neckVal > 0;
  const waistOk =
    input.waist.trim() !== '' && waistVal != null && waistVal > 0;

  if (heightOk && neckOk && waistOk) {
    const heightCm = toCm(heightVal!, input.heightUnit);
    const neckCm = toCm(neckVal!, input.neckUnit);
    const waistCm = toCm(waistVal!, input.waistUnit);
    if (input.sex === 'male') {
      if (!(waistCm - neckCm > 0)) {
        errors.waist =
          'Waist must be larger than neck for the Navy male equation.';
      }
    } else {
      const hipVal = parseNumber(input.hip);
      if (input.hip.trim() === '' || hipVal == null || !(hipVal > 0)) {
        errors.hip = 'Enter hip circumference for the Navy female equation.';
      } else {
        const hipCm = toCm(hipVal, input.hipUnit);
        if (!(waistCm + hipCm - neckCm > 0)) {
          errors.waist =
            'Waist + hip must be larger than neck for the Navy female equation.';
        }
      }
    }
    void heightCm;
  }

  const anyTape =
    input.height.trim() !== '' ||
    input.neck.trim() !== '' ||
    input.waist.trim() !== '' ||
    (input.sex === 'female' && input.hip.trim() !== '');
  if (anyTape) {
    if (input.height.trim() === '') {
      errors.height = errors.height ?? 'Enter height.';
    }
    if (input.neck.trim() === '') {
      errors.neck = errors.neck ?? 'Enter neck circumference.';
    }
    if (input.waist.trim() === '') {
      errors.waist = errors.waist ?? 'Enter waist circumference.';
    }
    if (input.sex === 'female' && input.hip.trim() === '') {
      errors.hip = errors.hip ?? 'Enter hip circumference.';
    }
  }

  return errors;
}

export function hasFieldErrors(errors: NavyBodyFatFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateNavyBodyFatInput(
  input: NavyBodyFatInput,
): NavyBodyFatValidation {
  const blank =
    input.height.trim() === '' &&
    input.neck.trim() === '' &&
    input.waist.trim() === '' &&
    input.hip.trim() === '' &&
    input.age.trim() === '';
  if (blank) {
    return { isValid: true, errors: {}, result: null };
  }

  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateNavyBodyFat(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to estimate body fat with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
