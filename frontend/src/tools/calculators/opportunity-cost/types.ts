import type { SupportedCurrency } from '@/tools/shared/currency';

export interface OpportunityCostInput {
  moneyToSpend: string;
  annualReturn: string;
  years: string;
  months: string;
  incomeTax: string;
  inflation: string;
  showSupplementary: boolean;
  currency: SupportedCurrency;
}

export interface OpportunityCostResult {
  moneyToSpend: number;
  annualReturnPercent: number;
  years: number;
  months: number;
  yearsExact: number;
  incomeTaxPercent: number;
  inflationPercent: number;
  netReturn: number;
  totalSavingsAfterTax: number;
  realSavings: number;
  opportunityCost: number;
  nominalGain: number;
  currency: SupportedCurrency;
  formattedTotalSavings: string;
  formattedRealSavings: string;
  formattedOpportunityCost: string;
  formattedNominalGain: string;
}

export type OpportunityCostFieldErrors = {
  moneyToSpend?: string;
  annualReturn?: string;
  years?: string;
  months?: string;
  incomeTax?: string;
  inflation?: string;
  form?: string;
};

export function createDefaultInput(): OpportunityCostInput {
  return {
    moneyToSpend: '',
    annualReturn: '3',
    years: '',
    months: '',
    incomeTax: '12',
    inflation: '2.5',
    showSupplementary: false,
    currency: 'PKR',
  };
}
