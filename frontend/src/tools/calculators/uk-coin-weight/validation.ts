import { calculateUkCoinWeightFromInput, parseCoinCountField } from './calculation';
import { MAX_COIN_COUNT, UK_COIN_IDS, UK_COIN_LABELS } from './constants';
import type {
  UkCoinWeightFieldErrors,
  UkCoinWeightInput,
  UkCoinWeightResult,
} from './types';

export interface UkCoinWeightValidation {
  isValid: boolean;
  errors: UkCoinWeightFieldErrors;
  result: UkCoinWeightResult | null;
}

export function collectFieldErrors(
  input: UkCoinWeightInput,
): UkCoinWeightFieldErrors {
  const errors: UkCoinWeightFieldErrors = {};

  if (input.weightUnit !== 'g' && input.weightUnit !== 'kg') {
    errors.weightUnit = 'Select grams or kilograms.';
  }

  for (const id of UK_COIN_IDS) {
    const parsed = parseCoinCountField(input[id]);
    if (parsed.blank) {
      errors[id] = `Enter a count for ${UK_COIN_LABELS[id]} (use 0 if none).`;
      continue;
    }
    if (parsed.invalid || parsed.value == null) {
      errors[id] = 'Enter a whole number ≥ 0.';
      continue;
    }
    if (parsed.value < 0) {
      errors[id] = 'Count cannot be negative.';
      continue;
    }
    if (parsed.value > MAX_COIN_COUNT) {
      errors[id] = `Count cannot exceed ${MAX_COIN_COUNT.toLocaleString('en-GB')}.`;
    }
  }

  return errors;
}

export function hasFieldErrors(errors: UkCoinWeightFieldErrors): boolean {
  return Object.values(errors).some((v) => typeof v === 'string' && v.length > 0);
}

export function validateUkCoinWeightInput(
  input: UkCoinWeightInput,
): UkCoinWeightValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateUkCoinWeightFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: {
        form: 'Could not compute total weight for these counts.',
      },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
