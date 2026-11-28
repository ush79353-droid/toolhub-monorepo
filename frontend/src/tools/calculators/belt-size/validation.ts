import { computeBeltSize } from './calculation';
import type {
  BeltSizeFieldErrors,
  BeltSizeInput,
  BeltSizeResult,
} from './types';

function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function validateBeltSizeInputs(input: BeltSizeInput): {
  errors: BeltSizeFieldErrors;
  result: BeltSizeResult | null;
} {
  const errors: BeltSizeFieldErrors = {};
  const method = input.measurementMethod;

  let numerical: number | null = null;
  let waist: number | null = null;
  let existing: number | null = null;
  let pants: number | null = null;
  let clothing: string | null = null;

  if (method === 'numerical-belt-size') {
    numerical = parseNumber(input.numericalBeltSize);
    if (numerical == null)
      errors.numericalBeltSize = 'Enter a numerical belt size.';
    else if (numerical <= 0)
      errors.numericalBeltSize = 'Belt size must be greater than zero.';
  } else if (method === 'general-belt-size') {
    // always valid enum
  } else if (method === 'waist-circumference') {
    waist = parseNumber(input.waistCircumference);
    if (waist == null)
      errors.waistCircumference = 'Enter waist circumference.';
    else if (waist <= 0)
      errors.waistCircumference = 'Waist must be greater than zero.';
  } else if (method === 'existing-belt-length') {
    existing = parseNumber(input.existingBeltLength);
    if (existing == null)
      errors.existingBeltLength = 'Enter existing belt measurement.';
    else if (existing <= 0)
      errors.existingBeltLength = 'Belt length must be greater than zero.';
  } else {
    clothing = input.clothingSize.trim() || null;
    if (!clothing) errors.clothingSize = 'Select a clothing size.';
    pants = parseNumber(input.pantsWaistInches);
    // pants optional helper when clothing is numeric men US/UK
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const result = computeBeltSize({
    sizingCategory: input.sizingCategory,
    measurementMethod: method,
    numericalBeltSize: numerical,
    numericalUnit: input.numericalUnit,
    generalBeltSize: input.generalBeltSize,
    waistCircumference: waist,
    waistUnit: input.waistUnit,
    existingBeltLength: existing,
    existingUnit: input.existingUnit,
    clothingSize: clothing,
    sizingSystem: input.sizingSystem,
    pantsWaistInches: pants,
  });

  if (!result) {
    return {
      errors: { form: 'No chart mapping for this selection.' },
      result: null,
    };
  }

  return { errors, result };
}
