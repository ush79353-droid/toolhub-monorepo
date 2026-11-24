/**
 * Warfarin dosing validation — field guards + calculateWarfarinDosing.
 */

import { calculateWarfarinDosing, parseNumber } from './calculation';
import type {
  WarfarinDosingFieldErrors,
  WarfarinDosingInput,
  WarfarinDosingResult,
} from './types';

export interface WarfarinDosingValidation {
  errors: WarfarinDosingFieldErrors;
  result: WarfarinDosingResult | null;
}

export function validateWarfarinDosingInput(
  input: WarfarinDosingInput,
): WarfarinDosingValidation {
  const errors: WarfarinDosingFieldErrors = {};

  const inrTrim = input.inrText.trim();
  if (inrTrim !== '') {
    const inr = parseNumber(input.inrText);
    if (inr === null) {
      errors.inrText = 'Enter a valid INR.';
    } else if (!(inr > 0)) {
      errors.inrText = 'INR must be greater than zero.';
    }
  }

  const doseTrim = input.doseText.trim();
  if (doseTrim !== '') {
    const dose = parseNumber(input.doseText);
    if (dose === null) {
      errors.doseText = 'Enter a valid dose.';
    } else if (!(dose > 0)) {
      errors.doseText = 'Dose must be greater than zero.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      result: calculateWarfarinDosing({
        ...input,
        inrText: errors.inrText ? '' : input.inrText,
        doseText: errors.doseText ? '' : input.doseText,
      }),
    };
  }

  return {
    errors,
    result: calculateWarfarinDosing(input),
  };
}
