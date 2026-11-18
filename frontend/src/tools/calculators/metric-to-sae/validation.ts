import { MAX_ABS_VALUE, type MetricToSaeFieldErrors } from './types';
import type { LengthUnit } from './units';

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

export function parseMetricSaeInput(raw: string): {
  blank: boolean;
  incomplete: boolean;
  value: number | null;
  error?: string;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { blank: true, incomplete: false, value: null };
  if (isIncompleteNumber(cleaned)) return { blank: false, incomplete: true, value: null };
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { blank: false, incomplete: false, value: null, error: 'Enter a valid finite number.' };
  }
  if (Math.abs(value) > MAX_ABS_VALUE) {
    return { blank: false, incomplete: false, value: null, error: 'Enter a smaller absolute value.' };
  }
  return { blank: false, incomplete: false, value };
}

export function fieldError(
  unit: LengthUnit,
  message: string,
): MetricToSaeFieldErrors {
  return { [unit]: message };
}
