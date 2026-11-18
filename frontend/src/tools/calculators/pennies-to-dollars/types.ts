export type PenniesDollarsField = 'pennies' | 'dollars';

export type PenniesToDollarsFieldErrors = Partial<Record<PenniesDollarsField, string>>;

export const PENNIES_PER_DOLLAR = 100;
export const MAX_INPUT_LENGTH = 64;
