/** Exact calendar convention: 1 year = 12 months (duration arithmetic, not date math). */
export const MONTHS_PER_YEAR = 12;

export const MAX_ABS_VALUE = 1e15;

export type MonthsToYearsSource = 'months' | 'years' | 'yearsMonths';

export interface MonthsToYearsInput {
  source: MonthsToYearsSource;
  months: number | null;
  years: number | null;
  yearsPart: number | null;
  monthsPart: number | null;
}

export interface MonthsToYearsResult {
  source: MonthsToYearsSource;
  months: number;
  years: number;
  yearsPart: number;
  monthsPart: number;
  mixedLabel: string;
  explanation: string;
}

export type MonthsToYearsFieldErrors = {
  months?: string;
  years?: string;
  yearsPart?: string;
  monthsPart?: string;
};
