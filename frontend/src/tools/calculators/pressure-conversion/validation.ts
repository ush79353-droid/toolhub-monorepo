import { MAX_ABS_VALUE } from './types';

/** Half-typed values such as `1.` stay incomplete so the source field is not overwritten. */
export function isIncompleteNumber(raw: string): boolean {
  const cleaned = raw.trim();
  return (
    cleaned === '' ||
    cleaned === '.' ||
    cleaned === '-' ||
    cleaned === '-.' ||
    cleaned.endsWith('.') ||
    cleaned.toLowerCase().endsWith('e') ||
    cleaned.toLowerCase().endsWith('e-') ||
    cleaned.toLowerCase().endsWith('e+')
  );
}

/** Blank and incomplete drafts become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim();
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

export type PressureValueState = 'blank' | 'bad' | 'large' | 'ok';

/**
 * Signed values are allowed (gauge/differential). Absolute pressure cannot be
 * negative physically, but this unit converter does not enforce that reference.
 */
export function pressureValueState(value: number | null): PressureValueState {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (Math.abs(value) > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function pressureErrorMessage(state: PressureValueState): string | undefined {
  if (state === 'bad') return 'Enter a valid number.';
  if (state === 'large') return 'Enter a smaller absolute value.';
  return undefined;
}
