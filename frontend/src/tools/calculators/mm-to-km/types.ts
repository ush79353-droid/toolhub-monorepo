import type { LengthUnit } from '../meter-converter/types';

/** Exact: 1 km = 1,000,000 mm. */
export const MM_PER_KILOMETER = 1_000_000;

export const MAX_ABS_VALUE = 1e18;

export type MmKmSource = 'mm' | 'km';

export interface MmToKmInput {
  source: MmKmSource;
  mm: number | null;
  km: number | null;
}

export type MmToKmFieldErrors = {
  mm?: string;
  km?: string;
};

export interface OtherUnitRow {
  id: LengthUnit;
  label: string;
  symbol: string;
  value: number;
}

export interface MmToKmResult {
  source: MmKmSource;
  mm: number;
  km: number;
  otherUnits: readonly OtherUnitRow[];
  explanation: string;
}

/** Collapsed accordion — exclude primary mm/km. */
export const ADDITIONAL_UNIT_IDS: readonly LengthUnit[] = ['m', 'cm', 'in', 'ft', 'yd', 'mi'];
