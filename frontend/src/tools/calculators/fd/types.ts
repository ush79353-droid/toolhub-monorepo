import type { SupportedCurrency } from '@/tools/shared/currency';

export type FdType = 'simple' | 'cumulative';

export type FdCompounding = 'monthly' | 'quarterly' | 'semiannually' | 'annually';

export interface FdInput {
  depositType: FdType;
  principal: string;
  interestRate: string;
  termYears: string;
  compounding: FdCompounding;
  currency: SupportedCurrency;
}

export interface FdResult {
  depositType: FdType;
  principal: number;
  interestRatePercent: number;
  termYears: number;
  compounding: FdCompounding;
  periodsPerYear: number;
  maturityAmount: number;
  totalInterest: number;
  payoutPerPeriod: number;
  totalPayout: number;
  currency: SupportedCurrency;
  formattedMaturityAmount: string;
  formattedTotalInterest: string;
  formattedPayoutPerPeriod: string;
  formattedTotalPayout: string;
}

export type FdFieldErrors = {
  principal?: string;
  interestRate?: string;
  termYears?: string;
  compounding?: string;
  form?: string;
};

export const FD_COMPOUNDING_OPTIONS: readonly {
  value: FdCompounding;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
] as const;

export function createDefaultInput(): FdInput {
  return {
    depositType: 'cumulative',
    principal: '100000',
    interestRate: '8',
    termYears: '2',
    compounding: 'monthly',
    currency: 'PKR',
  };
}
