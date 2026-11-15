import type { LengthUnitId } from '../length-converter/types';
import type { AreaUnitId } from '../area-converter/types';
import type { VolumeUnitId } from '../volume-conversion/types';

export type ScaleDimension = 'length' | 'area' | 'volume';
export type ScaleMode = 'scale-factor' | 'scaled-measurement' | 'real-measurement';
export type ScaleKind = 'reduction' | 'enlargement' | 'actual';

export type ScaleLengthUnit = Extract<
  LengthUnitId,
  'mm' | 'cm' | 'm' | 'km' | 'in' | 'ft' | 'yd' | 'mi'
>;
export type ScaleAreaUnit = Extract<
  AreaUnitId,
  'mm2' | 'cm2' | 'm2' | 'km2' | 'in2' | 'ft2' | 'yd2' | 'ac' | 'ha'
>;
export type ScaleVolumeUnit = Extract<
  VolumeUnitId,
  'mm3' | 'cm3' | 'm3' | 'in3' | 'ft3' | 'yd3' | 'L' | 'mL'
>;

export type ScaleUnit = ScaleLengthUnit | ScaleAreaUnit | ScaleVolumeUnit;

export interface ScaleCalculatorInput {
  dimension: ScaleDimension;
  mode: ScaleMode;
  scaledValue: number | null;
  realValue: number | null;
  scaledUnit: ScaleUnit;
  realUnit: ScaleUnit;
  /** Linear scale factor k = scaled_length / real_length (when known). */
  scaleFactor: number | null;
}

export interface ScaleCalculatorResult {
  dimension: ScaleDimension;
  mode: ScaleMode;
  /** Linear scale factor k. */
  scaleFactor: number;
  scaleRatio: string;
  scaleKind: ScaleKind;
  /** Dimension exponent (1 / 2 / 3). */
  exponent: 1 | 2 | 3;
  /** Measurement multiplier k^d. */
  measurementMultiplier: number;
  scaledValue: number;
  realValue: number;
  scaledUnit: ScaleUnit;
  realUnit: ScaleUnit;
  /** Value shown in the calculated field's selected unit. */
  calculatedDisplay: number;
  calculatedUnit: ScaleUnit;
}

export type ScaleFieldErrors = Partial<
  Record<'scaledValue' | 'realValue' | 'scaleInput' | 'units', string>
>;

export const LENGTH_SCALE_UNITS: readonly ScaleLengthUnit[] = [
  'mm',
  'cm',
  'm',
  'km',
  'in',
  'ft',
  'yd',
  'mi',
];

export const AREA_SCALE_UNITS: readonly ScaleAreaUnit[] = [
  'mm2',
  'cm2',
  'm2',
  'km2',
  'in2',
  'ft2',
  'yd2',
  'ac',
  'ha',
];

export const VOLUME_SCALE_UNITS: readonly ScaleVolumeUnit[] = [
  'mm3',
  'cm3',
  'm3',
  'in3',
  'ft3',
  'yd3',
  'L',
  'mL',
];

export const DEFAULT_LENGTH_SCALED_UNIT: ScaleLengthUnit = 'cm';
export const DEFAULT_LENGTH_REAL_UNIT: ScaleLengthUnit = 'm';
export const DEFAULT_AREA_UNIT: ScaleAreaUnit = 'm2';
export const DEFAULT_VOLUME_UNIT: ScaleVolumeUnit = 'm3';

export const DEFAULT_SCALE_INPUT: ScaleCalculatorInput = {
  dimension: 'length',
  mode: 'scale-factor',
  scaledValue: null,
  realValue: null,
  scaledUnit: DEFAULT_LENGTH_SCALED_UNIT,
  realUnit: DEFAULT_LENGTH_REAL_UNIT,
  scaleFactor: null,
};

export const EMPTY_SCALE_INPUT = DEFAULT_SCALE_INPUT;
