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

export type LengthValueState = 'blank' | 'bad' | 'large' | 'ok';

export function lengthValueState(value: number | null): LengthValueState {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (Math.abs(value) > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function lengthErrorMessage(state: LengthValueState): string | undefined {
  if (state === 'bad') return 'Enter a valid number.';
  if (state === 'large') return 'Enter a smaller absolute value.';
  return undefined;
}
