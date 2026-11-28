import {
  calculateGloveSizeResults,
  convertHandMeasurementToCm,
} from './calculation';
import type {
  GloveSizeFieldErrors,
  GloveSizeInput,
  GloveSizeResult,
} from './types';

function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function validateHandCircumference(input: GloveSizeInput): {
  errors: GloveSizeFieldErrors;
  result: GloveSizeResult | null;
} {
  const errors: GloveSizeFieldErrors = {};
  const circ = parseNumber(input.handCircumference);

  if (circ == null) errors.handCircumference = 'Enter hand circumference.';
  else if (circ <= 0)
    errors.handCircumference = 'Circumference must be greater than zero.';

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const result = calculateGloveSizeResults({
    gloveStyle: input.gloveStyle,
    handCircumferenceCm: convertHandMeasurementToCm(circ!, input.unit),
  });

  return { errors, result };
}
