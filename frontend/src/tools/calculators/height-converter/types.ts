/** Which field group the user last edited. All other values are derived from meters. */
export type HeightSource =
  | 'centimeters'
  | 'meters'
  | 'metersCm'
  | 'inches'
  | 'feet'
  | 'feetInches'
  | 'other';

export type OtherHeightUnit = 'mm' | 'km' | 'yd' | 'mi';

export interface HeightInput {
  source: HeightSource;
  centimeters: number | null;
  meters: number | null;
  metersPart: number | null;
  centimetersPart: number | null;
  inches: number | null;
  feet: number | null;
  feetPart: number | null;
  inchesPart: number | null;
  otherUnit: OtherHeightUnit;
  otherValue: number | null;
}

export interface HeightResult {
  source: HeightSource;
  meters: number;
  centimeters: number;
  metersPart: number;
  centimetersPart: number;
  inches: number;
  feet: number;
  feetPart: number;
  inchesPart: number;
  otherUnit: OtherHeightUnit;
  otherValue: number;
  mixedMetricLabel: string;
  mixedImperialLabel: string;
  explanation: string;
}

export type HeightFieldErrors = {
  centimeters?: string;
  meters?: string;
  metersPart?: string;
  centimetersPart?: string;
  inches?: string;
  feet?: string;
  feetPart?: string;
  inchesPart?: string;
  otherValue?: string;
};

/** Exact international definitions. */
export const METERS_PER_INCH = 0.0254;
export const CENTIMETERS_PER_INCH = 2.54;
export const INCHES_PER_FOOT = 12;
export const METERS_PER_FOOT = 0.3048;
export const CENTIMETERS_PER_FOOT = 30.48;
export const CENTIMETERS_PER_METER = 100;
export const MILLIMETERS_PER_METER = 1000;
export const METERS_PER_KILOMETER = 1000;
export const METERS_PER_YARD = 0.9144;
export const METERS_PER_MILE = 1609.344;

export const OTHER_UNIT_LABELS: Record<OtherHeightUnit, string> = {
  mm: 'Millimeters',
  km: 'Kilometers',
  yd: 'Yards',
  mi: 'Miles',
};

export const OTHER_UNIT_SYMBOLS: Record<OtherHeightUnit, string> = {
  mm: 'mm',
  km: 'km',
  yd: 'yd',
  mi: 'mi',
};

/** Meters per one unit of the selectable “other” field. */
export const METERS_PER_OTHER: Record<OtherHeightUnit, number> = {
  mm: 1 / MILLIMETERS_PER_METER,
  km: METERS_PER_KILOMETER,
  yd: METERS_PER_YARD,
  mi: METERS_PER_MILE,
};

export const MAX_ABS_VALUE = 1e15;
