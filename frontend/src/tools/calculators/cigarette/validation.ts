import { calculateCigarette, parseNumber } from './calculation';
import type {
  CigaretteFieldErrors,
  CigaretteInput,
  CigaretteResult,
} from './types';

export interface CigaretteValidation {
  errors: CigaretteFieldErrors;
  result: CigaretteResult | null;
}

export function validateCigaretteInput(
  input: CigaretteInput,
): CigaretteValidation {
  const errors: CigaretteFieldErrors = {};

  if (input.cigarettesInPackText.trim() !== '') {
    const p = parseNumber(input.cigarettesInPackText);
    if (p === null) errors.cigarettesInPackText = 'Enter a valid pack size.';
    else if (!(p > 0))
      errors.cigarettesInPackText = 'Pack size must be greater than zero.';
  } else {
    errors.cigarettesInPackText = 'Enter cigarettes in a pack.';
  }

  if (input.cigarettesPerDayText.trim() !== '') {
    const c = parseNumber(input.cigarettesPerDayText);
    if (c === null)
      errors.cigarettesPerDayText = 'Enter a valid cigarettes/day value.';
    else if (c < 0)
      errors.cigarettesPerDayText = 'Cigarettes/day must be non-negative.';
  }

  if (input.packsPerDayText.trim() !== '') {
    const pk = parseNumber(input.packsPerDayText);
    if (pk === null) errors.packsPerDayText = 'Enter a valid packs/day value.';
    else if (pk < 0) errors.packsPerDayText = 'Packs/day must be non-negative.';
  }

  if (input.timeFrameText.trim() !== '') {
    const t = parseNumber(input.timeFrameText);
    if (t === null) errors.timeFrameText = 'Enter a valid time frame.';
    else if (t < 0) errors.timeFrameText = 'Time frame must be non-negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateCigarette(input) };
}
