import {
  calculateHatSizeResults,
  convertLengthToCm,
} from './calculation';
import type {
  HatSizeFieldErrors,
  HatSizeInput,
  HatSizeResult,
} from './types';

function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function validateHeadCircumference(input: HatSizeInput): {
  errors: HatSizeFieldErrors;
  result: HatSizeResult | null;
} {
  const errors: HatSizeFieldErrors = {};
  const circ = parseNumber(input.headCircumference);

  if (circ == null) errors.headCircumference = 'Enter head circumference.';
  else if (circ <= 0)
    errors.headCircumference = 'Circumference must be greater than zero.';
  else if (circ > 100 && input.unit === 'cm')
    errors.headCircumference = 'Circumference looks unrealistically large.';
  else if (circ > 40 && input.unit === 'in')
    errors.headCircumference = 'Circumference looks unrealistically large.';

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const result = calculateHatSizeResults({
    category: input.category,
    headCircumferenceCm: convertLengthToCm(circ!, input.unit),
    fitPreference: input.fitPreference,
  });

  return { errors, result };
}

export function validateHatSizeInputs(input: HatSizeInput) {
  return validateHeadCircumference(input);
}
