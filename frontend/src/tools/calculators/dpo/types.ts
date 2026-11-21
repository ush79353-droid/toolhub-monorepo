import type { SupportedCurrency } from '@/tools/shared/currency';

export type BalanceSource = 'calculated' | 'manual';

export type DpoStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'zeroPurchases'
  | 'negativePurchases';

export interface DpoInput {
  averageApSource: BalanceSource;
  beginningAccountsPayable: string;
  endingAccountsPayable: string;
  manualAverageAp: string;

  purchasesSource: BalanceSource;
  beginningInventory: string;
  endingInventory: string;
  costOfGoodsSold: string;
  manualPurchases: string;

  accountingPeriodDays: string;
  currency: SupportedCurrency;
}

export interface DpoResult {
  averageAccountsPayable: number;
  purchases: number;
  accountingPeriodDays: number;
  daysPayableOutstanding: number;
  accountsPayableTurnover: number | null;
  status: DpoStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedAverageAccountsPayable: string;
  formattedPurchases: string;
  formattedAccountingPeriodDays: string;
  formattedDaysPayableOutstanding: string;
  formattedAccountsPayableTurnover: string | null;
}

export type DpoFieldErrors = {
  beginningAccountsPayable?: string;
  endingAccountsPayable?: string;
  manualAverageAp?: string;
  beginningInventory?: string;
  endingInventory?: string;
  costOfGoodsSold?: string;
  manualPurchases?: string;
  accountingPeriodDays?: string;
  form?: string;
};

export function createDefaultInput(): DpoInput {
  return {
    averageApSource: 'calculated',
    beginningAccountsPayable: '',
    endingAccountsPayable: '',
    manualAverageAp: '',
    purchasesSource: 'calculated',
    beginningInventory: '',
    endingInventory: '',
    costOfGoodsSold: '',
    manualPurchases: '',
    accountingPeriodDays: '365',
    currency: 'PKR',
  };
}
