import { formatLength, fromMeters, toMeters } from '../length-converter/calculation';
import { LENGTH_UNIT_BY_ID } from '../length-converter/types';
import { formatArea, fromSquareMeters, toSquareMeters } from '../area-converter/calculation';
import { AREA_UNIT_BY_ID } from '../area-converter/types';
import { formatVolume, fromLiters, toLiters } from '../volume-conversion/calculation';
import { VOLUME_UNIT_BY_ID } from '../volume-conversion/types';
import {
  AREA_SCALE_UNITS,
  DEFAULT_AREA_UNIT,
  DEFAULT_LENGTH_REAL_UNIT,
  DEFAULT_LENGTH_SCALED_UNIT,
  DEFAULT_VOLUME_UNIT,
  LENGTH_SCALE_UNITS,
  VOLUME_SCALE_UNITS,
  type ScaleAreaUnit,
  type ScaleCalculatorInput,
  type ScaleCalculatorResult,
  type ScaleDimension,
  type ScaleKind,
  type ScaleLengthUnit,
  type ScaleUnit,
  type ScaleVolumeUnit,
} from './types';

export function dimensionExponent(dimension: ScaleDimension): 1 | 2 | 3 {
  if (dimension === 'area') return 2;
  if (dimension === 'volume') return 3;
  return 1;
}

export function unitsForDimension(dimension: ScaleDimension): readonly ScaleUnit[] {
  if (dimension === 'area') return AREA_SCALE_UNITS;
  if (dimension === 'volume') return VOLUME_SCALE_UNITS;
  return LENGTH_SCALE_UNITS;
}

export function defaultUnitsForDimension(dimension: ScaleDimension): {
  scaledUnit: ScaleUnit;
  realUnit: ScaleUnit;
} {
  if (dimension === 'area') {
    return { scaledUnit: DEFAULT_AREA_UNIT, realUnit: DEFAULT_AREA_UNIT };
  }
  if (dimension === 'volume') {
    return { scaledUnit: DEFAULT_VOLUME_UNIT, realUnit: DEFAULT_VOLUME_UNIT };
  }
  return {
    scaledUnit: DEFAULT_LENGTH_SCALED_UNIT,
    realUnit: DEFAULT_LENGTH_REAL_UNIT,
  };
}

export function unitLabel(unit: ScaleUnit, dimension: ScaleDimension): string {
  if (dimension === 'length') {
    return LENGTH_UNIT_BY_ID[unit as ScaleLengthUnit].symbol;
  }
  if (dimension === 'area') {
    return AREA_UNIT_BY_ID[unit as ScaleAreaUnit].symbol;
  }
  return VOLUME_UNIT_BY_ID[unit as ScaleVolumeUnit].symbol;
}

export function formatMeasure(
  value: number,
  dimension: ScaleDimension
): string {
  if (dimension === 'area') return formatArea(value);
  if (dimension === 'volume') return formatVolume(value);
  return formatLength(value);
}

/** Convert a measurement into a consistent base quantity for ratios. */
export function toBase(
  value: number,
  unit: ScaleUnit,
  dimension: ScaleDimension
): number {
  if (dimension === 'length') return toMeters(value, unit as ScaleLengthUnit);
  if (dimension === 'area') return toSquareMeters(value, unit as ScaleAreaUnit);
  return toLiters(value, unit as ScaleVolumeUnit);
}

export function fromBase(
  base: number,
  unit: ScaleUnit,
  dimension: ScaleDimension
): number {
  if (dimension === 'length') return fromMeters(base, unit as ScaleLengthUnit);
  if (dimension === 'area') return fromSquareMeters(base, unit as ScaleAreaUnit);
  return fromLiters(base, unit as ScaleVolumeUnit);
}

/**
 * Parse a scale factor as a decimal or ratio `a:b` meaning k = a/b
 * (scaled:real for linear dimensions).
 */
export function parseScaleFactor(raw: string): number | null {
  const cleaned = raw.trim().replace(/\s+/g, '');
  if (!cleaned) return null;

  if (cleaned.includes(':')) {
    const parts = cleaned.split(':');
    if (parts.length !== 2) return Number.NaN;
    const left = Number(parts[0]);
    const right = Number(parts[1]);
    if (!Number.isFinite(left) || !Number.isFinite(right)) return Number.NaN;
    if (left <= 0 || right <= 0) return Number.NaN;
    return left / right;
  }

  const value = Number(cleaned);
  if (!Number.isFinite(value)) return Number.NaN;
  if (value <= 0) return Number.NaN;
  return value;
}

function nearInteger(value: number, eps = 1e-9): number | null {
  const rounded = Math.round(value);
  if (rounded <= 0) return null;
  if (Math.abs(value - rounded) <= eps * Math.max(1, Math.abs(value))) {
    return rounded;
  }
  return null;
}

