import { MAX_ABS_SECONDS } from './types';

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

export type ParseResult =
  | { blank: true; incomplete?: false; value?: undefined; error?: undefined }
  | { blank?: false; incomplete: true; value?: undefined; error?: undefined }
  | { blank?: false; incomplete?: false; value: null; error: string }
  | { blank?: false; incomplete?: false; value: number; error?: undefined };

export function parseDurationInput(raw: string): ParseResult {
  const cleaned = raw.trim();
  if (cleaned === '') return { blank: true };
  if (isIncompleteNumber(cleaned)) return { incomplete: true };
  const value = parseOptionalNumber(cleaned);
  if (value === null || !Number.isFinite(value)) {
    return { value: null, error: 'Enter a valid finite number.' };
  }
  if (Math.abs(value) > MAX_ABS_SECONDS) {
    return { value: null, error: 'Enter a smaller finite value.' };
  }
  return { value };
}
