import { MAX_ABS_VALUE } from './types';

/** Half-typed values such as `1.` stay incomplete. */
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
  const cleaned = raw.trim();
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

export type VolumeValueState = 'blank' | 'bad' | 'negative' | 'large' | 'ok';

export function volumeValueState(value: number | null): VolumeValueState {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function volumeErrorMessage(state: VolumeValueState): string | undefined {
  if (state === 'bad') return 'Enter a valid number.';
  if (state === 'negative') return 'Volume cannot be negative.';
  if (state === 'large') return 'Enter a smaller value.';
  return undefined;
}
