import {
  PASCALS_PER_ATM,
  PASCALS_PER_TORR,
  type OtherUnitRow,
  type PressureUnitId,
} from '../pressure-conversion/types';

export { PASCALS_PER_ATM, PASCALS_PER_TORR };
export type { OtherUnitRow, PressureUnitId };

/** Exact: 1 atm = 760 Torr. */
export const TORR_PER_ATMOSPHERE = 760;

export type PressureSource = 'Torr' | 'atm';

export interface TorrToAtmInput {
  source: PressureSource;
  torr: number | null;
  atm: number | null;
}

export interface TorrToAtmResult {
  source: PressureSource;
  torr: number;
  atm: number;
  pascals: number;
  otherUnits: readonly OtherUnitRow[];
}

export type TorrToAtmFieldErrors = {
  torr?: string;
  atm?: string;
};

/** Additional units for the collapsed accordion (exclude Torr / atm). */
export const ADDITIONAL_UNIT_IDS: readonly PressureUnitId[] = [
  'Pa',
  'kPa',
  'MPa',
  'bar',
  'mbar',
  'psi',
  'mmHg',
  'inHg',
];

export const MAX_ABS_VALUE = 1e30;

/** Demo: 760 Torr = 1 atm. */
export const DEFAULT_TORR_TO_ATM_INPUT: TorrToAtmInput = {
  source: 'Torr',
  torr: 760,
  atm: null,
};

export const EMPTY_TORR_TO_ATM_INPUT: TorrToAtmInput = {
  source: 'Torr',
  torr: null,
  atm: null,
};
