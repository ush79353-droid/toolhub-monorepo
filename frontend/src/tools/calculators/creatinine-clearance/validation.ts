import { calculateCreatinineClearance, parseNumber } from './calculation';
import type {
  CreatinineClearanceFieldErrors,
  CreatinineClearanceInput,
  CreatinineClearanceResult,
} from './types';

export interface CreatinineClearanceValidation {
  errors: CreatinineClearanceFieldErrors;
  result: CreatinineClearanceResult | null;
}

export function validateCreatinineClearanceInput(
  input: CreatinineClearanceInput,
): CreatinineClearanceValidation {
  const errors: CreatinineClearanceFieldErrors = {};

  if (input.ageYearsText.trim() !== '') {
    const age = parseNumber(input.ageYearsText);
    if (age === null) errors.ageYearsText = 'Enter a valid age.';
    else if (!(age >= 18 && age <= 120)) {
      errors.ageYearsText = 'Adult age must be between 18 and 120 years.';
    }
  }

  if (input.weightText.trim() !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) errors.weightText = 'Enter a valid weight.';
    else if (!(w > 0 && w <= 500)) {
      errors.weightText = 'Weight must be greater than 0.';
    }
  }

  if (input.heightText.trim() !== '') {
    const h = parseNumber(input.heightText);
    if (h === null) errors.heightText = 'Enter a valid height.';
    else if (!(h > 0 && h <= 300)) {
      errors.heightText = 'Height must be greater than 0.';
    }
  }

  if (input.serumCreatinineText.trim() !== '') {
    const s = parseNumber(input.serumCreatinineText);
    if (s === null) errors.serumCreatinineText = 'Enter a valid serum creatinine.';
    else if (!(s > 0)) {
      errors.serumCreatinineText = 'Serum creatinine must be greater than zero.';
    }
  }

  if (input.urineCreatinineText.trim() !== '') {
    const u = parseNumber(input.urineCreatinineText);
    if (u === null) errors.urineCreatinineText = 'Enter a valid urine creatinine.';
    else if (!(u > 0)) {
      errors.urineCreatinineText = 'Urine creatinine must be greater than zero.';
    }
  }

  if (input.urineVolumeMlText.trim() !== '') {
    const v = parseNumber(input.urineVolumeMlText);
    if (v === null) errors.urineVolumeMlText = 'Enter a valid urine volume.';
    else if (!(v > 0)) {
      errors.urineVolumeMlText = 'Urine volume must be greater than zero.';
    }
  }

  if (input.directSerumCreatinineText.trim() !== '') {
    const s = parseNumber(input.directSerumCreatinineText);
    if (s === null) {
      errors.directSerumCreatinineText = 'Enter a valid serum creatinine.';
    } else if (!(s > 0)) {
      errors.directSerumCreatinineText =
        'Serum creatinine must be greater than zero.';
    }
  }

  if (input.collectionTimeText.trim() !== '') {
    const t = parseNumber(input.collectionTimeText);
    if (t === null) errors.collectionTimeText = 'Enter a valid collection time.';
    else if (!(t > 0)) {
      errors.collectionTimeText = 'Collection duration must be greater than zero.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateCreatinineClearance(input),
  };
}
