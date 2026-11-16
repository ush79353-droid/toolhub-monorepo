export type CentsDollarsField = 'cents' | 'dollars';

export type CentsToDollarsFieldErrors = Partial<Record<CentsDollarsField, string>>;

export const CENTS_PER_DOLLAR = 100;
export const DEFAULT_CENTS = 250;
export const MAX_INPUT_LENGTH = 64;
