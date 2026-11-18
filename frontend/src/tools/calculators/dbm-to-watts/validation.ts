import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';
import { convert } from './calculation';
import {
  MAX_ABS_DBM,
  MAX_ABS_LINEAR,
  MODE_META,
  type ConversionMode,
  type DbmFieldErrors,
} from './types';

export { isIncompleteNumber, parseOptionalNumber };

export function parseDbmInput(
  raw: string,
  mode: ConversionMode,
): {
  blank: boolean;
  incomplete: boolean;
  value: number | null;
  error?: string;
} {
  const meta = MODE_META[mode];
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

  if (meta.requirePositiveInput) {
    if (value < 0) {
      return {
        blank: false,
        incomplete: false,
        value: null,
        error: `${meta.inputLabel} cannot be negative.`,
      };
    }
    if (value === 0) {
      return {
        blank: false,
        incomplete: false,
        value: null,
        error: `${meta.inputUnit} must be greater than zero to convert to dBm.`,
      };
    }
    if (value > MAX_ABS_LINEAR) {
      return {
        blank: false,
        incomplete: false,
        value: null,
        error: 'This power value is outside the supported range.',
      };
    }
  } else if (Math.abs(value) > MAX_ABS_DBM) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'This dBm value is outside the supported range.',
    };
  }

  return { blank: false, incomplete: false, value };
}

export function validateAndConvert(
  raw: string,
  mode: ConversionMode,
): {
  errors: DbmFieldErrors;
  resultText: string;
  resultValue: number | null;
} {
  const parsed = parseDbmInput(raw, mode);
  if (parsed.blank || parsed.incomplete) {
    return { errors: {}, resultText: '', resultValue: null };
  }
  if (parsed.error || parsed.value === null) {
    return {
      errors: { input: parsed.error ?? 'Enter a valid finite number.' },
      resultText: '',
      resultValue: null,
    };
  }

  const converted = convert(mode, parsed.value);
  if (!converted.ok) {
    return {
      errors: { input: converted.error },
      resultText: '',
      resultValue: null,
    };
  }

  return {
    errors: {},
    resultText: '',
    resultValue: converted.value,
  };
}
