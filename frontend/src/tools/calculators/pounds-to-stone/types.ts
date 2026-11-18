/** Which field the user last edited. The other field is derived. */
export type LbStSource = 'pounds' | 'stone';

export interface PoundsToStoneInput {
  source: LbStSource;
  pounds: number | null;
  stone: number | null;
}

export interface PoundsToStoneResult {
  source: LbStSource;
  pounds: number;
  stone: number;
  /** Whole stones from floor(pounds / 14). */
  wholeStones: number;
  /** Remaining pounds after whole stones (0 ≤ rem < 14). */
  remainingPounds: number;
  explanation: string;
}

export type PoundsToStoneFieldErrors = {
  pounds?: string;
  stone?: string;
};

/** Exact: 1 imperial stone = 14 avoirdupois pounds. */
export const POUNDS_PER_STONE = 14;

/** Rounded SI equivalent for education: 1 st ≈ 6.35029318 kg. */
export const KG_PER_STONE = 6.35029318;

export const MAX_ABS_VALUE = 1e15;

/** Demo default matching reference: 14 lb = 1 st. */
export const DEFAULT_POUNDS_TO_STONE_INPUT: PoundsToStoneInput = {
  source: 'pounds',
  pounds: 14,
  stone: null,
};
