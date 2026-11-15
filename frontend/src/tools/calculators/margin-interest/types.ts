import type { SupportedCurrency } from '@/tools/shared/currency';

export interface MarginInterestInput {
  amountBorrowed: string;
  interestRatePercent: string;
  numberOfDays: string;
  currency: SupportedCurrency;
}

export interface MarginInterestResult {
  marginInterest: number;
  currency: SupportedCurrency;
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
  };
}
