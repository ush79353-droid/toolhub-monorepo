import type { SupportedCurrency } from '@/tools/shared/currency';

export type AverageInventoryMode = 'calculated' | 'manual';

export type DioStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'zeroDenominator';

export interface DioInput {
  averageInventoryMode: AverageInventoryMode;
  startingInventory: string;
  endingInventory: string;
  manualAverageInventory: string;
  costOfGoodsSold: string;
  accountingPeriodDays: string;
  currency: SupportedCurrency;
}

export interface DioResult {
  averageInventory: number;
  costOfGoodsSold: number;
  accountingPeriodDays: number;
  daysInventoryOutstanding: number;
  inventoryTurnover: number | null;
  status: DioStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedAverageInventory: string;
  formattedCostOfGoodsSold: string;
  formattedAccountingPeriodDays: string;
  formattedDaysInventoryOutstanding: string;
  formattedInventoryTurnover: string | null;
}

export type DioFieldErrors = {
  startingInventory?: string;
  endingInventory?: string;
  manualAverageInventory?: string;
  costOfGoodsSold?: string;
  accountingPeriodDays?: string;
  form?: string;
};

export function createDefaultInput(): DioInput {
  return {
    averageInventoryMode: 'calculated',
    startingInventory: '',
    endingInventory: '',
    manualAverageInventory: '',
    costOfGoodsSold: '',
    accountingPeriodDays: '365',
    currency: 'PKR',
  };
}
