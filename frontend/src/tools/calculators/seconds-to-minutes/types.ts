export const SECONDS_PER_MINUTE = 60;
export const MAX_ABS_VALUE = 1e15;

export type SecMinutesSource = 'seconds' | 'minutes';

export interface SecondsToMinutesInput {
  source: SecMinutesSource;
  /** null while the active source field is blank or incomplete. */
  value: number | null;
}

export interface SecondsToMinutesResult {
  source: SecMinutesSource;
  seconds: number;
  minutes: number;
  explanation: string;
}

export type SecondsToMinutesFieldErrors = Partial<Record<SecMinutesSource, string>>;
