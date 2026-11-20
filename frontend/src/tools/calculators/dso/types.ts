import type { SupportedCurrency } from '@/tools/shared/currency';

export type AverageReceivablesMode = 'calculated' | 'manual';

export type SalesBasis = 'totalSales' | 'netCreditSales';

export type DsoStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'zeroSales';

export interface DsoInput {
  averageReceivablesMode: AverageReceivablesMode;
  beginningAccountsReceivable: string;
  endingAccountsReceivable: string;
  manualAverageReceivables: string;

  salesBasis: SalesBasis;
  sales: string;

  accountingPeriodDays: string;
  currency: SupportedCurrency;
}

export interface DsoResult {
  averageAccountsReceivable: number;
  activeSales: number;
  salesBasis: SalesBasis;
  accountingPeriodDays: number;
  daysSalesOutstanding: number;
  accountsReceivableTurnover: number | null;
  status: DsoStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedAverageAccountsReceivable: string;
  formattedActiveSales: string;
  formattedAccountingPeriodDays: string;
  formattedDaysSalesOutstanding: string;
  formattedAccountsReceivableTurnover: string | null;
}

export type DsoFieldErrors = {
  beginningAccountsReceivable?: string;
  endingAccountsReceivable?: string;
  manualAverageReceivables?: string;
  sales?: string;
  accountingPeriodDays?: string;
  form?: string;
};

export function createDefaultInput(): DsoInput {
  return {
    averageReceivablesMode: 'calculated',
    beginningAccountsReceivable: '',
    endingAccountsReceivable: '',
    manualAverageReceivables: '',
    salesBasis: 'totalSales',
    sales: '',
    accountingPeriodDays: '365',
    currency: 'PKR',
  };
}
