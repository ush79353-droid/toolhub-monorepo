/** Which field the user last edited. Others derive from ounces. */
export type OzKgSource = 'oz' | 'kg' | 'lb';

export interface OunceToKgInput {
  source: OzKgSource;
  oz: number | null;
  kg: number | null;
  lb: number | null;
}

export type OunceToKgFieldErrors = {
  oz?: string;
  kg?: string;
  lb?: string;
};

/** Exact: 1 lb = 16 avoirdupois oz. */
export const OUNCES_PER_POUND = 16;

/** Exact: 1 international avoirdupois pound = 0.45359237 kg. */
export const KG_PER_POUND = 0.45359237;

/** Exact: 1 oz = lb/16 = 0.028349523125 kg. */
export const KG_PER_OUNCE = KG_PER_POUND / OUNCES_PER_POUND;

export const MAX_ABS_VALUE = 1e15;

/** Demo default matching reference: 16 oz = 0.45359237 kg = 1 lb. */
export const DEFAULT_OUNCE_TO_KG_INPUT: OunceToKgInput = {
  source: 'oz',
  oz: 16,
  kg: null,
  lb: null,
};
