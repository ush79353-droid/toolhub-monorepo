import type {
  EortcBladderFieldErrors,
  EortcBladderInput,
  EortcBladderResult,
} from './types';
import { isCompleteInput } from './types';

export interface EortcBladderValidation {
  isValid: boolean;
  errors: EortcBladderFieldErrors;
  result: EortcBladderResult | null;
}

/** UI shell stub — engine commit replaces this with Sylvester 2006 scoring. */
export function validateEortcBladderInput(
  input: EortcBladderInput,
): EortcBladderValidation {
  if (!isCompleteInput(input)) {
    return {
      isValid: false,
      errors: {
        form: 'Answer all six questions to see recurrence and progression estimates.',
      },
      result: null,
    };
  }

  return {
    isValid: false,
    errors: {
      form: 'Scoring engine pending.',
    },
    result: null,
  };
}
