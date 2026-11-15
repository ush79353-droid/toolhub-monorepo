import { isSupportedCurrency } from '@/tools/shared/currency';
import {
  MAX_AREA,
  MAX_DIMENSION,
  MAX_PRICE,
  type AcreageFieldErrors,
  type AcreageInput,
} from './types';

/** Blank and a half-typed sign or decimal become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim();
  if (cleaned === '' || cleaned === '.' || cleaned === '-' || cleaned === '-.') return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function positiveProblem(
  value: number | null,
  max: number
): 'blank' | 'zero' | 'negative' | 'bad' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value === 0) return 'zero';
  if (value > max) return 'large';
  return 'ok';
}

function nonNegativeProblem(
  value: number | null,
  max: number
): 'blank' | 'negative' | 'bad' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > max) return 'large';
  return 'ok';
}

export function validateAcreage(input: AcreageInput): {
  isValid: boolean;
  errors: AcreageFieldErrors;
} {
  const errors: AcreageFieldErrors = {};
  let blank = false;

  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a currency from the list.';
  }

  if (input.mode === 'dimensions') {
    const widthState = positiveProblem(input.width, MAX_DIMENSION);
    if (widthState === 'blank') blank = true;
    else if (widthState === 'zero') errors.width = 'Width must be greater than zero.';
    else if (widthState === 'negative') errors.width = 'Width cannot be negative.';
    else if (widthState === 'large') errors.width = 'Enter a smaller width.';
    else if (widthState === 'bad') errors.width = 'Enter a valid width.';

    const lengthState = positiveProblem(input.length, MAX_DIMENSION);
    if (lengthState === 'blank') blank = true;
    else if (lengthState === 'zero') errors.length = 'Length must be greater than zero.';
    else if (lengthState === 'negative') errors.length = 'Length cannot be negative.';
    else if (lengthState === 'large') errors.length = 'Enter a smaller length.';
    else if (lengthState === 'bad') errors.length = 'Enter a valid length.';
  } else {
    const areaState = nonNegativeProblem(input.area, MAX_AREA);
    if (areaState === 'blank') blank = true;
    else if (areaState === 'negative') errors.area = 'Area cannot be negative.';
    else if (areaState === 'large') errors.area = 'Enter a smaller area.';
    else if (areaState === 'bad') errors.area = 'Enter a valid area.';
  }

  if (input.pricePerUnit !== null) {
    const priceState = nonNegativeProblem(input.pricePerUnit, MAX_PRICE);
    if (priceState === 'negative') errors.pricePerUnit = 'Price cannot be negative.';
    else if (priceState === 'large') errors.pricePerUnit = 'Enter a smaller unit price.';
    else if (priceState === 'bad') errors.pricePerUnit = 'Enter a valid unit price.';
  }

  const isValid = Object.keys(errors).length === 0 && !blank;
  return { isValid, errors };
}
