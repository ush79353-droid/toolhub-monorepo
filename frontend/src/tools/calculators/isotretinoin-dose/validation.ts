import { calculateIsotretinoinDose, parseNumber } from './calculation';
import type {
  IsotretinoinDoseFieldErrors,
  IsotretinoinDoseInput,
  IsotretinoinDoseResult,
} from './types';

export interface IsotretinoinDoseValidation {
  errors: IsotretinoinDoseFieldErrors;
  result: IsotretinoinDoseResult | null;
}

export function validateIsotretinoinDoseInput(
  input: IsotretinoinDoseInput,
): IsotretinoinDoseValidation {
  const errors: IsotretinoinDoseFieldErrors = {};

  if (input.weightText.trim() !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) errors.weightText = 'Enter a valid weight.';
    else if (!(w > 0 && w < 500)) {
      errors.weightText = 'Weight must be greater than 0.';
    }
  }

  if (
    input.cumulativeMode === 'exact' &&
    input.exactCumulativeMgPerKgText.trim() !== ''
  ) {
    const c = parseNumber(input.exactCumulativeMgPerKgText);
    if (c === null) {
      errors.exactCumulativeMgPerKgText = 'Enter a valid mg/kg value.';
    } else if (!(c > 0 && c <= 500)) {
      errors.exactCumulativeMgPerKgText =
        'Cumulative mg/kg must be greater than 0.';
    }
  }

  if (input.solveFor === 'duration' && input.dailyDoseMgText.trim() !== '') {
    const d = parseNumber(input.dailyDoseMgText);
    if (d === null) errors.dailyDoseMgText = 'Enter a valid daily dose.';
    else if (!(d > 0)) {
      errors.dailyDoseMgText = 'Daily dose must be greater than zero.';
    }
  }

  if (input.solveFor === 'daily_dose' && input.durationValueText.trim() !== '') {
    const dur = parseNumber(input.durationValueText);
    if (dur === null) errors.durationValueText = 'Enter a valid duration.';
    else if (!(dur > 0)) {
      errors.durationValueText = 'Duration must be greater than zero.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  try {
    return { errors: {}, result: calculateIsotretinoinDose(input) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid input.';
    if (input.solveFor === 'duration') {
      return { errors: { dailyDoseMgText: msg }, result: null };
    }
    return { errors: { durationValueText: msg }, result: null };
  }
}
