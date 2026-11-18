import { isSupportedCurrency } from '@/tools/shared/currency';
import {
  MAX_DIMENSION,
  MAX_PRICE,
  type LandAreaFieldErrors,
  type LandAreaInput,
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

function nonNegativeProblem(
  value: number | null,
  max: number,
): 'blank' | 'negative' | 'bad' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > max) return 'large';
  return 'ok';
}

export function validateLandArea(input: LandAreaInput): {
  isValid: boolean;
  errors: LandAreaFieldErrors;
} {
  const errors: LandAreaFieldErrors = {};
  let blank = false;

  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a currency from the list.';
  }

  const widthState = nonNegativeProblem(input.width, MAX_DIMENSION);
  const lengthState = nonNegativeProblem(input.length, MAX_DIMENSION);

  if (widthState === 'blank') blank = true;
  else if (widthState === 'negative') errors.width = 'Width cannot be negative.';
  else if (widthState === 'large') errors.width = 'Enter a smaller width.';
  else if (widthState === 'bad') errors.width = 'Enter a valid width.';

  if (lengthState === 'blank') blank = true;
  else if (lengthState === 'negative') errors.length = 'Length cannot be negative.';
  else if (lengthState === 'large') errors.length = 'Enter a smaller length.';
  else if (lengthState === 'bad') errors.length = 'Enter a valid length.';

  if (input.pricePerUnit !== null) {
    const priceState = nonNegativeProblem(input.pricePerUnit, MAX_PRICE);
    if (priceState === 'negative') errors.pricePerUnit = 'Price cannot be negative.';
    else if (priceState === 'large') errors.pricePerUnit = 'Enter a smaller unit price.';
    else if (priceState === 'bad') errors.pricePerUnit = 'Enter a valid unit price.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
