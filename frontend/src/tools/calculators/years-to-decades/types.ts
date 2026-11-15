export type YearsDecadesField = 'years' | 'decades';

export type YearsToDecadesFieldErrors = Partial<Record<YearsDecadesField, string>>;

export const MAX_INPUT_LENGTH = 64;
export const DISPLAY_FRAC_DIGITS = 18;
export const YEARS_PER_DECADE = 10;
