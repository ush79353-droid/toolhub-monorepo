import type { SupportedCurrency } from '@/tools/shared/currency';

export interface CashFlowToDebtRatioInput {
  operatingCashFlow: string;
  ocfCurrency: SupportedCurrency;
  totalDebt: string;
  totalDebtCurrency: SupportedCurrency;
  /** Expanded by default per screenshot. */
  debtToCashFlowOpen: boolean;
  /** Collapsed by default; short-term + long-term when enabled. */
  debtComponentsOpen: boolean;
  shortTermDebt: string;
  shortTermDebtCurrency: SupportedCurrency;
  longTermDebt: string;
  longTermDebtCurrency: SupportedCurrency;
}

export interface CashFlowToDebtRatioResult {
  ocfNormalized: number;
  totalDebtNormalized: number;
  /** Null when total debt is zero (undefined, not Infinity). */
  cashFlowToDebtPercent: number | null;
  /** Null when operating cash flow is zero (undefined reciprocal). */
  debtToCashFlowRatio: number | null;
  calcCurrency: SupportedCurrency;
  formattedCashFlowToDebtPercent: string;
  formattedDebtToCashFlowRatio: string;
  summaryText: string;
}

export type CashFlowToDebtRatioFieldErrors = {
  operatingCashFlow?: string;
  totalDebt?: string;
  shortTermDebt?: string;
  longTermDebt?: string;
  form?: string;
};

export function createDefaultInput(): CashFlowToDebtRatioInput {
  return {
    operatingCashFlow: '',
    ocfCurrency: 'PKR',
    totalDebt: '',
    totalDebtCurrency: 'PKR',
    debtToCashFlowOpen: true,
    debtComponentsOpen: false,
    shortTermDebt: '',
    shortTermDebtCurrency: 'PKR',
    longTermDebt: '',
    longTermDebtCurrency: 'PKR',
  };
}
