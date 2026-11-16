import {
  EXTRA_VOLUME_UNITS,
  MAX_ABS_VALUE,
  type CupsToGalFieldErrors,
  type CupsToGalInput,
  type CupsToGalSource,
} from './types';

/** Half-typed values such as `1.` or `1e` stay incomplete. */
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

function volumeProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

function errorMessage(source: CupsToGalSource): string {
  if (source === 'cups') return 'Enter a valid volume in cups.';
  if (source === 'gallons') return 'Enter a valid volume in gallons.';
  return 'Enter a valid volume.';
}

export function validateCupsToGal(input: CupsToGalInput): {
  isValid: boolean;
  errors: CupsToGalFieldErrors;
} {
  const errors: CupsToGalFieldErrors = {};
  const state = volumeProblem(input.value);

  if (state === 'blank') {
    return { isValid: false, errors };
  }
  if (state === 'bad') {
    errors[input.source] = errorMessage(input.source);
  } else if (state === 'negative') {
    errors[input.source] = 'Volume cannot be negative.';
  } else if (state === 'large') {
    errors[input.source] = 'Enter a smaller value.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function isExtraSource(source: CupsToGalSource): boolean {
  return (EXTRA_VOLUME_UNITS as readonly string[]).includes(source);
}
