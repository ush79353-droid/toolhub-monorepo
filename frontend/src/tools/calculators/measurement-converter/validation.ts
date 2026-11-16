import { MAX_ABS_VALUE, type MeasurementFieldErrors, type MeasurementInput } from './types';
import { getUnit } from './units';

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

export function validateMeasurement(input: MeasurementInput): {
  isValid: boolean;
  errors: MeasurementFieldErrors;
} {
  const errors: MeasurementFieldErrors = {};
  let blank = false;

  const from = getUnit(input.dimension, input.fromUnit);
  const to = getUnit(input.dimension, input.toUnit);
  if (!from) errors.fromUnit = 'Select a valid source unit.';
  if (!to) errors.toUnit = 'Select a valid target unit.';
  if (from && to && from.dimension !== to.dimension) {
    errors.toUnit = 'Units must share the same dimension.';
  }

  if (input.value === null) blank = true;
  else if (!Number.isFinite(input.value)) errors.value = 'Enter a valid number.';
  else if (Math.abs(input.value) > MAX_ABS_VALUE) errors.value = 'Enter a smaller value.';

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
