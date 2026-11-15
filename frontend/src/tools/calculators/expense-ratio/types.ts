import type { SupportedCurrency } from '@/tools/shared/currency';

export interface ExpenseRatioInput {
  initialInvestment: string;
  yearlyInvestment: string;
  durationYears: string;
  expectedReturn: string;
  expenseRatio: string;
  currency: SupportedCurrency;
}

export interface ExpenseRatioResult {
  grossFutureValue: number;
  totalEtfCost: number;
  netFutureValue: number;
  formattedGrossFutureValue: string;
  formattedTotalEtfCost: string;
  formattedNetFutureValue: string;
}

export type ExpenseRatioFieldErrors = {
  initialInvestment?: string;
  yearlyInvestment?: string;
  durationYears?: string;
  expectedReturn?: string;
  expenseRatio?: string;
  form?: string;
};

export function createDefaultInput(): ExpenseRatioInput {
  return {
    initialInvestment: '',
    yearlyInvestment: '',
    durationYears: '',
    expectedReturn: '',
    expenseRatio: '',
    currency: 'PKR',
  };
}
