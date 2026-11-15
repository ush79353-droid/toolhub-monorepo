/** Which field the user last edited. The other field is derived. */
export type GOSource = 'g' | 'oz';

export interface GramsToOuncesInput {
  source: GOSource;
  /** null while the active source field is blank or incomplete. */
  g: number | null;
  oz: number | null;
}

export interface OtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

export interface GramsToOuncesResult {
  source: GOSource;
  g: number;
  oz: number;
  otherUnits: readonly OtherUnitRow[];
}

export type GramsToOuncesFieldErrors = {
  g?: string;
  oz?: string;
};

/** Exact: 1 international avoirdupois ounce = 28.349523125 g. */
export const GRAMS_PER_AVOIRDUPOIS_OUNCE = 28.349523125;
/** Exact: 1 lb = 16 avoirdupois ounces = 453.59237 g. */
export const GRAMS_PER_POUND = GRAMS_PER_AVOIRDUPOIS_OUNCE * 16;
/** Exact: 1 troy ounce = 31.1034768 g (educational only; not the calculator default). */
export const GRAMS_PER_TROY_OUNCE = 31.1034768;
/** Exact: 1 kg = 1000 g. */
export const GRAMS_PER_KILOGRAM = 1000;
/** Exact: 1 dag = 10 g. */
export const GRAMS_PER_DECAGRAM = 10;
/** Exact: 1 g = 1000 mg. */
export const MILLIGRAMS_PER_GRAM = 1000;
/** Exact: 1 US short ton = 2000 lb. */
export const GRAMS_PER_SHORT_TON = GRAMS_PER_POUND * 2000;
/** Exact: 1 metric tonne = 1_000_000 g. */
export const GRAMS_PER_TONNE = 1_000_000;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 100 g ≈ 3.527396195 oz. */
export const DEFAULT_GRAMS_TO_OUNCES_INPUT: GramsToOuncesInput = {
  source: 'g',
  g: 100,
  oz: null,
};

export const EMPTY_GRAMS_TO_OUNCES_INPUT: GramsToOuncesInput = {
  source: 'g',
  g: null,
  oz: null,
};
