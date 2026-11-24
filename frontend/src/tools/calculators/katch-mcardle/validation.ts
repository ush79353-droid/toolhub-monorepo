import { calculateKatchMcardle } from './calculation';
import type {
  KatchMcardleFieldErrors,
  KatchMcardleInput,
  KatchMcardleResult,
} from './types';

export interface KatchMcardleValidation {
  errors: KatchMcardleFieldErrors;
  result: KatchMcardleResult | null;
}

/** Stub — engine commit adds field checks. */
export function validateKatchMcardleInput(
  input: KatchMcardleInput,
): KatchMcardleValidation {
  return { errors: {}, result: calculateKatchMcardle(input) };
}
