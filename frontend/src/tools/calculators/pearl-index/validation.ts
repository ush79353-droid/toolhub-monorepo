import { calculatePearlIndex, parseNumber } from './calculation';
import type {
  PearlIndexFieldErrors,
  PearlIndexInput,
  PearlIndexResult,
} from './types';

export interface PearlIndexValidation {
  errors: PearlIndexFieldErrors;
  result: PearlIndexResult | null;
}

export function validatePearlIndexInput(
  input: PearlIndexInput,
): PearlIndexValidation {
  const errors: PearlIndexFieldErrors = {};

  if (input.womenText.trim() !== '') {
    const w = parseNumber(input.womenText);
    if (w === null) errors.womenText = 'Enter a valid number of women.';
    else if (!(w > 0)) errors.womenText = 'Number of women must be positive.';
  }

  if (input.durationText.trim() !== '') {
    const d = parseNumber(input.durationText);
    if (d === null) errors.durationText = 'Enter a valid study duration.';
    else if (!(d > 0)) errors.durationText = 'Duration must be positive.';
  }

  if (input.pregnanciesText.trim() !== '') {
    const p = parseNumber(input.pregnanciesText);
    if (p === null) errors.pregnanciesText = 'Enter a valid pregnancy count.';
    else if (!(p >= 0)) errors.pregnanciesText = 'Pregnancies cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculatePearlIndex(input) };
}
