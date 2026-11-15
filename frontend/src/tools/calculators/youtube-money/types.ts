import type { SupportedCurrency } from '@/tools/shared/currency';

export const PERIODS = ['day', 'week', 'month', 'year'] as const;
export type Period = (typeof PERIODS)[number];

export const PERIOD_LABEL: Record<Period, string> = {
  day: '/ day',
  week: '/ week',
  month: '/ month',
  year: '/ year',
};

/** Calendar factors shared with Business Budget for period conversion. */
export const DAYS_PER_YEAR = 365;
export const WEEKS_PER_YEAR = 52;

export interface YoutubeMoneyInput {
  rpm: string;
  views: string;
  viewsPeriod: Period;
  grossPeriod: Period;
  netPeriod: Period;
  currency: SupportedCurrency;
}

export interface YoutubeMoneyResult {
  rpm: number;
  views: number;
  viewsPeriod: Period;
  grossPeriod: Period;
  netPeriod: Period;
  currency: SupportedCurrency;
  /** Estimated revenue for the gross output period (RPM × views / 1000). */
  grossRevenue: number;
  /**
   * Creator net estimate. Equals gross when no separate deduction assumption exists —
   * creator RPM already reflects platform revenue sharing.
   */
  netRevenue: number;
  formattedGrossRevenue: string;
  formattedNetRevenue: string;
}

export type YoutubeMoneyFieldErrors = {
  rpm?: string;
  views?: string;
  form?: string;
};

export function createDefaultInput(): YoutubeMoneyInput {
  return {
    rpm: '',
    views: '',
    viewsPeriod: 'day',
    grossPeriod: 'day',
    netPeriod: 'day',
    currency: 'PKR',
  };
}
