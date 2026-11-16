import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';
import { MAX_ABS_GRAMS, MAX_ABS_VOLUME_ML } from './types';

export { isIncompleteNumber, parseOptionalNumber };

export function parseNonNegativeNumber(
  raw: string,
  opts?: { max?: number; label?: string },
): {
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
  if (value < 0) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: `${opts?.label ?? 'Values'} cannot be negative.`,
    };
  }
  const max = opts?.max ?? MAX_ABS_GRAMS;
  if (value > max) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'This value is outside the supported range.',
    };
  }
  return { blank: false, incomplete: false, value };
}

export function parseAbvPercent(raw: string): {
  blank: boolean;
  incomplete: boolean;
  value: number | null;
  error?: string;
} {
  const parsed = parseNonNegativeNumber(raw, { max: 100, label: 'ABV' });
  if (parsed.value != null && parsed.value > 100) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'Alcohol by volume must be between 0% and 100%.',
    };
  }
  if (parsed.error && parsed.value == null && !parsed.blank && !parsed.incomplete) {
    if (raw.trim() !== '' && parseOptionalNumber(raw.trim().replace(/,/g, '')) !== null) {
      const v = parseOptionalNumber(raw.trim().replace(/,/g, ''));
      if (v != null && v > 100) {
        return {
          blank: false,
          incomplete: false,
          value: null,
          error: 'Alcohol by volume must be between 0% and 100%.',
        };
      }
    }
  }
  return parsed;
}

export function parseVolumeMl(raw: string) {
  return parseNonNegativeNumber(raw, { max: MAX_ABS_VOLUME_ML, label: 'Volume' });
}
