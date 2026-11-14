/** Length units for each rectangular dimension. */
export type LengthUnit = 'mm' | 'cm' | 'dm' | 'm' | 'dam' | 'km' | 'in' | 'ft' | 'yd';

/** Volume units for the direct conversion workflow. */
export type VolumeUnit =
  | 'mm3'
  | 'cm3'
  | 'dm3'
  | 'm3'
  | 'km3'
  | 'in3'
  | 'ft3'
  | 'yd3'
  | 'mL'
  | 'cL'
  | 'dL'
  | 'L'
  | 'usGal'
  | 'impGal';

export type CalcSource = 'dimensions' | 'volume';
export type MissingDimension = 'length' | 'width' | 'height';

export interface CubicMeterInput {
  source: CalcSource;
  length: number | null;
  width: number | null;
  height: number | null;
  lengthUnit: LengthUnit;
  widthUnit: LengthUnit;
  heightUnit: LengthUnit;
  /** Active when source === 'volume'. */
  volume: number | null;
  volumeUnit: VolumeUnit;
}

export interface MissingDimensionInput {
  unknown: MissingDimension;
  volumeCubicMeters: number | null;
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

export interface CubicMeterResult {
  source: CalcSource;
  length: number | null;
  width: number | null;
  height: number | null;
  lengthUnit: LengthUnit;
  widthUnit: LengthUnit;
  heightUnit: LengthUnit;
  cubicMeters: number;
  cubicFeet: number;
  volumeUnit: VolumeUnit;
  volumeInSelectedUnit: number;
  otherUnits: readonly OtherUnitRow[];
}

export interface MissingDimensionResult {
  unknown: MissingDimension;
  value: number;
  unit: LengthUnit;
  valueMeters: number;
  volumeCubicMeters: number;
}

export type CubicMeterFieldErrors = {
  length?: string;
  width?: string;
  height?: string;
  volume?: string;
};

export type MissingDimensionFieldErrors = {
  volumeCubicMeters?: string;
  length?: string;
  width?: string;
  height?: string;
};

/** Exact SI / international length definitions. */
export const METERS_PER_LENGTH_UNIT: Record<LengthUnit, number> = {
  mm: 0.001,
  cm: 0.01,
  dm: 0.1,
  m: 1,
  dam: 10,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
};

/** Exact cubic meters per volume unit. */
export const CUBIC_METERS_PER_VOLUME_UNIT: Record<VolumeUnit, number> = {
  mm3: 1e-9,
  cm3: 1e-6,
  dm3: 0.001,
  m3: 1,
  km3: 1e9,
  in3: 0.000016387064,
  ft3: 0.028316846592,
  yd3: 0.764554857984,
  mL: 0.000001,
  cL: 0.00001,
  dL: 0.0001,
  L: 0.001,
  usGal: 0.003785411784,
  impGal: 0.00454609,
};

export const CUBIC_METERS_PER_CUBIC_FOOT = CUBIC_METERS_PER_VOLUME_UNIT.ft3;
export const CUBIC_METERS_PER_CUBIC_INCH = CUBIC_METERS_PER_VOLUME_UNIT.in3;
export const CUBIC_METERS_PER_CUBIC_YARD = CUBIC_METERS_PER_VOLUME_UNIT.yd3;
export const LITERS_PER_CUBIC_METER = 1000;

export const LENGTH_UNIT_OPTIONS: readonly { value: LengthUnit; label: string }[] = [
  { value: 'mm', label: 'mm' },
  { value: 'cm', label: 'cm' },
  { value: 'dm', label: 'dm' },
  { value: 'm', label: 'm' },
  { value: 'dam', label: 'dam' },
  { value: 'km', label: 'km' },
  { value: 'in', label: 'in' },
  { value: 'ft', label: 'ft' },
  { value: 'yd', label: 'yd' },
] as const;

export const VOLUME_UNIT_OPTIONS: readonly { value: VolumeUnit; label: string }[] = [
  { value: 'mm3', label: 'mm³' },
  { value: 'cm3', label: 'cm³' },
  { value: 'dm3', label: 'dm³' },
  { value: 'm3', label: 'm³' },
  { value: 'km3', label: 'km³' },
  { value: 'in3', label: 'in³' },
  { value: 'ft3', label: 'ft³' },
  { value: 'yd3', label: 'yd³' },
  { value: 'mL', label: 'mL' },
  { value: 'cL', label: 'cL' },
  { value: 'dL', label: 'dL' },
  { value: 'L', label: 'L' },
  { value: 'usGal', label: 'US gal' },
  { value: 'impGal', label: 'imp gal' },
] as const;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 5 m × 4 m × 3 m = 60 m³. */
export const DEFAULT_CUBIC_METER_INPUT: CubicMeterInput = {
  source: 'dimensions',
  length: 5,
  width: 4,
  height: 3,
  lengthUnit: 'm',
  widthUnit: 'm',
  heightUnit: 'm',
  volume: null,
  volumeUnit: 'ft3',
};

export const EMPTY_CUBIC_METER_INPUT: CubicMeterInput = {
  source: 'dimensions',
  length: null,
  width: null,
  height: null,
  lengthUnit: 'm',
  widthUnit: 'm',
  heightUnit: 'm',
  volume: null,
  volumeUnit: 'ft3',
};
