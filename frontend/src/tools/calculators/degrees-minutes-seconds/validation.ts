import { parseOptionalNumber as parseShared, isIncompleteNumber } from '../coordinates/validation';
import { dmsToDecimal } from './calculation';
import {
  MAX_ABS_ANGLE,
  type AngleSign,
  type DegreesMinutesSecondsFieldErrors,
} from './types';

export { parseOptionalNumber, isIncompleteNumber } from '../coordinates/validation';

export interface DmsDraftFields {
  degrees: string;
  minutes: string;
  seconds: string;
}

/**
 * Parse the degrees field into magnitude + sign.
 * Supports `-0` so `-0° 30′` becomes −0.5°.
 */
export function parseSignedDegreesField(
  raw: string
): { sign: AngleSign; magnitude: number } | { blank: true } | { error: string } {
  const cleaned = raw.trim();
  if (
    cleaned === '' ||
    cleaned === '-' ||
    cleaned === '-.' ||
    cleaned === '.' ||
    isIncompleteNumber(cleaned)
  ) {
    return { blank: true };
  }

  const negative = cleaned.startsWith('-');
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { error: 'Enter a valid number of degrees.' };
  }
  const magnitude = Math.abs(value);
  if (magnitude > MAX_ABS_ANGLE) {
    return { error: 'Angle is too large to convert safely.' };
  }
  return { sign: negative ? -1 : 1, magnitude };
}

function parseNonNegComponent(
  raw: string,
  label: 'minutes' | 'seconds',
  allowEmptyAsZero: boolean
): { value: number | null; error?: string; blank: boolean } {
  const cleaned = raw.trim();
  if (cleaned === '' || isIncompleteNumber(cleaned)) {
    if (allowEmptyAsZero && cleaned === '') {
      return { value: 0, blank: false };
    }
    return { value: null, blank: true };
  }
  const value = parseShared(raw);
  if (value === null) return { value: null, blank: true };
  if (!Number.isFinite(value)) {
    return {
      value: null,
      blank: false,
      error: `Enter a valid number of ${label}.`,
    };
  }
  if (value < 0 || value >= 60) {
    return {
      value: null,
      blank: false,
      error:
        label === 'minutes'
          ? 'Minutes must be from 0 (inclusive) to 60 (exclusive).'
          : 'Seconds must be from 0 (inclusive) to 60 (exclusive).',
    };
  }
  return { value, blank: false };
}

export function parseDmsDraft(draft: DmsDraftFields): {
  isValid: boolean;
  decimalDegrees: number | null;
  sign: AngleSign;
  errors: DegreesMinutesSecondsFieldErrors;
  blank: boolean;
} {
  const errors: DegreesMinutesSecondsFieldErrors = {};
  const degRaw = draft.degrees.trim();
  const minRaw = draft.minutes.trim();
  const secRaw = draft.seconds.trim();

  if (degRaw === '' && minRaw === '' && secRaw === '') {
    return { isValid: false, decimalDegrees: null, sign: 1, errors, blank: true };
  }

  // Still typing sign or incomplete token.
  if (degRaw === '-' || degRaw === '-.' || degRaw === '.' || isIncompleteNumber(degRaw)) {
    if (degRaw !== '') {
      return { isValid: false, decimalDegrees: null, sign: 1, errors, blank: true };
    }
  }

  const degParsed =
    degRaw === ''
      ? ({ sign: 1 as AngleSign, magnitude: 0 } as const)
      : parseSignedDegreesField(draft.degrees);

  if ('blank' in degParsed) {
    return { isValid: false, decimalDegrees: null, sign: 1, errors, blank: true };
  }
  if ('error' in degParsed) {
    errors.degrees = degParsed.error;
    return { isValid: false, decimalDegrees: null, sign: 1, errors, blank: false };
  }

  const anyPresent = degRaw !== '' || minRaw !== '' || secRaw !== '';
  const minutes = parseNonNegComponent(draft.minutes, 'minutes', anyPresent);
  const seconds = parseNonNegComponent(draft.seconds, 'seconds', anyPresent);

  if (minutes.blank || seconds.blank) {
    return {
      isValid: false,
      decimalDegrees: null,
      sign: degParsed.sign,
      errors,
      blank: true,
    };
  }
  if (minutes.error) errors.minutes = minutes.error;
  if (seconds.error) errors.seconds = seconds.error;
  if (Object.keys(errors).length > 0) {
    return {
      isValid: false,
      decimalDegrees: null,
      sign: degParsed.sign,
      errors,
      blank: false,
    };
  }

  try {
    const decimalDegrees = dmsToDecimal(
      degParsed.magnitude,
      minutes.value!,
      seconds.value!,
      degParsed.sign
    );
    return {
      isValid: true,
      decimalDegrees,
      sign: degParsed.sign,
      errors,
      blank: false,
    };
  } catch {
    errors.degrees = 'Enter a valid DMS angle.';
    return {
      isValid: false,
      decimalDegrees: null,
      sign: degParsed.sign,
      errors,
      blank: false,
    };
  }
}

export function parseDdDraft(raw: string): {
  isValid: boolean;
  decimalDegrees: number | null;
  errors: DegreesMinutesSecondsFieldErrors;
  blank: boolean;
} {
  const errors: DegreesMinutesSecondsFieldErrors = {};
  const cleaned = raw.trim();
  if (cleaned === '' || isIncompleteNumber(cleaned)) {
    return { isValid: false, decimalDegrees: null, errors, blank: true };
  }
  const value = parseShared(raw);
  if (value === null) {
    return { isValid: false, decimalDegrees: null, errors, blank: true };
  }
  if (!Number.isFinite(value)) {
    errors.decimalDegrees = 'Enter a valid decimal-degree angle.';
    return { isValid: false, decimalDegrees: null, errors, blank: false };
  }
  if (Math.abs(value) > MAX_ABS_ANGLE) {
    errors.decimalDegrees = 'Angle is too large to convert safely.';
    return { isValid: false, decimalDegrees: null, errors, blank: false };
  }
  return { isValid: true, decimalDegrees: value, errors, blank: false };
}
