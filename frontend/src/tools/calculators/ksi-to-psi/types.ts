/** Which field the user last edited. */
export type KsiPsiSource = 'ksi' | 'psi';

export interface KsiToPsiInput {
  source: KsiPsiSource;
  ksi: number | null;
  psi: number | null;
}

export type KsiToPsiFieldErrors = {
  ksi?: string;
  psi?: string;
};

/** Exact: 1 ksi = 1,000 psi. */
export const PSI_PER_KSI = 1000;

export const MAX_ABS_VALUE = 1e18;
