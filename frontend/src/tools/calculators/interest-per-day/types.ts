import type { SupportedCurrency } from '@/tools/shared/currency';

/** Screenshot unit dropdown — only % is reference-confirmed. */
export type RatePercentUnit = '%';

export interface InterestPerDayInput {
  loanBalance: string;
  /** Currency of the loan balance (calculation currency). */
  loanBalanceCurrency: SupportedCurrency;
  annualInterestRatePercent: string;
  annualRateUnit: RatePercentUnit;
  /** Independent display currency for interest per day. */
  interestPerDayCurrency: SupportedCurrency;
  dailyRateUnit: RatePercentUnit;
}

export interface InterestPerDayResult {
  /** Full-precision daily interest in loan-balance currency. */
  interestPerDayInLoanCurrency: number;
  /** Full-precision daily interest in result currency. */
  interestPerDay: number;
  /** Full-precision daily rate as a percent (annual / 365). */
  interestRatePerDayPercent: number;
  loanBalanceCurrency: SupportedCurrency;
  interestPerDayCurrency: SupportedCurrency;
  formattedInterestPerDay: string;
  formattedInterestRatePerDay: string;
}

export type InterestPerDayFieldErrors = {
  loanBalance?: string;
  annualInterestRatePercent?: string;
  form?: string;
};

export function createDefaultInput(): InterestPerDayInput {
  return {
    loanBalance: '100000',
    loanBalanceCurrency: 'PKR',
    annualInterestRatePercent: '7.3',
    annualRateUnit: '%',
    interestPerDayCurrency: 'PKR',
    dailyRateUnit: '%',
  };
}
