import type { SupportedCurrency } from '@/tools/shared/currency';

export interface InvestmentFeeInput {
  initialInvestment: string;
  salesLoadPercent: string;
  annualReturnPercent: string;
  annualOperatingFeesPercent: string;
  durationYears: string;
  turnoverCostPercent: string;
  redemptionFeesPercent: string;
  currency: SupportedCurrency;
}

export interface InvestmentFeeResult {
  investedAmount: number;
  effectiveReturnPercent: number;
  fundValueBeforeRedemption: number;
  finalFundValue: number;
  fundValueWithoutFees: number;
  totalFees: number;
  currency: SupportedCurrency;
  formattedInvestedAmount: string;
  formattedEffectiveReturn: string;
  formattedFundValueBeforeRedemption: string;
  formattedFinalFundValue: string;
  formattedFundValueWithoutFees: string;
  formattedTotalFees: string;
}

export type InvestmentFeeFieldErrors = {
  initialInvestment?: string;
  salesLoadPercent?: string;
  annualReturnPercent?: string;
  annualOperatingFeesPercent?: string;
  durationYears?: string;
  turnoverCostPercent?: string;
  redemptionFeesPercent?: string;
  form?: string;
};

export function createDefaultInput(): InvestmentFeeInput {
  return {
    initialInvestment: '10000',
    salesLoadPercent: '2',
    annualReturnPercent: '10',
    annualOperatingFeesPercent: '2',
    durationYears: '10',
    turnoverCostPercent: '3',
    redemptionFeesPercent: '2',
    currency: 'PKR',
  };
}
