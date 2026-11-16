import type { LengthUnit } from '../centimeter/units';

/** Primary and expandable units that can drive the conversion. */
export type CmToKmSource = 'cm' | 'km' | ExtraLengthUnit;

/** Extra units shown in the collapsed accordion (not primary cm/km). */
export type ExtraLengthUnit = 'mm' | 'dm' | 'm' | 'in' | 'ft' | 'yd' | 'mi';

export const EXTRA_LENGTH_UNITS = [
  'mm',
  'dm',
  'm',
  'in',
  'ft',
  'yd',
  'mi',
] as const satisfies readonly ExtraLengthUnit[];

export interface CmToKmInput {
  source: CmToKmSource;
  /** null while the active source field is blank or incomplete. */
  value: number | null;
}

export interface CmToKmResult {
  source: CmToKmSource;
  centimeters: number;
  kilometers: number;
  values: Record<LengthUnit, number>;
  explanation: string;
}

export type CmToKmFieldErrors = Partial<Record<CmToKmSource, string>>;

/** Exact: 1 km = 100,000 cm. */
export const CM_PER_KM = 100_000;

export const MAX_ABS_VALUE = 1e15;
