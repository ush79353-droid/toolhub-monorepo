import type { OtherUnitRow, PressureUnitId } from '../pressure-conversion/types';

export type { OtherUnitRow, PressureUnitId };

/**
 * Conventional conversion used here (and by kPa↔mmHg): 760 mmHg = 1 atm.
 * Torr is defined as 1/760 atm; CIPM conventional mmHg (133.322387415 Pa) is not identical.
 */
export const MMHG_PER_ATM = 760;

export type MmhgAtmSource = 'mmHg' | 'atm';

export interface MmhgToAtmInput {
  source: MmhgAtmSource;
  mmHg: number | null;
  atm: number | null;
}

export type MmhgToAtmFieldErrors = {
  mmHg?: string;
  atm?: string;
};

export interface MmhgToAtmResult {
  source: MmhgAtmSource;
  mmHg: number;
  atm: number;
  pascals: number;
  otherUnits: readonly OtherUnitRow[];
  explanation: string;
}

/** Collapsed accordion — exclude primary atm; show CIPM mmHg separately from Torr. */
export const ADDITIONAL_UNIT_IDS: readonly PressureUnitId[] = [
  'Pa',
  'kPa',
  'MPa',
  'bar',
  'mbar',
  'psi',
  'Torr',
  'mmHg',
  'inHg',
];

export const MAX_ABS_VALUE = 1e18;
