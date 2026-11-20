import type { SupportedCurrency } from '@/tools/shared/currency';

export type EbtStatus = 'valid' | 'incomplete' | 'invalid' | 'zeroRevenue';

export interface EbtInput {
  revenue: string;
  costOfGoodsSold: string;
  sellingGeneralAdministrative: string;
  depreciationAmortization: string;
  interestExpenses: string;
  otherIncome: string;
  currency: SupportedCurrency;
}

export interface EbtResult {
  revenue: number;
  costOfGoodsSold: number;
  grossProfit: number;
  sellingGeneralAdministrative: number;
  depreciationAmortization: number;
  operatingExpenses: number;
  ebit: number;
  interestExpenses: number;
  otherIncome: number;
  earningsBeforeTax: number;
  ebtMargin: number | null;
  status: EbtStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedRevenue: string;
  formattedCostOfGoodsSold: string;
  formattedGrossProfit: string;
  formattedSellingGeneralAdministrative: string;
  formattedDepreciationAmortization: string;
  formattedOperatingExpenses: string;
  formattedEbit: string;
  formattedInterestExpenses: string;
  formattedOtherIncome: string;
  formattedEarningsBeforeTax: string;
  formattedEbtMargin: string | null;
}

export type EbtFieldErrors = {
  revenue?: string;
  costOfGoodsSold?: string;
  sellingGeneralAdministrative?: string;
  depreciationAmortization?: string;
  interestExpenses?: string;
  otherIncome?: string;
  form?: string;
};

export function createDefaultInput(): EbtInput {
  return {
    revenue: '',
    costOfGoodsSold: '',
    sellingGeneralAdministrative: '',
    depreciationAmortization: '',
    interestExpenses: '',
    otherIncome: '',
    currency: 'PKR',
  };
}
