import { calculateBodyFrameSize, parseNumber } from './calculation';
import type {
  BodyFrameSizeFieldErrors,
  BodyFrameSizeInput,
  BodyFrameSizeResult,
} from './types';

export interface BodyFrameSizeValidation {
  errors: BodyFrameSizeFieldErrors;
  result: BodyFrameSizeResult | null;
}

export function validateBodyFrameSizeInput(
  input: BodyFrameSizeInput,
): BodyFrameSizeValidation {
  const errors: BodyFrameSizeFieldErrors = {};

  if (input.heightText.trim() !== '') {
    const h = parseNumber(input.heightText);
    if (h === null) errors.heightText = 'Enter a valid height.';
    else if (!(h > 0)) errors.heightText = 'Height must be greater than zero.';
  }

  if (input.wristText.trim() !== '') {
    const w = parseNumber(input.wristText);
    if (w === null) errors.wristText = 'Enter a valid wrist circumference.';
    else if (!(w > 0))
      errors.wristText = 'Wrist circumference must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateBodyFrameSize(input),
  };
}
