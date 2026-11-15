import {
  MAX_ABS_LATITUDE,
  MAX_ABS_LONGITUDE,
  type CoordinateFormat,
  type CoordinatesFieldErrors,
} from './types';

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
  const cleaned = raw.trim();
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

export interface AxisDraft {
  degrees: string;
  minutes: string;
  seconds: string;
  decimalMinutes: string;
}

/**
 * Parse one axis from the visible draft.
 * Returns magnitude when `showLetters` (caller applies hemisphere sign).
 * Returns signed decimal degrees when letters are off.
 */
export function validateAxisComponents(opts: {
  format: CoordinateFormat;
  showLetters: boolean;
  maxAbsDegrees: number;
  axis: 'latitude' | 'longitude';
  draft: AxisDraft;
}): { isValid: boolean; value: number | null; errors: CoordinatesFieldErrors; blank: boolean } {
  const { format, showLetters, maxAbsDegrees, axis, draft } = opts;
  const errors: CoordinatesFieldErrors = {};
  const degKey = axis === 'latitude' ? 'latDegrees' : 'lonDegrees';
  const minKey = axis === 'latitude' ? 'latMinutes' : 'lonMinutes';
  const secKey = axis === 'latitude' ? 'latSeconds' : 'lonSeconds';
  const dmKey = axis === 'latitude' ? 'latDecimalMinutes' : 'lonDecimalMinutes';
  const axisKey = axis;

  const finishMagnitude = (magnitude: number, signedFromField: number): {
    isValid: boolean;
    value: number | null;
    errors: CoordinatesFieldErrors;
    blank: boolean;
  } => {
    if (magnitude > maxAbsDegrees) {
      errors[axisKey] =
        axis === 'latitude'
          ? 'Latitude must be between −90° and 90°.'
          : 'Longitude must be between −180° and 180°.';
      return { isValid: false, value: null, errors, blank: false };
    }
    return {
      isValid: true,
      value: showLetters ? magnitude : signedFromField,
      errors,
      blank: false,
    };
  };

  if (format === 'DD') {
    const deg = parseOptionalNumber(draft.degrees);
    if (deg === null) return { isValid: false, value: null, errors, blank: true };
    if (!Number.isFinite(deg)) {
      errors[degKey] = 'Enter a valid number of degrees.';
      return { isValid: false, value: null, errors, blank: false };
    }
    if (showLetters && deg < 0) {
      errors[degKey] = 'Use a nonnegative magnitude with hemisphere letters, or uncheck letters.';
      return { isValid: false, value: null, errors, blank: false };
    }
    return finishMagnitude(Math.abs(deg), deg);
  }

  if (format === 'DMS') {
    const degrees = parseOptionalNumber(draft.degrees);
    const minutes = parseOptionalNumber(draft.minutes);
    const seconds = parseOptionalNumber(draft.seconds);

    if (degrees === null && minutes === null && seconds === null) {
      return { isValid: false, value: null, errors, blank: true };
    }
    if (degrees === null || minutes === null || seconds === null) {
      return { isValid: false, value: null, errors, blank: true };
    }
    if (!Number.isFinite(degrees)) errors[degKey] = 'Enter valid degrees.';
    if (!Number.isFinite(minutes)) errors[minKey] = 'Enter valid minutes.';
    if (!Number.isFinite(seconds)) errors[secKey] = 'Enter valid seconds.';
    if (Object.keys(errors).length > 0) {
      return { isValid: false, value: null, errors, blank: false };
    }

    if (showLetters && degrees < 0) {
      errors[degKey] = 'Use a nonnegative magnitude with hemisphere letters.';
    }
    if (minutes < 0 || minutes >= 60) {
      errors[minKey] = 'Minutes must be from 0 (inclusive) to 60 (exclusive).';
    }
    if (seconds < 0 || seconds >= 60) {
      errors[secKey] = 'Seconds must be from 0 (inclusive) to 60 (exclusive).';
    }
    const degAbs = Math.abs(degrees);
    if (degAbs > maxAbsDegrees || (degAbs === maxAbsDegrees && (minutes > 0 || seconds > 0))) {
      errors[axisKey] =
        axis === 'latitude'
          ? 'Latitude must be between −90° and 90°.'
          : 'Longitude must be between −180° and 180°.';
    }
    if (Object.keys(errors).length > 0) {
      return { isValid: false, value: null, errors, blank: false };
    }

    const magnitude = degAbs + minutes / 60 + seconds / 3600;
    const fieldSign: 1 | -1 = degrees < 0 ? -1 : 1;
    return finishMagnitude(magnitude, fieldSign * magnitude);
  }

  // DDM
  const degrees = parseOptionalNumber(draft.degrees);
  const decimalMinutes = parseOptionalNumber(draft.decimalMinutes);
  if (degrees === null && decimalMinutes === null) {
    return { isValid: false, value: null, errors, blank: true };
  }
  if (degrees === null || decimalMinutes === null) {
    return { isValid: false, value: null, errors, blank: true };
  }
  if (!Number.isFinite(degrees)) errors[degKey] = 'Enter valid degrees.';
  if (!Number.isFinite(decimalMinutes)) errors[dmKey] = 'Enter valid decimal minutes.';
  if (Object.keys(errors).length > 0) {
    return { isValid: false, value: null, errors, blank: false };
  }

  if (showLetters && degrees < 0) {
    errors[degKey] = 'Use a nonnegative magnitude with hemisphere letters.';
  }
  if (decimalMinutes < 0 || decimalMinutes >= 60) {
    errors[dmKey] = 'Decimal minutes must be from 0 (inclusive) to 60 (exclusive).';
  }
  const degAbs = Math.abs(degrees);
  if (degAbs > maxAbsDegrees || (degAbs === maxAbsDegrees && decimalMinutes > 0)) {
    errors[axisKey] =
      axis === 'latitude'
        ? 'Latitude must be between −90° and 90°.'
        : 'Longitude must be between −180° and 180°.';
  }
  if (Object.keys(errors).length > 0) {
    return { isValid: false, value: null, errors, blank: false };
  }

  const magnitude = degAbs + decimalMinutes / 60;
  const fieldSign: 1 | -1 = degrees < 0 ? -1 : 1;
  return finishMagnitude(magnitude, fieldSign * magnitude);
}

export { MAX_ABS_LATITUDE, MAX_ABS_LONGITUDE };
