/** Which field the user last edited. The other field mirrors the same mass. */
export type LbsPoundsSource = 'lbs' | 'pounds';

export interface LbsToPoundsInput {
  source: LbsPoundsSource;
  lbs: number | null;
  pounds: number | null;
}

export interface LbsToPoundsResult {
  source: LbsPoundsSource;
  lbs: number;
  pounds: number;
  explanation: string;
}

export type LbsToPoundsFieldErrors = {
  lbs?: string;
  pounds?: string;
};

/** Identity: lb / lbs and pound(s) name the same avoirdupois mass unit. */
export const LBS_TO_POUNDS_FACTOR = 1;

export const MAX_ABS_VALUE = 1e15;
