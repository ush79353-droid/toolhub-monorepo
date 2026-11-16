export type DimesDollarsField = 'dimes' | 'dollars';

export type DimesToDollarsFieldErrors = Partial<Record<DimesDollarsField, string>>;

/** Face value of one U.S. dime in cents. */
export const CENTS_PER_DIME = 10;
/** Dimes that equal one U.S. dollar. */
export const DIMES_PER_DOLLAR = 10;
export const MAX_INPUT_LENGTH = 64;
