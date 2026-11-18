/** Which field the user last edited. */
export type MpaPsiSource = 'MPa' | 'psi';

export interface MpaToPsiInput {
  source: MpaPsiSource;
  MPa: number | null;
  psi: number | null;
}

export type MpaToPsiFieldErrors = {
  MPa?: string;
  psi?: string;
};

export const MAX_ABS_VALUE = 1e18;
