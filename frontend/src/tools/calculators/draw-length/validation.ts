import { calculateDrawLength, parseNumber } from './calculation';
import type {
  DrawLengthFieldErrors,
  DrawLengthInput,
  DrawLengthResult,
} from './types';

export interface DrawLengthValidation {
  errors: DrawLengthFieldErrors;
  result: DrawLengthResult | null;
}

function checkPositive(raw: string, label: string): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label}.`;
  if (!(n > 0)) return `${label} must be greater than 0.`;
  return undefined;
}

export function validateDrawLengthInput(
  input: DrawLengthInput,
): DrawLengthValidation {
  const errors: DrawLengthFieldErrors = {};

  if (input.lastEdited === 'wingspan') {
    const err = checkPositive(input.wingspanText, 'wingspan');
    if (err) errors.wingspanText = err;
  } else {
    const err = checkPositive(input.drawLengthText, 'draw length');
    if (err) errors.drawLengthText = err;
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateDrawLength(input) };
}
