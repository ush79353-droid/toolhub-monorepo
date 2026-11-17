/** Which field the user last edited. */
export type KpaPsiSource = 'kPa' | 'psi';

export interface KpaToPsiInput {
  source: KpaPsiSource;
  kPa: number | null;
  psi: number | null;
}

export type KpaToPsiFieldErrors = {
  kPa?: string;
  psi?: string;
};

export const MAX_ABS_VALUE = 1e18;