/** Format a positive k as a readable ratio string. */
export function formatScaleRatio(k: number): string {
  if (!Number.isFinite(k) || k <= 0) return '';
  if (Math.abs(k - 1) <= 1e-12) return '1:1';

  if (k > 1) {
    const whole = nearInteger(k);
    if (whole !== null) return `${whole}:1`;
    // Prefer a:b with small integers when close.
    for (let b = 1; b <= 1000; b++) {
      const a = nearInteger(k * b, 1e-8);
      if (a !== null) return `${a}:${b}`;
    }
    return `${formatMeasure(k, 'length')}:1`;
  }

  const inv = 1 / k;
  const whole = nearInteger(inv);
  if (whole !== null) return `1:${whole}`;
  for (let a = 1; a <= 1000; a++) {
    const b = nearInteger(inv * a, 1e-8);
    if (b !== null) return `${a}:${b}`;
  }
  return `1:${formatMeasure(inv, 'length')}`;
}

export function classifyScale(k: number): ScaleKind {
  if (Math.abs(k - 1) <= 1e-12) return 'actual';
  return k > 1 ? 'enlargement' : 'reduction';
}

export function scaleKindLabel(kind: ScaleKind): string {
  if (kind === 'enlargement') return 'Enlargement';
  if (kind === 'actual') return 'Actual size';
  return 'Reduction';
}

/**
 * Linear scale factor from scaled/real measurements in the same dimension.
 * k = (scaled_base / real_base)^(1/d)
 */
export function linearScaleFromMeasurements(
  scaledBase: number,
  realBase: number,
  dimension: ScaleDimension
): number {
  if (!(realBase > 0) || !(scaledBase >= 0) || !Number.isFinite(scaledBase) || !Number.isFinite(realBase)) {
    throw new Error('Invalid measurements for scale factor');
  }
  if (scaledBase === 0) {
    throw new Error('Zero scaled measurement yields a degenerate scale factor');
  }
  const d = dimensionExponent(dimension);
  const ratio = scaledBase / realBase;
  if (d === 1) return ratio;
  if (d === 2) return Math.sqrt(ratio);
  return Math.cbrt(ratio);
}

export function applyScaleToMeasurement(
  realBase: number,
  k: number,
  dimension: ScaleDimension
): number {
  if (!(k > 0) || !Number.isFinite(k) || !Number.isFinite(realBase)) {
    throw new Error('Invalid scale application');
  }
  const d = dimensionExponent(dimension);
  return realBase * k ** d;
}

export function realFromScaledMeasurement(
  scaledBase: number,
  k: number,
  dimension: ScaleDimension
): number {
  if (!(k > 0) || !Number.isFinite(k) || !Number.isFinite(scaledBase)) {
    throw new Error('Invalid inverse scale application');
  }
  const d = dimensionExponent(dimension);
  return scaledBase / k ** d;
}

export function calculateScale(input: ScaleCalculatorInput): ScaleCalculatorResult {
  const { dimension, mode } = input;
  const d = dimensionExponent(dimension);

  if (mode === 'scale-factor') {
    if (input.scaledValue === null || input.realValue === null) {
      throw new Error('Scaled and real measurements are required');
    }
    const scaledBase = toBase(input.scaledValue, input.scaledUnit, dimension);
    const realBase = toBase(input.realValue, input.realUnit, dimension);
    const k = linearScaleFromMeasurements(scaledBase, realBase, dimension);
    return {
      dimension,
      mode,
      scaleFactor: k,
      scaleRatio: formatScaleRatio(k),
      scaleKind: classifyScale(k),
      exponent: d,
      measurementMultiplier: k ** d,
      scaledValue: input.scaledValue,
      realValue: input.realValue,
      scaledUnit: input.scaledUnit,
      realUnit: input.realUnit,
      calculatedDisplay: k,
      calculatedUnit: input.scaledUnit,
    };
  }

  if (input.scaleFactor === null || !(input.scaleFactor > 0)) {
    throw new Error('A positive scale factor is required');
  }
  const k = input.scaleFactor;

  if (mode === 'scaled-measurement') {
    if (input.realValue === null) throw new Error('Real measurement is required');
    const realBase = toBase(input.realValue, input.realUnit, dimension);
    const scaledBase = applyScaleToMeasurement(realBase, k, dimension);
    const scaledDisplay = fromBase(scaledBase, input.scaledUnit, dimension);
    return {
      dimension,
      mode,
      scaleFactor: k,
      scaleRatio: formatScaleRatio(k),
      scaleKind: classifyScale(k),
      exponent: d,
      measurementMultiplier: k ** d,
      scaledValue: scaledDisplay,
      realValue: input.realValue,
      scaledUnit: input.scaledUnit,
      realUnit: input.realUnit,
      calculatedDisplay: scaledDisplay,
      calculatedUnit: input.scaledUnit,
    };
  }

  if (input.scaledValue === null) throw new Error('Scaled measurement is required');
  const scaledBase = toBase(input.scaledValue, input.scaledUnit, dimension);
  const realBase = realFromScaledMeasurement(scaledBase, k, dimension);
  const realDisplay = fromBase(realBase, input.realUnit, dimension);
  return {
    dimension,
    mode,
    scaleFactor: k,
    scaleRatio: formatScaleRatio(k),
    scaleKind: classifyScale(k),
    exponent: d,
    measurementMultiplier: k ** d,
    scaledValue: input.scaledValue,
    realValue: realDisplay,
    scaledUnit: input.scaledUnit,
    realUnit: input.realUnit,
    calculatedDisplay: realDisplay,
    calculatedUnit: input.realUnit,
  };
}
