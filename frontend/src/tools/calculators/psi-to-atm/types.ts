/** Which field the user last edited. */
export type PsiAtmSource = 'psi' | 'atm';

export interface PsiToAtmInput {
  source: PsiAtmSource;
  psi: number | null;
  atm: number | null;
}

export type PsiToAtmFieldErrors = {
  psi?: string;
  atm?: string;
};

export const MAX_ABS_VALUE = 1e18;
