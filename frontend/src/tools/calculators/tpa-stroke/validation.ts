import { calculateTpaStroke } from './calculation';
import type {
  TpaStrokeFieldErrors,
  TpaStrokeInput,
  TpaStrokeResult,
} from './types';

export interface TpaStrokeValidation {
  errors: TpaStrokeFieldErrors;
  result: TpaStrokeResult | null;
}

/** UI stub — engine commit adds weight validation. */
export function validateTpaStrokeInput(
  input: TpaStrokeInput,
): TpaStrokeValidation {
  return {
    errors: {},
    result: calculateTpaStroke(input),
  };
}
