import type { SupportedCurrency } from '@/tools/shared/currency';

export interface PresentValueInput {
  futureValue: string;
  periods: string;
  interestRatePercent: string;
  currency: SupportedCurrency;
}

export interface PresentValueResult {
  presentValue: number;
  totalInterest: number;
  presentValueDisplay: string;
  totalInterestDisplay: string;
  currency: SupportedCurrency;
}

export type PresentValueFieldErrors = {
  futureValue?: string;
  periods?: string;
  interestRatePercent?: string;
  form?: string;
};

export function createDefaultInput(): PresentValueInput {
  return {
    futureValue: '12100',
    periods: '2',
    interestRatePercent: '10',
    currency: 'PKR',
  };
}
