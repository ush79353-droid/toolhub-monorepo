import { calculateIvFlow, parseNumber } from './calculation';
import type { IvFlowFieldErrors, IvFlowInput, IvFlowResult } from './types';

export interface IvFlowValidation {
  errors: IvFlowFieldErrors;
  result: IvFlowResult | null;
}

export function validateIvFlowInput(input: IvFlowInput): IvFlowValidation {
  const errors: IvFlowFieldErrors = {};

  if (input.dropFactorText.trim() !== '') {
    const d = parseNumber(input.dropFactorText);
    if (d === null) errors.dropFactorText = 'Enter a valid drop factor.';
    else if (!(d > 0))
      errors.dropFactorText = 'Drop factor must be greater than zero.';
  }

  if (input.volumeText.trim() !== '') {
    const v = parseNumber(input.volumeText);
    if (v === null) errors.volumeText = 'Enter a valid volume.';
    else if (!(v > 0)) errors.volumeText = 'Volume must be greater than zero.';
  }

  if (input.timeText.trim() !== '') {
    const t = parseNumber(input.timeText);
    if (t === null) errors.timeText = 'Enter a valid infusion time.';
    else if (!(t > 0))
      errors.timeText = 'Infusion time must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateIvFlow(input) };
}
