/** Which field the user last edited. The other field is derived. */
export type LbsStoneSource = 'pounds' | 'stones';

export interface LbsToStoneInput {
  source: LbsStoneSource;
  /** null while the active source field is blank or incomplete. */
  pounds: number | null;
  stones: number | null;
}

export interface LbsToStoneResult {
  source: LbsStoneSource;
  pounds: number;
  stones: number;
  /** Whole stones from floor(pounds / 14). */
  wholeStones: number;
  /** Remaining pounds after whole stones (0 ≤ rem < 14). */
  remainingPounds: number;
  explanation: string;
}

export type LbsToStoneFieldErrors = {
  pounds?: string;
  stones?: string;
};

/** Exact avoirdupois stone in pounds. */
export const POUNDS_PER_STONE = 14;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 140 lb = 10 st. */
export const DEFAULT_LBS_TO_STONE_INPUT: LbsToStoneInput = {
  source: 'pounds',
  pounds: 140,
  stones: null,
};
