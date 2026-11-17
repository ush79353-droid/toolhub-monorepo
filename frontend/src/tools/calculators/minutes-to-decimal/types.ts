export const MAX_ABS_VALUE = 1e15;

export type DecimalSource = 'clockMinutes' | 'hours' | 'minutes' | 'seconds';

export type MinutesToDecimalFieldErrors = Partial<Record<DecimalSource, string>>;

export const SECONDS_PER_MINUTE = 60;
export const MINUTES_PER_HOUR = 60;
export const SECONDS_PER_HOUR = 3600;
