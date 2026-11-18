/** Which field the user last edited. Both fields are gauge pressure. */
export type MpaPsigSource = 'MPa' | 'psig';

export interface MpaToPsigInput {
  source: MpaPsigSource;
  MPa: number | null;
  psig: number | null;
}

export type MpaToPsigFieldErrors = {
  MPa?: string;
  psig?: string;
};

export const MAX_ABS_VALUE = 1e18;
