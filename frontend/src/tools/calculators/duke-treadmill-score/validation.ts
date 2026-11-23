import { calculateDukeTreadmillScore, parseNumber } from './calculation';
import type {
  DukeTreadmillScoreFieldErrors,
  DukeTreadmillScoreInput,
  DukeTreadmillScoreResult,
} from './types';

export interface DukeTreadmillScoreValidation {
  errors: DukeTreadmillScoreFieldErrors;
  result: DukeTreadmillScoreResult | null;
}

export function validateDukeTreadmillScoreInput(
  input: DukeTreadmillScoreInput,
): DukeTreadmillScoreValidation {
  const errors: DukeTreadmillScoreFieldErrors = {};

  if (input.durationMinutesText.trim() !== '') {
    const d = parseNumber(input.durationMinutesText);
    if (d === null) {
      errors.durationMinutesText = 'Enter a valid exercise duration.';
    } else if (!(d >= 0)) {
      errors.durationMinutesText = 'Duration cannot be negative.';
    }
  }

  if (input.stDeviationMmText.trim() !== '') {
    const s = parseNumber(input.stDeviationMmText);
    if (s === null) {
      errors.stDeviationMmText = 'Enter a valid ST deviation.';
    } else if (!(s >= 0)) {
      errors.stDeviationMmText = 'ST deviation cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateDukeTreadmillScore(input) };
}
