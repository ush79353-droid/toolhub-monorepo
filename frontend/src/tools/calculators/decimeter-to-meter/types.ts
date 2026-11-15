/** Which field the user last edited. The other field is derived. */
export type DecimeterMeterSource = 'decimeters' | 'meters';

export interface DecimeterToMeterInput {
  source: DecimeterMeterSource;
  /** null while the active source field is blank or incomplete. */
  decimeters: number | null;
  meters: number | null;
}

export interface OtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

export interface DecimeterToMeterResult {
  source: DecimeterMeterSource;
  decimeters: number;
  meters: number;
  otherUnits: readonly OtherUnitRow[];
}

export type DecimeterToMeterFieldErrors = {
  decimeters?: string;
  meters?: string;
};

/** Exact: 1 m = 10 dm. */
export const DECIMETERS_PER_METER = 10;
export const METERS_PER_DECIMETER = 0.1;

/** Exact SI and international customary factors via meters. */
export const METERS_PER_MM = 0.001;
export const METERS_PER_CM = 0.01;
export const METERS_PER_KM = 1000;
export const METERS_PER_INCH = 0.0254;
export const METERS_PER_FOOT = 0.3048;
export const METERS_PER_YARD = 0.9144;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 34.6 dm = 3.46 m. */
export const DEFAULT_DECIMETER_TO_METER_INPUT: DecimeterToMeterInput = {
  source: 'decimeters',
  decimeters: 34.6,
  meters: null,
};

/** Reset target: clear both fields. */
export const EMPTY_DECIMETER_TO_METER_INPUT: DecimeterToMeterInput = {
  source: 'decimeters',
  decimeters: null,
  meters: null,
};
