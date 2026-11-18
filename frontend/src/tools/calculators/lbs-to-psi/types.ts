/** Which field the user last edited. The other field is derived. */
export type LbsPsiSource = 'psf' | 'psi';

export interface LbsToPsiInput {
  source: LbsPsiSource;
  /** null while the active source field is blank or incomplete. */
  psf: number | null;
  psi: number | null;
}

export interface LbsToPsiResult {
  source: LbsPsiSource;
  psf: number;
  psi: number;
  explanation: string;
}

export type LbsToPsiFieldErrors = {
  psf?: string;
  psi?: string;
};

/** Exact: 1 ft² = 144 in² → 1 psi = 144 psf. */
export const SQUARE_INCHES_PER_SQUARE_FOOT = 144;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 144 psf = 1 psi. */
export const DEFAULT_LBS_TO_PSI_INPUT: LbsToPsiInput = {
  source: 'psf',
  psf: 144,
  psi: null,
};
