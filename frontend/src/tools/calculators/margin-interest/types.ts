import type { SupportedCurrency } from '@/tools/shared/currency';

export interface MarginInterestInput {
  amountBorrowed: string;
  interestRatePercent: string;
  numberOfDays: string;
  /** Currency of the borrowed amount (calculation currency). */
  currency: SupportedCurrency;
  /** Independent display currency for margin interest. */
  resultCurrency: SupportedCurrency;
}

export interface MarginInterestResult {
  /** Full-precision interest in `currency` (result / display currency). */
  marginInterest: number;
  /** Full-precision interest in the borrowed amount's currency. */
  marginInterestInBorrowed: number;
  currency: SupportedCurrency;
  borrowedCurrency: SupportedCurrency;
  formattedMarginInterest: string;
}

export type MarginInterestFieldErrors = {
  amountBorrowed?: string;
  interestRatePercent?: string;
  numberOfDays?: string;
  form?: string;
};

export function createDefaultInput(): MarginInterestInput {
  return {
    amountBorrowed: '100000',
    interestRatePercent: '12',
    numberOfDays: '30',
    currency: 'PKR',
    resultCurrency: 'PKR',
  };
}
