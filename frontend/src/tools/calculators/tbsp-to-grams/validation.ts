import { findIngredient } from './ingredients';
import {
  MAX_ABS_VALUE,
  type TbspToGramsFieldErrors,
  type TbspToGramsInput,
} from './types';

export function isIncompleteNumber(raw: string): boolean {
  const cleaned = raw.trim();
  return (
    cleaned === '' ||
    cleaned === '.' ||
    cleaned === '-' ||
    cleaned === '-.' ||
    cleaned.endsWith('.') ||
    /e[+-]?$/i.test(cleaned)
  );
}

export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function measureProblem(
  value: number | null,
): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateTbspToGrams(input: TbspToGramsInput): {
  isValid: boolean;
  errors: TbspToGramsFieldErrors;
} {
  const errors: TbspToGramsFieldErrors = {};

  if (!findIngredient(input.ingredientId)) {
    errors.ingredientId = 'Select a valid ingredient.';
  }

  const field = input.source === 'tablespoons' ? 'tablespoons' : 'grams';
  const value = input.source === 'tablespoons' ? input.tablespoons : input.grams;
  const state = measureProblem(value);

  if (state === 'blank') {
    return { isValid: false, errors };
  }
  if (state === 'bad') {
    errors[field] = 'Enter a valid finite amount.';
  } else if (state === 'negative') {
    errors[field] = 'Amount cannot be negative.';
  } else if (state === 'large') {
    errors[field] = 'Enter a smaller amount.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
