import type { SupportedCurrency } from '@/tools/shared/currency';

export interface SimpleInterestInput {
  principal: string;
  interestRate: string;
  termYears: string;
  termMonths: string;
  currency: SupportedCurrency;
}

export interface SimpleInterestResult {
  principal: number;
  interestRatePercent: number;
  termYears: number;
  termMonths: number;
  termYearsExact: number;
  totalInterest: number;
  finalBalance: number;
  formattedTotalInterest: string;
  formattedFinalBalance: string;
}

export type SimpleInterestFieldErrors = {
  principal?: string;
  interestRate?: string;
  termYears?: string;
  termMonths?: string;
  form?: string;
};

export function createDefaultInput(): SimpleInterestInput {
  return {
    principal: '',
    interestRate: '',
    termYears: '',
    termMonths: '',
    currency: 'PKR',
  };
}
