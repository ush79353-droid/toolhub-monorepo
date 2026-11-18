/**
 * Conventional conversion: 760 mmHg = 1 atm (same 760 factor as Torr).
 * CIPM conventional mmHg (133.322387415 Pa) is not identical to Torr.
 * Catalog name says "mm to ATM"; the physical unit is mmHg (pressure), not mm length.
 */
export const MMHG_PER_ATM = 760;

export type MmAtmSource = 'mmHg' | 'atm';

export interface MmToAtmInput {
  source: MmAtmSource;
  mmHg: number | null;
  atm: number | null;
}

export type MmToAtmFieldErrors = {
  mmHg?: string;
  atm?: string;
};

export interface MmToAtmResult {
  source: MmAtmSource;
  mmHg: number;
  atm: number;
  explanation: string;
}

export const MAX_ABS_VALUE = 1e18;
