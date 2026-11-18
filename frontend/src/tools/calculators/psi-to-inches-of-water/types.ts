/** Which field the user last edited. */
export type PsiInH2OSource = 'psi' | 'inH2O';

export interface PsiToInchesOfWaterInput {
  source: PsiInH2OSource;
  psi: number | null;
  inH2O: number | null;
}

export type PsiToInchesOfWaterFieldErrors = {
  psi?: string;
  inH2O?: string;
};

export const MAX_ABS_VALUE = 1e18;
