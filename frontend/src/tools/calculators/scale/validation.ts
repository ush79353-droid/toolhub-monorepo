import { isIncompleteNumber, parseOptionalNumber } from '../length-converter/validation';
import { parseScaleFactor, unitsForDimension } from './calculation';
import type {
  ScaleCalculatorInput,
  ScaleDimension,
  ScaleFieldErrors,
  ScaleMode,
  ScaleUnit,
} from './types';

export { isIncompleteNumber, parseOptionalNumber };

const MAX_MEASURE = 1e30;

export function parseNonNegativeMeasure(
  raw: string,
  field: 'scaledValue' | 'realValue'
): { value: number | null; error?: string; blank: boolean } {
  const cleaned = raw.trim();
  if (cleaned === '' || isIncompleteNumber(cleaned)) {
    return { value: null, blank: true };
  }
  const value = parseOptionalNumber(raw);
  if (value === null) return { value: null, blank: true };
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, error: 'Enter a valid measurement.' };
  }
  if (value < 0) {
    return {
      value: null,
      blank: false,
      error: 'Measurements must be nonnegative.',
    };
  }
  if (value > MAX_MEASURE) {
    return {
      value: null,
      blank: false,
      error: 'Measurement is too large to convert safely.',
    };
  }
  void field;
  return { value, blank: false };
}

export function parseScaleInput(raw: string): {
  value: number | null;
  error?: string;
  blank: boolean;
} {
  const cleaned = raw.trim();
  if (cleaned === '' || cleaned === ':' || cleaned.endsWith(':') || cleaned.startsWith(':')) {
    if (cleaned === '') return { value: null, blank: true };
    if (cleaned === ':' || cleaned.endsWith(':') || cleaned.startsWith(':')) {
      // Incomplete ratio while typing
      if (/^\d*\.?\d*:?\d*\.?\d*$/.test(cleaned.replace(/\s/g, ''))) {
        return { value: null, blank: true };
      }
    }
  }
  if (isIncompleteNumber(cleaned) && !cleaned.includes(':')) {
    return { value: null, blank: true };
  }

  const value = parseScaleFactor(raw);
  if (value === null) return { value: null, blank: true };
  if (!Number.isFinite(value) || value <= 0) {
    return {
      value: null,
      blank: false,
      error: 'Enter a positive scale factor or ratio such as 1:100 or 2:1.',
    };
  }
  return { value, blank: false };
}

export function isUnitCompatible(
  unit: ScaleUnit,
  dimension: ScaleDimension
): boolean {
  return (unitsForDimension(dimension) as readonly string[]).includes(unit);
}

export function validateScaleDraft(opts: {
  dimension: ScaleDimension;
  mode: ScaleMode;
  scaledRaw: string;
  realRaw: string;
  scaleRaw: string;
  scaledUnit: ScaleUnit;
  realUnit: ScaleUnit;
}): {
  isValid: boolean;
  input: ScaleCalculatorInput;
  errors: ScaleFieldErrors;
} {
  const errors: ScaleFieldErrors = {};
  const { dimension, mode } = opts;

  if (!isUnitCompatible(opts.scaledUnit, dimension) || !isUnitCompatible(opts.realUnit, dimension)) {
    errors.units = 'Select units that match the conversion type.';
  }

  const scaled = parseNonNegativeMeasure(opts.scaledRaw, 'scaledValue');
  const real = parseNonNegativeMeasure(opts.realRaw, 'realValue');
  const scale = parseScaleInput(opts.scaleRaw);

  if (scaled.error) errors.scaledValue = scaled.error;
  if (real.error) errors.realValue = real.error;
  if (scale.error) errors.scaleInput = scale.error;

  if (mode === 'scale-factor') {
    if (scaled.blank || real.blank) {
      return {
        isValid: false,
        input: {
          dimension,
          mode,
          scaledValue: scaled.value,
          realValue: real.value,
          scaledUnit: opts.scaledUnit,
          realUnit: opts.realUnit,
          scaleFactor: null,
        },
        errors,
      };
    }
    if (real.value === 0) {
      errors.realValue = 'Real measurement must be greater than zero to compute a scale factor.';
    }
    if (scaled.value === 0 && real.value !== null && real.value > 0) {
      errors.scaledValue =
        'A zero scaled measurement yields a degenerate scale factor and cannot be used for inverse scaling.';
    }
  } else if (mode === 'scaled-measurement') {
    if (real.blank || scale.blank) {
      return {
        isValid: false,
        input: {
          dimension,
          mode,
          scaledValue: null,
          realValue: real.value,
          scaledUnit: opts.scaledUnit,
          realUnit: opts.realUnit,
          scaleFactor: scale.value,
        },
        errors,
      };
    }
  } else {
    if (scaled.blank || scale.blank) {
      return {
        isValid: false,
        input: {
          dimension,
          mode,
          scaledValue: scaled.value,
          realValue: null,
          scaledUnit: opts.scaledUnit,
          realUnit: opts.realUnit,
          scaleFactor: scale.value,
        },
        errors,
      };
    }
  }

  const isValid = Object.keys(errors).length === 0;
  return {
    isValid,
    input: {
      dimension,
      mode,
      scaledValue: scaled.value,
      realValue: real.value,
      scaledUnit: opts.scaledUnit,
      realUnit: opts.realUnit,
      scaleFactor: scale.value,
    },
    errors,
  };
}
