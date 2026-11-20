import type { SupportedCurrency } from '@/tools/shared/currency';

export type NetIncomeStatus = 'valid' | 'incomplete' | 'invalid';

export interface NetIncomeInput {
  revenue: string;
  costOfSales: string;
  operatingExpenses: string;
  interest: string;
  taxRate: string;
  currency: SupportedCurrency;
}

export interface NetIncomeResult {
  revenue: number;
  costOfSales: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingIncome: number;
  interest: number;
  earningsBeforeTax: number;
  taxRate: number;
  totalTaxes: number;
  netIncomeAfterTaxes: number;
  netProfitMargin: number | null;
  status: NetIncomeStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedRevenue: string;
  formattedCostOfSales: string;
  formattedGrossProfit: string;
  formattedOperatingExpenses: string;
  formattedOperatingIncome: string;
  formattedInterest: string;
  formattedEarningsBeforeTax: string;
  formattedTaxRate: string;
  formattedTotalTaxes: string;
  formattedNetIncomeAfterTaxes: string;
  formattedNetProfitMargin: string | null;
}

export type NetIncomeFieldErrors = {
  revenue?: string;
  costOfSales?: string;
  operatingExpenses?: string;
  interest?: string;
  taxRate?: string;
  form?: string;
};

export function createDefaultInput(): NetIncomeInput {
  return {
    revenue: '',
    costOfSales: '',
    operatingExpenses: '',
    interest: '',
    taxRate: '',
    currency: 'PKR',
  };
}
