import { isSupportedCurrency } from '@/tools/shared/currency';
import {
  MAX_AREA,
  MAX_DIMENSION,
  MAX_PRICE,
  type LotSizeToAcresFieldErrors,
  type LotSizeToAcresInput,
} from './types';

/** Blank and a half-typed sign or decimal become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim();
  if (cleaned === '' || cleaned === '.' || cleaned === '-' || cleaned === '-.') return null;
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

export function validateLotSizeToAcres(input: LotSizeToAcresInput): {
  isValid: boolean;
  errors: LotSizeToAcresFieldErrors;
} {
  const errors: LotSizeToAcresFieldErrors = {};
  let blank = false;

  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a currency from the list.';
  }

  const widthState = nonNegativeProblem(input.width, MAX_DIMENSION);
  const lengthState = nonNegativeProblem(input.length, MAX_DIMENSION);
  const areaState = nonNegativeProblem(input.area, MAX_AREA);

  if (input.source === 'dimensions') {
    if (widthState === 'blank') blank = true;
    else if (widthState === 'negative') errors.width = 'Width cannot be negative.';
    else if (widthState === 'large') errors.width = 'Enter a smaller width.';
    else if (widthState === 'bad') errors.width = 'Enter a valid width.';

    if (lengthState === 'blank') blank = true;
    else if (lengthState === 'negative') errors.length = 'Length cannot be negative.';
    else if (lengthState === 'large') errors.length = 'Enter a smaller length.';
    else if (lengthState === 'bad') errors.length = 'Enter a valid length.';
  } else if (input.source === 'solveLength') {
    if (widthState === 'blank') blank = true;
    else if (widthState === 'negative') errors.width = 'Width cannot be negative.';
    else if (widthState === 'large') errors.width = 'Enter a smaller width.';
    else if (widthState === 'bad') errors.width = 'Enter a valid width.';

    if (areaState === 'blank') blank = true;
    else if (areaState === 'negative') errors.area = 'Area cannot be negative.';
    else if (areaState === 'large') errors.area = 'Enter a smaller area.';
    else if (areaState === 'bad') errors.area = 'Enter a valid area.';

    if (
      widthState === 'ok' &&
      areaState === 'ok' &&
      input.width === 0 &&
      input.area !== null &&
      input.area > 0
    ) {
      errors.width = 'Width must be greater than zero to solve for length.';
    }
  } else {
    if (lengthState === 'blank') blank = true;
    else if (lengthState === 'negative') errors.length = 'Length cannot be negative.';
    else if (lengthState === 'large') errors.length = 'Enter a smaller length.';
    else if (lengthState === 'bad') errors.length = 'Enter a valid length.';

    if (areaState === 'blank') blank = true;
    else if (areaState === 'negative') errors.area = 'Area cannot be negative.';
    else if (areaState === 'large') errors.area = 'Enter a smaller area.';
    else if (areaState === 'bad') errors.area = 'Enter a valid area.';

    if (
      lengthState === 'ok' &&
      areaState === 'ok' &&
      input.length === 0 &&
      input.area !== null &&
      input.area > 0
    ) {
      errors.length = 'Length must be greater than zero to solve for width.';
    }
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
