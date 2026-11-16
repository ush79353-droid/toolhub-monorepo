import type { ActiveField, ConversionCategory, MetricImperialFieldErrors } from './types';
import { ABS_ZERO_EPS, MAX_ABS_VALUE } from './types';
import { convertMeasurement } from './calculation';
import { getCategory } from './units';

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

export function parseField(raw: string): {
  blank: boolean;
  incomplete: boolean;
  value: number | null;
  error?: string;
} {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return { blank: true, incomplete: false, value: null };
  if (isIncompleteNumber(trimmed)) return { blank: false, incomplete: true, value: null };
  const value = parseOptionalNumber(trimmed);
  if (value === null || !Number.isFinite(value)) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'Enter a valid finite number.',
    };
  }
  if (Math.abs(value) > MAX_ABS_VALUE) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'Enter a smaller absolute value.',
    };
  }
  return { blank: false, incomplete: false, value };
}

export function validateActiveValue(args: {
  category: ConversionCategory;
  activeField: ActiveField;
  value: number;
  fromUnit: string;
  toUnit: string;
}): { ok: true } | { ok: false; errors: MetricImperialFieldErrors } {
  const cat = getCategory(args.category);
  const fieldKey = args.activeField;

  if (!cat.allowNegative && args.value < 0) {
    return {
      ok: false,
      errors: { [fieldKey]: 'Value cannot be negative for this quantity.' },
    };
  }

  const converted = convertMeasurement(
    args.value,
    args.category,
    args.fromUnit,
    args.toUnit,
  );
  if (!converted.ok) {
    return { ok: false, errors: { [fieldKey]: converted.error } };
  }

  if (cat.kind === 'temperature') {
    // Absolute zero already checked in convertMeasurement; keep boundary soft.
    void ABS_ZERO_EPS;
  }

  return { ok: true };
}
