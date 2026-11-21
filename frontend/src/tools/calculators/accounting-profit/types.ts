import type { SupportedCurrency } from '@/tools/shared/currency';

/**
 * Screenshot-first Accounting Profit inputs.
 * All money fields keep independent display currencies.
 * Operation expenses must exclude interest, depreciation, and taxes
 * (those are entered separately to avoid double-counting).
 */
export interface AccountingProfitInput {
  totalRevenue: string;
  totalRevenueCurrency: SupportedCurrency;
  /** Screenshot label: “Operation expenses”. */
  operationExpenses: string;
  operationExpensesCurrency: SupportedCurrency;
  interest: string;
  interestCurrency: SupportedCurrency;
  depreciation: string;
  depreciationCurrency: SupportedCurrency;
  taxes: string;
  taxesCurrency: SupportedCurrency;
  totalExplicitCostsCurrency: SupportedCurrency;
  accountingProfitCurrency: SupportedCurrency;
}

export interface AccountingProfitResult {
  totalExplicitCostsCanonical: number;
  accountingProfitCanonical: number;
  totalExplicitCosts: number;
  accountingProfit: number;
  totalRevenueCurrency: SupportedCurrency;
  totalExplicitCostsCurrency: SupportedCurrency;
  accountingProfitCurrency: SupportedCurrency;
  formattedTotalExplicitCosts: string;
  formattedAccountingProfit: string;
}

export type AccountingProfitFieldErrors = {
  totalRevenue?: string;
  operationExpenses?: string;
  interest?: string;
  depreciation?: string;
  taxes?: string;
  form?: string;
};

/** Screenshot defaults: 100k − (25k+12k+10k+15k) = 38k. */
export function createDefaultInput(): AccountingProfitInput {
  return {
    totalRevenue: '100000',
    totalRevenueCurrency: 'PKR',
    operationExpenses: '25000',
    operationExpensesCurrency: 'PKR',
    interest: '12000',
    interestCurrency: 'PKR',
    depreciation: '10000',
    depreciationCurrency: 'PKR',
    taxes: '15000',
    taxesCurrency: 'PKR',
    totalExplicitCostsCurrency: 'PKR',
    accountingProfitCurrency: 'PKR',
  };
}
