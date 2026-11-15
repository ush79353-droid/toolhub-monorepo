/** Which field the user last edited. The other field is derived. */
export type YardsAcresSource = 'squareYards' | 'acres';

export interface YardsToAcresInput {
  source: YardsAcresSource;
  /** null while the active source field is blank or incomplete. */
  squareYards: number | null;
  acres: number | null;
}

export interface OtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

export interface YardsToAcresResult {
  source: YardsAcresSource;
  squareYards: number;
  acres: number;
  squareMeters: number;
  otherUnits: readonly OtherUnitRow[];
}

export type YardsToAcresFieldErrors = {
  squareYards?: string;
  acres?: string;
};

/** Exact international acre in square yards. */
export const SQUARE_YARDS_PER_ACRE = 4840;
/** Exact: 1 yd² in acres. */
export const ACRES_PER_SQUARE_YARD = 1 / SQUARE_YARDS_PER_ACRE;

export const SQUARE_METERS_PER_YD2 = 0.83612736;
export const SQUARE_METERS_PER_ACRE = 4046.8564224;
export const SQUARE_FEET_PER_YD2 = 9;
export const SQUARE_FEET_PER_ACRE = 43_560;
export const SQUARE_METERS_PER_HECTARE = 10_000;
export const SQUARE_METERS_PER_ARE = 100;
export const SQUARE_METERS_PER_KM2 = 1_000_000;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 9680 yd² = 2 acres. */
export const DEFAULT_YARDS_TO_ACRES_INPUT: YardsToAcresInput = {
  source: 'squareYards',
  squareYards: 9680,
  acres: null,
};

/** Reset target: clear both fields. */
export const EMPTY_YARDS_TO_ACRES_INPUT: YardsToAcresInput = {
  source: 'squareYards',
  squareYards: null,
  acres: null,
};
