/** Which field the user last edited. */
export type KgCmPsiSource = 'kgfCm2' | 'psi';

export interface KgCmToPsiInput {
  source: KgCmPsiSource;
  kgfCm2: number | null;
  psi: number | null;
}

export type KgCmToPsiFieldErrors = {
  kgfCm2?: string;
  psi?: string;
};

/** Exact: 1 kgf/cm² = 98,066.5 Pa (technical atmosphere / kgf·cm⁻²). */
export const PASCALS_PER_KGFCM2 = 98_066.5;

/** Conventional: 1 psi = 6,894.757293168 Pa (task-locked factor). */
export const PASCALS_PER_PSI = 6_894.757293168;

/** Exact via Pa: psi per kgf/cm². */
export const KGFCM2_TO_PSI = PASCALS_PER_KGFCM2 / PASCALS_PER_PSI;

export const MAX_ABS_VALUE = 1e18;
