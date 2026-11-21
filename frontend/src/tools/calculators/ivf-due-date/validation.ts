import { calculateIvfDueDate, isValidIsoDate } from './calculation';
import type {
  IvfDueDateFieldErrors,
  IvfDueDateInput,
  IvfDueDateResult,
  IvfTransferType,
  Plurality,
  PregnancyStatus,
} from './types';

const STATUSES: readonly PregnancyStatus[] = ['pregnant', 'planning'];
const PLURALITIES: readonly Plurality[] = ['one', 'twins', 'triplets'];
const TRANSFER_TYPES: readonly IvfTransferType[] = [
  'own_eggs',
  'donor_eggs',
  'day3_transfer',
  'day5_transfer',
];

export interface IvfDueDateValidation {
  isValid: boolean;
  errors: IvfDueDateFieldErrors;
  result: IvfDueDateResult | null;
}

export function collectFieldErrors(
  input: IvfDueDateInput,
): IvfDueDateFieldErrors {
  const errors: IvfDueDateFieldErrors = {};

  if (!STATUSES.includes(input.pregnancyStatus)) {
    errors.form = 'Select whether you are pregnant or planning.';
  }
  if (!PLURALITIES.includes(input.plurality)) {
    errors.form = 'Select how many babies you are expecting.';
  }
  if (!TRANSFER_TYPES.includes(input.transferType)) {
    errors.form = 'Select an IVF transfer type.';
  }

  if (input.eventDate.trim() === '') {
    // blank empty state ok
  } else if (!isValidIsoDate(input.eventDate)) {
    errors.eventDate = 'Enter a valid date (YYYY-MM-DD).';
  }

  return errors;
}

export function hasFieldErrors(errors: IvfDueDateFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateIvfDueDateInput(
  input: IvfDueDateInput,
): IvfDueDateValidation {
  if (input.eventDate.trim() === '') {
    const errors = collectFieldErrors(input);
    if (errors.form) {
      return { isValid: false, errors, result: null };
    }
    return { isValid: true, errors: {}, result: null };
  }

  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateIvfDueDate(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate due date with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
