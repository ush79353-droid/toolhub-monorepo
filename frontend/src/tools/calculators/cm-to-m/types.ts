import type { LengthUnit } from '../centimeter/units';

/** Units available in the Other units selector (not primary cm/m). */
export type OtherLengthUnit = 'in' | 'ft' | 'yd' | 'mm' | 'km' | 'dm' | 'mi';

export const OTHER_LENGTH_UNITS = [
  'in',
  'ft',
  'yd',
  'mm',
  'km',
  'dm',
  'mi',
] as const satisfies readonly OtherLengthUnit[];

export const DEFAULT_OTHER_UNIT: OtherLengthUnit = 'in';

export type CmToMSource = 'cm' | 'm' | 'other';

export interface CmToMInput {
  source: CmToMSource;
  /** null while the active source field is blank or incomplete. */
  value: number | null;
  otherUnit: OtherLengthUnit;
}

export interface CmToMResult {
  source: CmToMSource;
  centimeters: number;
  meters: number;
  other: number;
  otherUnit: OtherLengthUnit;
  explanation: string;
}

export type CmToMFieldErrors = {
  cm?: string;
  m?: string;
  other?: string;
};

/** Exact: 1 m = 100 cm. */
export const CM_PER_METER = 100;

export const MAX_ABS_VALUE = 1e15;

export type { LengthUnit };
