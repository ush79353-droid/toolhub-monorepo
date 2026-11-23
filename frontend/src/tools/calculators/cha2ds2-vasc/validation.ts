import { calculateCha2ds2Vasc } from './calculation';
import type {
  Cha2ds2VascFieldErrors,
  Cha2ds2VascInput,
  Cha2ds2VascResult,
} from './types';

export interface Cha2ds2VascValidation {
  isValid: boolean;
  errors: Cha2ds2VascFieldErrors;
  result: Cha2ds2VascResult;
}

/** All fields are radio-selected by default; score always computes. */
export function validateCha2ds2VascInput(
  input: Cha2ds2VascInput
): Cha2ds2VascValidation {
  return {
    isValid: true,
    errors: {},
    result: calculateCha2ds2Vasc(input),
  };
}
