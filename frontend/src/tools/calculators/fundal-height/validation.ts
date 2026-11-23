import { calculateFundalHeight, parseNumber } from './calculation';
import type {
  FundalHeightFieldErrors,
  FundalHeightInput,
  FundalHeightResult,
} from './types';

export interface FundalHeightValidation {
  errors: FundalHeightFieldErrors;
  result: FundalHeightResult | null;
}

export function validateFundalHeightInput(
  input: FundalHeightInput,
): FundalHeightValidation {
  const errors: FundalHeightFieldErrors = {};

  if (input.mode === 'percentile') {
    if (input.gaWeeksText.trim() !== '') {
      const w = parseNumber(input.gaWeeksText);
      if (w === null) errors.gaWeeksText = 'Enter valid weeks.';
      else if (!(w >= 0)) errors.gaWeeksText = 'Weeks cannot be negative.';
    }
    if (input.gaDaysText.trim() !== '') {
      const d = parseNumber(input.gaDaysText);
      if (d === null) errors.gaDaysText = 'Enter valid days.';
      else if (!(d >= 0) || d > 6) errors.gaDaysText = 'Days must be 0–6.';
    }
  }

  if (input.measuredSfhText.trim() !== '') {
    const s = parseNumber(input.measuredSfhText);
    if (s === null) errors.measuredSfhText = 'Enter a valid SFH.';
    else if (!(s > 0)) errors.measuredSfhText = 'SFH must be positive.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }
  return { errors: {}, result: calculateFundalHeight(input) };
}
