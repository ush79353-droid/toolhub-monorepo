import { calculateKidneyStonePcnl } from './calculation';
import type {
  KidneyStonePcnlFieldErrors,
  KidneyStonePcnlInput,
  KidneyStonePcnlResult,
} from './types';

export interface KidneyStonePcnlValidation {
  errors: KidneyStonePcnlFieldErrors;
  result: KidneyStonePcnlResult | null;
}

export function validateKidneyStonePcnlInput(
  input: KidneyStonePcnlInput,
): KidneyStonePcnlValidation {
  return {
    errors: {},
    result: calculateKidneyStonePcnl(input),
  };
}
