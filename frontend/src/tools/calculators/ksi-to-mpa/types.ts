/** Which field the user last edited. */
export type KsiMpaSource = 'ksi' | 'MPa';

export interface KsiToMpaInput {
  source: KsiMpaSource;
  ksi: number | null;
  mpa: number | null;
}

export type KsiToMpaFieldErrors = {
  ksi?: string;
  mpa?: string;
};

export const MAX_ABS_VALUE = 1e18;
