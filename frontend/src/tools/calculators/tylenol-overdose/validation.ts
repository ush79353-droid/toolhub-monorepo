import { calculateTylenolOverdose, parseNumber } from './calculation';
import type {
  TylenolOverdoseFieldErrors,
  TylenolOverdoseInput,
  TylenolOverdoseResult,
} from './types';

export interface TylenolOverdoseValidation {
  errors: TylenolOverdoseFieldErrors;
  result: TylenolOverdoseResult | null;
}

export function validateTylenolOverdoseInput(
  input: TylenolOverdoseInput,
): TylenolOverdoseValidation {
  const errors: TylenolOverdoseFieldErrors = {};

  const weightTrim = input.weightText.trim();
  if (weightTrim !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) {
      errors.weightText = 'Enter a valid weight.';
    } else if (!(w > 0)) {
      errors.weightText = 'Weight must be greater than zero.';
    }
  }

  const hoursTrim = input.hoursAfterIngestionText.trim();
  if (hoursTrim !== '') {
    const h = parseNumber(input.hoursAfterIngestionText);
    if (h === null) {
      errors.hoursAfterIngestionText = 'Enter valid hours after ingestion.';
    } else if (!(h > 0)) {
      errors.hoursAfterIngestionText =
        'Hours after ingestion must be greater than zero.';
    }
  }

  const levelTrim = input.serumLevelText.trim();
  if (levelTrim !== '') {
    const lvl = parseNumber(input.serumLevelText);
    if (lvl === null) {
      errors.serumLevelText = 'Enter a valid serum level.';
    } else if (!(lvl >= 0)) {
      errors.serumLevelText = 'Serum level cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    const sanitized: TylenolOverdoseInput = {
      ...input,
      weightText: errors.weightText ? '' : input.weightText,
      hoursAfterIngestionText: errors.hoursAfterIngestionText
        ? ''
        : input.hoursAfterIngestionText,
      serumLevelText: errors.serumLevelText ? '' : input.serumLevelText,
    };
    return {
      errors,
      result: calculateTylenolOverdose(sanitized),
    };
  }

  try {
    return {
      errors,
      result: calculateTylenolOverdose(input),
    };
  } catch {
    if (hoursTrim !== '' && !(parseNumber(input.hoursAfterIngestionText)! > 0)) {
      errors.hoursAfterIngestionText =
        'Hours after ingestion must be greater than zero.';
    }
    if (levelTrim !== '' && !(parseNumber(input.serumLevelText)! >= 0)) {
      errors.serumLevelText = 'Serum level cannot be negative.';
    }
    return {
      errors,
      result: calculateTylenolOverdose({
        ...input,
        hoursAfterIngestionText: errors.hoursAfterIngestionText
          ? ''
          : input.hoursAfterIngestionText,
        serumLevelText: errors.serumLevelText ? '' : input.serumLevelText,
      }),
    };
  }
}
