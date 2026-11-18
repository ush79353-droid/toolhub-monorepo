/** Which field the user last edited. */
export type OzGSource = 'oz' | 'g';

export interface OuncesToGramsInput {
  source: OzGSource;
  oz: number | null;
  g: number | null;
}

export type OuncesToGramsFieldErrors = {
  oz?: string;
  g?: string;
};

/** Exact: 1 international avoirdupois ounce = 28.349523125 g. */
export const GRAMS_PER_OUNCE = 28.349523125;

/** Exact: 1 troy ounce (educational note only — not used by this converter). */
export const GRAMS_PER_TROY_OUNCE = 31.1034768;

export const MAX_ABS_VALUE = 1e15;

/** Demo default matching reference: 1 oz = 28.349523125 g. */
export const DEFAULT_OUNCES_TO_GRAMS_INPUT: OuncesToGramsInput = {
  source: 'oz',
  oz: 1,
  g: null,
};
