/** Which field the user last edited. The other field is derived. */
export type Km2AcresSource = 'squareKilometers' | 'acres';

export interface SquareKilometersToAcresInput {
  source: Km2AcresSource;
  /** null while the active source field is blank or incomplete. */
  squareKilometers: number | null;
  acres: number | null;
}

export interface OtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

export interface SquareKilometersToAcresResult {
  source: Km2AcresSource;
  squareKilometers: number;
  acres: number;
  squareMeters: number;
  otherUnits: readonly OtherUnitRow[];
}

export type SquareKilometersToAcresFieldErrors = {
  squareKilometers?: string;
  acres?: string;
};

/** Exact SI square kilometer. */
export const SQUARE_METERS_PER_KM2 = 1_000_000;
/** Exact international acre. */
export const SQUARE_METERS_PER_ACRE = 4046.8564224;
/** Exact: 1 km² in acres = 1_000_000 / 4_046.8564224. */
export const ACRES_PER_KM2 = SQUARE_METERS_PER_KM2 / SQUARE_METERS_PER_ACRE;
/** Exact: 1 acre in km². */
export const KM2_PER_ACRE = SQUARE_METERS_PER_ACRE / SQUARE_METERS_PER_KM2;

export const SQUARE_METERS_PER_HECTARE = 10_000;
export const SQUARE_METERS_PER_ARE = 100;
export const SQUARE_METERS_PER_FT2 = 0.09290304;
export const SQUARE_METERS_PER_YD2 = 0.83612736;
export const SQUARE_METERS_PER_MI2 = 2_589_988.110336;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 5 km² ≈ 1,235.52690734 acres. */
export const DEFAULT_SQUARE_KILOMETERS_TO_ACRES_INPUT: SquareKilometersToAcresInput = {
  source: 'squareKilometers',
  squareKilometers: 5,
  acres: null,
};

/** Reset target: clear both fields. */
export const EMPTY_SQUARE_KILOMETERS_TO_ACRES_INPUT: SquareKilometersToAcresInput = {
  source: 'squareKilometers',
  squareKilometers: null,
  acres: null,
};
