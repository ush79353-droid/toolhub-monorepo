import type { SupportedCurrency } from '@/tools/shared/currency';

export interface CashOnCashInput {
  totalCashInvestment: string;
  grossAnnualRentalIncome: string;
  vacancyRate: string;
  annualOperatingExpenses: string;
  monthlyLoanPayment: string;
  currency: SupportedCurrency;
}

export interface CashOnCashResult {
  vacancyLoss: number;
  effectiveRentalIncome: number;
  noi: number;
  annualDebtService: number;
  annualCashFlow: number;
  cashOnCashReturnPercent: number | null;
  currency: SupportedCurrency;
  formattedVacancyLoss: string;
  formattedEffectiveRentalIncome: string;
  formattedNoi: string;
  formattedAnnualDebtService: string;
  formattedAnnualCashFlow: string;
  formattedCashOnCashReturn: string | null;
}

export type CashOnCashFieldErrors = {
  totalCashInvestment?: string;
  grossAnnualRentalIncome?: string;
  vacancyRate?: string;
  annualOperatingExpenses?: string;
  monthlyLoanPayment?: string;
  form?: string;
};

export function createDefaultInput(): CashOnCashInput {
  return {
    totalCashInvestment: '',
    grossAnnualRentalIncome: '',
    vacancyRate: '0',
    annualOperatingExpenses: '',
    monthlyLoanPayment: '',
    currency: 'PKR',
  };
}
