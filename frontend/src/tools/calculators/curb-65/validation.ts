import { calculateCurb65, parseNumber } from './calculation';
import type { Curb65FieldErrors, Curb65Input, Curb65Result } from './types';

export interface Curb65Validation {
  errors: Curb65FieldErrors;
  result: Curb65Result | null;
}

export function validateCurb65Input(input: Curb65Input): Curb65Validation {
  const errors: Curb65FieldErrors = {};

  if (input.bunText.trim() !== '') {
    const n = parseNumber(input.bunText);
    if (n === null) errors.bunText = 'Enter a valid BUN/urea value.';
    else if (n < 0) errors.bunText = 'BUN/urea must be non-negative.';
  }

  if (input.respiratoryRateText.trim() !== '') {
    const n = parseNumber(input.respiratoryRateText);
    if (n === null) errors.respiratoryRateText = 'Enter a valid respiratory rate.';
    else if (n < 0) errors.respiratoryRateText = 'Respiratory rate must be non-negative.';
  }

  if (input.systolicBpText.trim() !== '') {
    const n = parseNumber(input.systolicBpText);
    if (n === null) errors.systolicBpText = 'Enter a valid systolic BP.';
    else if (n < 0) errors.systolicBpText = 'Systolic BP must be non-negative.';
  }

  if (input.diastolicBpText.trim() !== '') {
    const n = parseNumber(input.diastolicBpText);
    if (n === null) errors.diastolicBpText = 'Enter a valid diastolic BP.';
    else if (n < 0) errors.diastolicBpText = 'Diastolic BP must be non-negative.';
  }

  if (input.ageText.trim() !== '') {
    const n = parseNumber(input.ageText);
    if (n === null) errors.ageText = 'Enter a valid age.';
    else if (n < 0) errors.ageText = 'Age must be non-negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateCurb65(input) };
}
