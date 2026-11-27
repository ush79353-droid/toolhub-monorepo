import { calculateTransferrinSaturation, parseNumber } from './calculation';
import type {
  TransferrinSaturationFieldErrors,
  TransferrinSaturationInput,
  TransferrinSaturationResult,
} from './types';

export interface TransferrinSaturationValidation {
  errors: TransferrinSaturationFieldErrors;
  result: TransferrinSaturationResult | null;
}

export function validateTransferrinSaturationInput(
  input: TransferrinSaturationInput,
): TransferrinSaturationValidation {
  const errors: TransferrinSaturationFieldErrors = {};

  if (input.fe1Text.trim() !== '') {
    const n = parseNumber(input.fe1Text);
    if (n === null) errors.fe1Text = 'Enter a valid serum iron.';
    else if (!(n >= 0)) errors.fe1Text = 'Serum iron must be non-negative.';
  }
  if (input.tibcText.trim() !== '') {
    const n = parseNumber(input.tibcText);
    if (n === null) errors.tibcText = 'Enter a valid TIBC.';
    else if (!(n > 0)) errors.tibcText = 'TIBC must be greater than zero.';
  }
  if (input.fe2Text.trim() !== '') {
    const n = parseNumber(input.fe2Text);
    if (n === null) errors.fe2Text = 'Enter a valid serum iron.';
    else if (!(n >= 0)) errors.fe2Text = 'Serum iron must be non-negative.';
  }
  if (input.tfText.trim() !== '') {
    const n = parseNumber(input.tfText);
    if (n === null) errors.tfText = 'Enter a valid transferrin.';
    else if (!(n > 0)) errors.tfText = 'Transferrin must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateTransferrinSaturation(input) };
}
