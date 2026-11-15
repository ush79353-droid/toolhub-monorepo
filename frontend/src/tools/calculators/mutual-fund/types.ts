import type { SupportedCurrency } from '@/tools/shared/currency';

export type MutualFundMode = 'sip' | 'lumpSum';

export interface MutualFundInput {
  mode: MutualFundMode;
  investmentAmount: string;
  expectedAnnualReturn: string;
  years: string;
  months: string;
  currency: SupportedCurrency;
}

export interface MutualFundResult {
  mode: MutualFundMode;
  investmentAmount: number;
  expectedAnnualReturnPercent: number;
  years: number;
  months: number;
  periods: number;
  monthlyRate: number;
  maturityValue: number;
  currency: SupportedCurrency;
  formattedMaturityValue: string;
}

export type MutualFundFieldErrors = {
  investmentAmount?: string;
  expectedAnnualReturn?: string;
  years?: string;
  months?: string;
  form?: string;
};

export function createDefaultInput(): MutualFundInput {
  return {
    mode: 'sip',
    investmentAmount: '',
    expectedAnnualReturn: '',
    years: '',
    months: '',
    currency: 'PKR',
  };
}
