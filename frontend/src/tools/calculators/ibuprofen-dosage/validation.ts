import { calculateIbuprofenDosage, parseWeight } from './calculation';
import type {
  IbuprofenDosageFieldErrors,
  IbuprofenDosageInput,
  IbuprofenDosageResult,
} from './types';

export function validateIbuprofenDosageInput(input: IbuprofenDosageInput): {
  isValid: boolean;
  errors: IbuprofenDosageFieldErrors;
  result: IbuprofenDosageResult;
} {
  const errors: IbuprofenDosageFieldErrors = {};
  const parsed = parseWeight(input.weightText);
  if (parsed === 'invalid') {
    errors.weightText = 'Enter a valid weight greater than zero.';
  }

  const result = calculateIbuprofenDosage(input);
  const isValid =
    Object.keys(errors).length === 0 && result.status === 'labeled_dose';

  return { isValid, errors, result };
}
