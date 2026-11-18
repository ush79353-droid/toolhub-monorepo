/** Which field the user last edited. The other field is derived. */
export type GalCupsSource = 'gallons' | 'cups';

export interface GalToCupsInput {
  source: GalCupsSource;
  /** null while the active source field is blank or incomplete. */
  gallons: number | null;
  cups: number | null;
}

export interface GalToCupsResult {
  source: GalCupsSource;
  gallons: number;
  cups: number;
  explanation: string;
}

export type GalToCupsFieldErrors = {
  gallons?: string;
  cups?: string;
};

/**
 * Exact: 1 US liquid gallon = 16 US customary cups.
 * (1 US gal = 3.785411784 L; 1 US cup = 236.5882365 mL.)
 */
export const CUPS_PER_US_GALLON = 16;

export const MAX_ABS_VALUE = 1e15;
