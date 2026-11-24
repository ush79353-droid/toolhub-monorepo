import { calculateEortcBladder } from './calculation';
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

/** No scoring until all six radio groups are answered. */
export function validateEortcBladderInput(
  input: EortcBladderInput,
): EortcBladderValidation {
  if (!isCompleteInput(input)) {
    const errors: EortcBladderFieldErrors = {
      form: 'Answer all six questions to see recurrence and progression estimates.',
    };
    if (input.tumorCount == null) errors.tumorCount = 'Required';
    if (input.tumorDiameter == null) errors.tumorDiameter = 'Required';
    if (input.priorRecurrenceRate == null)
      errors.priorRecurrenceRate = 'Required';
    if (input.stage == null) errors.stage = 'Required';
    if (input.concomitantCis == null) errors.concomitantCis = 'Required';
    if (input.grade == null) errors.grade = 'Required';

    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors: {},
    result: calculateEortcBladder(input),
  };
}
