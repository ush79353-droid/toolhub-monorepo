/** Which field the user last edited. Others derive from ounces. */
export type OzLbSource = 'oz' | 'lb' | 'kg';

export interface OuncesToPoundsInput {
  source: OzLbSource;
  oz: number | null;
  lb: number | null;
  kg: number | null;
}

export type OuncesToPoundsFieldErrors = {
  oz?: string;
  lb?: string;
  kg?: string;
};

/** Exact: 1 lb = 16 avoirdupois oz. */
export const OUNCES_PER_POUND = 16;

/** Exact: 1 international avoirdupois pound = 0.45359237 kg. */
export const KG_PER_POUND = 0.45359237;

/** Exact: 1 oz = lb/16 = 0.028349523125 kg. */
export const KG_PER_OUNCE = KG_PER_POUND / OUNCES_PER_POUND;

export const MAX_ABS_VALUE = 1e15;

/** Demo default matching reference: 16 oz = 1 lb = 0.45359237 kg. */
export const DEFAULT_OUNCES_TO_POUNDS_INPUT: OuncesToPoundsInput = {
  source: 'oz',
  oz: 16,
  lb: null,
  kg: null,
};
