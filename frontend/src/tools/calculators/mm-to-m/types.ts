import type { LengthUnit } from '../meter-converter/types';

/** Exact: 1 m = 1000 mm. */
export const MM_PER_METER = 1000;

export const MAX_ABS_VALUE = 1e18;

export type MmMSource = 'mm' | 'm';

export interface MmToMInput {
  source: MmMSource;
  mm: number | null;
  m: number | null;
}

export type MmToMFieldErrors = {
  mm?: string;
  m?: string;
};

export interface OtherUnitRow {
  id: LengthUnit;
  label: string;
  symbol: string;
  value: number;
}

export interface MmToMResult {
  source: MmMSource;
  mm: number;
  m: number;
  otherUnits: readonly OtherUnitRow[];
  explanation: string;
}

/** Collapsed accordion — exclude primary mm/m. */
export const ADDITIONAL_UNIT_IDS: readonly LengthUnit[] = ['cm', 'km', 'in', 'ft', 'yd', 'mi'];
