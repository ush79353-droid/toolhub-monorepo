/** Which field the user last edited. The other field is derived. */
export type FeetInchesSource = 'feet' | 'inches';

export interface FeetToInchesInput {
  source: FeetInchesSource;
  /** null while the active source field is blank. */
  feet: number | null;
  inches: number | null;
}

export interface OtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

export interface FeetToInchesResult {
  source: FeetInchesSource;
  feet: number;
  inches: number;
  otherUnits: readonly OtherUnitRow[];
}

export type FeetToInchesFieldErrors = {
  feet?: string;
  inches?: string;
};

/** Exact international foot. */
export const INCHES_PER_FOOT = 12;
export const METERS_PER_FOOT = 0.3048;
export const FEET_PER_YARD = 3;
export const FEET_PER_MILE = 5280;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 1 ft = 12 in. */
export const DEFAULT_FEET_TO_INCHES_INPUT: FeetToInchesInput = {
  source: 'feet',
  feet: 1,
  inches: 12,
};
