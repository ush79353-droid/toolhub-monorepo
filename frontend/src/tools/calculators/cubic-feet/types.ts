/** Length units for each rectangular dimension. */
export type LengthUnit = 'mm' | 'cm' | 'dm' | 'm' | 'km' | 'in' | 'ft' | 'yd' | 'mi';

export type MissingDimension = 'length' | 'width' | 'height';

export interface CubicFeetInput {
  length: number | null;
  width: number | null;
  height: number | null;
  lengthUnit: LengthUnit;
  widthUnit: LengthUnit;
  heightUnit: LengthUnit;
}

export interface MissingDimensionInput {
  unknown: MissingDimension;
  volumeCubicFeet: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  lengthUnit: LengthUnit;
  widthUnit: LengthUnit;
  heightUnit: LengthUnit;
  resultUnit: LengthUnit;
}

export interface OtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

export interface CubicFeetResult {
  length: number;
  width: number;
  height: number;
  lengthUnit: LengthUnit;
  widthUnit: LengthUnit;
  heightUnit: LengthUnit;
  lengthMeters: number;
  widthMeters: number;
  heightMeters: number;
  cubicMeters: number;
  cubicFeet: number;
  otherUnits: readonly OtherUnitRow[];
}

export interface MissingDimensionResult {
  unknown: MissingDimension;
  value: number;
  unit: LengthUnit;
  valueMeters: number;
  volumeCubicFeet: number;
}

export type CubicFeetFieldErrors = {
  length?: string;
  width?: string;
  height?: string;
};

export type MissingDimensionFieldErrors = {
  volumeCubicFeet?: string;
  length?: string;
  width?: string;
  height?: string;
};

/** Exact SI length definitions. */
export const METERS_PER_LENGTH_UNIT: Record<LengthUnit, number> = {
  mm: 0.001,
  cm: 0.01,
  dm: 0.1,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
};

/** Exact: (0.3048 m)³. */
export const CUBIC_METERS_PER_CUBIC_FOOT = 0.028316846592;
export const CUBIC_INCHES_PER_CUBIC_FOOT = 1728;
export const CUBIC_FEET_PER_CUBIC_YARD = 27;
export const CUBIC_CENTIMETERS_PER_CUBIC_METER = 1_000_000;
export const LITERS_PER_CUBIC_METER = 1000;
export const MILLILITERS_PER_LITER = 1000;
/** Exact US liquid gallon in cubic meters. */
export const CUBIC_METERS_PER_US_GALLON = 0.003785411784;
/** Exact Imperial gallon in liters. */
export const LITERS_PER_IMP_GALLON = 4.54609;

export const LENGTH_UNIT_OPTIONS: readonly { value: LengthUnit; label: string }[] = [
  { value: 'mm', label: 'mm' },
  { value: 'cm', label: 'cm' },
  { value: 'dm', label: 'dm' },
  { value: 'm', label: 'm' },
  { value: 'km', label: 'km' },
  { value: 'in', label: 'in' },
  { value: 'ft', label: 'ft' },
  { value: 'yd', label: 'yd' },
  { value: 'mi', label: 'mi' },
] as const;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 10 ft × 5 ft × 3 ft = 150 ft³. */
export const DEFAULT_CUBIC_FEET_INPUT: CubicFeetInput = {
  length: 10,
  width: 5,
  height: 3,
  lengthUnit: 'ft',
  widthUnit: 'ft',
  heightUnit: 'ft',
};

export const EMPTY_CUBIC_FEET_INPUT: CubicFeetInput = {
  length: null,
  width: null,
  height: null,
  lengthUnit: 'ft',
  widthUnit: 'ft',
  heightUnit: 'ft',
};

export const EMPTY_MISSING_DIMENSION_INPUT: MissingDimensionInput = {
  unknown: 'length',
  volumeCubicFeet: null,
  length: null,
  width: null,
  height: null,
  lengthUnit: 'ft',
  widthUnit: 'ft',
  heightUnit: 'ft',
  resultUnit: 'ft',
};
