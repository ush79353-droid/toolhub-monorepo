export const SECONDS_PER_DAY = 86_400;
export const MAX_ABS_VALUE = 1e15;

export type SecDaysSource = 'seconds' | 'days';

export interface SecondsToDaysInput {
  source: SecDaysSource;
  /** null while the active source field is blank or incomplete. */
  value: number | null;
}

export interface SecondsToDaysResult {
  source: SecDaysSource;
  seconds: number;
  days: number;
  explanation: string;
}

export type SecondsToDaysFieldErrors = Partial<Record<SecDaysSource, string>>;
