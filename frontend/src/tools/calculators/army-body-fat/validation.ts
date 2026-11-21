/**
 * Army Body Fat Calculator — input validation (ADR-018).
 */

import {
  calculateArmyBodyFatFromParsed,
  toInches,
  toPounds,
} from './calculation';
import type {
  ArmyBodyFatFieldErrors,
  ArmyBodyFatInput,
  ArmyBodyFatResult,
  ArmyLengthUnit,
  ArmyMassUnit,
} from './types';

export interface ArmyBodyFatValidation {
  isValid: boolean;
  errors: ArmyBodyFatFieldErrors;
  result: ArmyBodyFatResult | null;
}

function parseFinite(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function requirePositiveLength(
  raw: string,
  unit: ArmyLengthUnit,
  label: string,
  errors: ArmyBodyFatFieldErrors,
  key: keyof ArmyBodyFatFieldErrors,
): number | null {
  const n = parseFinite(raw);
  if (n == null) {
    if (raw.trim() !== '') {
      errors[key] = `Enter a valid ${label}.`;
    }
    return null;
  }
  if (n <= 0) {
    errors[key] = `${label} must be greater than zero.`;
    return null;
  }
  const inches = toInches(n, unit);
  if (!Number.isFinite(inches) || inches <= 0) {
    errors[key] = `Enter a valid ${label}.`;
    return null;
  }
  if (inches > 120) {
    errors[key] = `${label} looks unrealistically large.`;
    return null;
  }
  return inches;
}

function requirePositiveMass(
  raw: string,
  unit: ArmyMassUnit,
  errors: ArmyBodyFatFieldErrors,
): number | null {
  const n = parseFinite(raw);
  if (n == null) {
    if (raw.trim() !== '') {
      errors.weight = 'Enter a valid body weight.';
    }
    return null;
  }
  if (n <= 0) {
    errors.weight = 'Body weight must be greater than zero.';
    return null;
  }
  const lb = toPounds(n, unit);
  if (!Number.isFinite(lb) || lb <= 0) {
    errors.weight = 'Enter a valid body weight.';
    return null;
  }
  if (lb > 800) {
    errors.weight = 'Body weight looks unrealistically large.';
    return null;
  }
  return lb;
}

function validateAge(
  raw: string,
  errors: ArmyBodyFatFieldErrors,
): number | null {
  const t = raw.trim();
  if (t === '') return null;
  const n = parseFinite(t);
  if (n == null) {
    errors.ageYears = 'Enter a valid age in whole years.';
    return null;
  }
  if (Math.abs(n - Math.round(n)) > 1e-9) {
    errors.ageYears = 'Enter age as a whole number of years.';
    return null;
  }
  const age = Math.round(n);
  if (age < 17 || age > 80) {
    errors.ageYears = 'Age must be between 17 and 80 for Army standards.';
    return null;
  }
  return age;
}

export function validateArmyBodyFatInput(
  input: ArmyBodyFatInput,
): ArmyBodyFatValidation {
  const errors: ArmyBodyFatFieldErrors = {};
  validateAge(input.ageYears, errors);

  let weightLb = 0;
  let abdomenIn = 0;
  let heightIn = 0;
  let neckIn = 0;
  let waistIn = 0;
  let hipIn = 0;

  if (input.activeDuty) {
    const w = requirePositiveMass(input.weight, input.weightUnit, errors);
    const a = requirePositiveLength(
      input.abdomen,
      input.abdomenUnit,
      'abdomen circumference',
      errors,
      'abdomen',
    );
    if (w == null || a == null) {
      return { isValid: false, errors, result: null };
    }
    weightLb = w;
    abdomenIn = a;
  } else {
    const h = requirePositiveLength(
      input.height,
      input.heightUnit,
      'height',
      errors,
      'height',
    );
    const n = requirePositiveLength(
      input.neck,
      input.neckUnit,
      'neck circumference',
      errors,
      'neck',
    );
    const wa = requirePositiveLength(
      input.waist,
      input.waistUnit,
      input.sex === 'male' ? 'abdomen (waist) circumference' : 'waist circumference',
      errors,
      'waist',
    );
    let hip: number | null = 0;
    if (input.sex === 'female') {
      hip = requirePositiveLength(
        input.hip,
        input.hipUnit,
        'hip circumference',
        errors,
        'hip',
      );
    }
    if (h == null || n == null || wa == null || (input.sex === 'female' && hip == null)) {
      return { isValid: false, errors, result: null };
    }
    heightIn = h;
    neckIn = n;
    waistIn = wa;
    hipIn = hip ?? 0;

    if (input.sex === 'male' && !(waistIn - neckIn > 0)) {
      errors.waist =
        'Abdomen circumference must be greater than neck circumference.';
      return { isValid: false, errors, result: null };
    }
    if (
      input.sex === 'female' &&
      !(waistIn + hipIn - neckIn > 0)
    ) {
      errors.hip =
        'Waist + hip must be greater than neck circumference.';
      return { isValid: false, errors, result: null };
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateArmyBodyFatFromParsed(input, {
    weightLb,
    abdomenIn,
    heightIn,
    neckIn,
    waistIn,
    hipIn,
  });

  if (!result) {
    return {
      isValid: false,
      errors: {
        ...(input.activeDuty
          ? { abdomen: 'Unable to estimate body fat from these values.' }
          : { waist: 'Unable to estimate body fat from these values.' }),
      },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
