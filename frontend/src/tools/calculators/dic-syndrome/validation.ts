import { calculateDicSyndrome } from './calculation';
import type {
  DicSyndromeFieldErrors,
  DicSyndromeInput,
  DicSyndromeResult,
} from './types';

export interface DicSyndromeValidation {
  isValid: boolean;
  errors: DicSyndromeFieldErrors;
  result: DicSyndromeResult | null;
}

export function validateDicSyndromeInput(input: DicSyndromeInput): DicSyndromeValidation {
  return {
    isValid: true,
    errors: {},
    result: calculateDicSyndrome(input),
  };
}