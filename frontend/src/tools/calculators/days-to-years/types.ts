export type DaysToYearsSource = 'days' | 'years';

export interface DaysToYearsInput {
  source: DaysToYearsSource;
  /** null while the active source field is blank or incomplete. */
  value: number | null;
}

export interface DaysToYearsResult {
  source: DaysToYearsSource;
  days: number;
  years: number;
  explanation: string;
}

export type DaysToYearsFieldErrors = {
  days?: string;
  years?: string;
};

export { DAYS_PER_YEAR, MAX_ABS_VALUE } from '../day-converter/types';
