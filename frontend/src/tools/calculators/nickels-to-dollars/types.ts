export type NickelsDollarsField = 'nickels' | 'dollars';

export type NickelsToDollarsFieldErrors = Partial<Record<NickelsDollarsField, string>>;

/** Face value of one U.S. nickel in cents. */
export const CENTS_PER_NICKEL = 5;
/** Nickels that equal one U.S. dollar. */
export const NICKELS_PER_DOLLAR = 20;
export const MAX_INPUT_LENGTH = 64;
