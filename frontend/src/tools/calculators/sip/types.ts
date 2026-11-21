import type { SupportedCurrency } from '@/tools/shared/currency';

export interface SipInput {
  monthlyAmount: string;
  monthlyAmountCurrency: SupportedCurrency;
  years: string;
  annualReturnPercent: string;
  totalInvestmentCurrency: SupportedCurrency;
  maturityCurrency: SupportedCurrency;
}

export interface SipResult {
  totalInvestmentCanonical: number;
  maturityCanonical: number;
  multiplicationFactor: number;
  totalInvestment: number;
  maturityAmount: number;
  monthlyAmountCurrency: SupportedCurrency;
  totalInvestmentCurrency: SupportedCurrency;
  maturityCurrency: SupportedCurrency;
  formattedTotalInvestment: string;
  formattedMaturity: string;
  formattedFactor: string;
}

export type SipFieldErrors = {
  monthlyAmount?: string;
  years?: string;
  annualReturnPercent?: string;
  form?: string;
};

export function createDefaultInput(): SipInput {
  return {
    monthlyAmount: '',
    monthlyAmountCurrency: 'PKR',
    years: '',
    annualReturnPercent: '',
    totalInvestmentCurrency: 'PKR',
    maturityCurrency: 'PKR',
  };
}
