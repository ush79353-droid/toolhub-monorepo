export type QuartersDollarsField = 'quarters' | 'dollars';

export type QuartersToDollarsFieldErrors = Partial<Record<QuartersDollarsField, string>>;

/** Face value of one U.S. quarter in cents. */
export const CENTS_PER_QUARTER = 25;
/** Quarters that equal one U.S. dollar. */
export const QUARTERS_PER_DOLLAR = 4;
export const MAX_INPUT_LENGTH = 64;
