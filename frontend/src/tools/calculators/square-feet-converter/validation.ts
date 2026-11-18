import {
  AREA_TO_SQUARE_METERS,
  MAX_ABS_VALUE,
  type AreaUnit,
  type SquareFeetConverterFieldErrors,
  type SquareFeetConverterInput,
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

/** Blank and incomplete drafts become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

export function isAreaUnit(value: string): value is AreaUnit {
  return Object.prototype.hasOwnProperty.call(AREA_TO_SQUARE_METERS, value);
}

function areaProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateSquareFeetConverter(input: SquareFeetConverterInput): {
  isValid: boolean;
  errors: SquareFeetConverterFieldErrors;
} {
  const errors: SquareFeetConverterFieldErrors = {};

  if (!isAreaUnit(input.targetUnit)) {
    errors.targetUnit = 'Select a valid area unit.';
  }

  const field = input.source === 'squareFeet' ? 'squareFeet' : 'conversion';
  const state = areaProblem(input.value);

  if (state === 'blank') {
    return { isValid: false, errors };
  }
  if (state === 'bad') {
    errors[field] = 'Enter a valid finite area.';
  } else if (state === 'negative') {
    errors[field] = 'Area cannot be negative.';
  } else if (state === 'large') {
    errors[field] = 'Enter a smaller area.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
