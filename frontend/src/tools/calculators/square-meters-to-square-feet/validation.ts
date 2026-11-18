import {
  MAX_ABS_VALUE,
  OTHER_AREA_OPTIONS,
  type OtherAreaUnit,
  type SquareMetersToSquareFeetFieldErrors,
  type SquareMetersToSquareFeetInput,
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

const OTHER_SET = new Set<string>(OTHER_AREA_OPTIONS.map((o) => o.value));

export function isOtherAreaUnit(value: string): value is OtherAreaUnit {
  return OTHER_SET.has(value);
}

function areaProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateSquareMetersToSquareFeet(input: SquareMetersToSquareFeetInput): {
  isValid: boolean;
  errors: SquareMetersToSquareFeetFieldErrors;
} {
  const errors: SquareMetersToSquareFeetFieldErrors = {};

  if (!isOtherAreaUnit(input.otherUnit)) {
    errors.otherUnit = 'Select a valid area unit.';
  }

  const field =
    input.source === 'squareMeters'
      ? 'squareMeters'
      : input.source === 'squareFeet'
        ? 'squareFeet'
        : 'other';
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
