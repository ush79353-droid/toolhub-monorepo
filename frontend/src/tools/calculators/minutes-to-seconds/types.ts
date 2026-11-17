export const MAX_ABS_SECONDS = 1e15;
export const SECONDS_PER_MINUTE = 60;

export type MinSecSource = 'minutes' | 'seconds' | 'combinedMinutes' | 'combinedSeconds';

export type MinutesToSecondsFieldErrors = Partial<Record<MinSecSource, string>>;
