import type { SupportedCurrency } from '@/tools/shared/currency';

export type PeriodUnit = 'days' | 'weeks' | 'months' | 'years';

export type AverageBalanceMode = 'manual' | 'calculated';

export type CccStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'zeroRevenue'
  | 'zeroCogs';

export interface CashConversionCycleInput {
  period: string;
  periodUnit: PeriodUnit;
  totalRevenue: string;
  costOfGoodsSold: string;

  inventoryMode: AverageBalanceMode;
  averageInventory: string;
  beginningInventory: string;
  endingInventory: string;

  receivablesMode: AverageBalanceMode;
  averageAccountsReceivable: string;
  beginningAccountsReceivable: string;
  endingAccountsReceivable: string;

  payablesMode: AverageBalanceMode;
  averageAccountsPayable: string;
  beginningAccountsPayable: string;
  endingAccountsPayable: string;

  currency: SupportedCurrency;
}

export interface CashConversionCycleResult {
  periodDays: number;
  averageInventory: number;
  averageAccountsReceivable: number;
  averageAccountsPayable: number;
  inventoryDays: number;
  accountsReceivableDays: number;
  accountsPayableDays: number;
  operatingCycle: number;
  cashConversionCycle: number;
  status: CccStatus;
  interpretation: string;
  currency: SupportedCurrency;
  formattedPeriodDays: string;
  formattedAverageInventory: string;
  formattedAverageAccountsReceivable: string;
  formattedAverageAccountsPayable: string;
  formattedInventoryDays: string;
  formattedAccountsReceivableDays: string;
  formattedAccountsPayableDays: string;
  formattedOperatingCycle: string;
  formattedCashConversionCycle: string;
}

export type CashConversionCycleFieldErrors = {
  period?: string;
  totalRevenue?: string;
  costOfGoodsSold?: string;
  averageInventory?: string;
  beginningInventory?: string;
  endingInventory?: string;
  averageAccountsReceivable?: string;
  beginningAccountsReceivable?: string;
  endingAccountsReceivable?: string;
  averageAccountsPayable?: string;
  beginningAccountsPayable?: string;
  endingAccountsPayable?: string;
  form?: string;
};

export function createDefaultInput(): CashConversionCycleInput {
  return {
    period: '365',
    periodUnit: 'days',
    totalRevenue: '',
    costOfGoodsSold: '',
    inventoryMode: 'manual',
    averageInventory: '',
    beginningInventory: '',
    endingInventory: '',
    receivablesMode: 'manual',
    averageAccountsReceivable: '',
    beginningAccountsReceivable: '',
    endingAccountsReceivable: '',
    payablesMode: 'manual',
    averageAccountsPayable: '',
    beginningAccountsPayable: '',
    endingAccountsPayable: '',
    currency: 'PKR',
  };
}
