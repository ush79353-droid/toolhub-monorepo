/** Which field the user last edited. */
export type NmMSource = 'nm' | 'm';

export interface NmToMInput {
  source: NmMSource;
  nm: number | null;
  m: number | null;
}

export type NmToMFieldErrors = {
  nm?: string;
  m?: string;
};

/** Exact SI: 1 m = 1,000,000,000 nm (1 nm = 10⁻⁹ m). */
export const NANOMETERS_PER_METER = 1_000_000_000;

export const MAX_ABS_VALUE = 1e18;

/** Demo default matching reference: 100 nm = 1 × 10⁻⁷ m. */
export const DEFAULT_NM_TO_M_INPUT: NmToMInput = {
  source: 'nm',
  nm: 100,
  m: null,
};
