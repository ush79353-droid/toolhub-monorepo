/** Which field the user last edited. */
export type PaPsiSource = 'Pa' | 'psi';

export interface PaToPsiInput {
  source: PaPsiSource;
  Pa: number | null;
  psi: number | null;
}

export type PaToPsiFieldErrors = {
  Pa?: string;
  psi?: string;
};

export const MAX_ABS_VALUE = 1e18;
