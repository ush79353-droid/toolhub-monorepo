import {
  MAX_ABS_VALUE,
  type PricePerLiterToGallonFieldErrors,
  type PricePerLiterToGallonInput,
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

function priceProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (Math.abs(value) > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validatePricePerLiterToGallon(input: PricePerLiterToGallonInput): {
  isValid: boolean;
  errors: PricePerLiterToGallonFieldErrors;
} {
  const errors: PricePerLiterToGallonFieldErrors = {};
  let blank = false;

  if (input.source === 'perLiter') {
    const state = priceProblem(input.pricePerLiter);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.pricePerLiter = 'Enter a valid price per liter.';
    else if (state === 'negative') errors.pricePerLiter = 'Enter a non-negative price.';
    else if (state === 'large') errors.pricePerLiter = 'Enter a smaller price.';
  } else {
    const state = priceProblem(input.pricePerGallon);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.pricePerGallon = 'Enter a valid price per gallon.';
    else if (state === 'negative') errors.pricePerGallon = 'Enter a non-negative price.';
    else if (state === 'large') errors.pricePerGallon = 'Enter a smaller price.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
