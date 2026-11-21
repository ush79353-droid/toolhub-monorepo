import type { SupportedCurrency } from '@/tools/shared/currency';

export type InventoryTurnoverStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'zeroAverageInventory'
  | 'zeroCOGS'
  | 'undefinedTurnover'
  | 'undefinedInventoryDays';

export interface InventoryTurnoverInput {
  costOfGoodsSold: string;
  beginningInventory: string;
  endingInventory: string;
  days: string;
  currency: SupportedCurrency;
}

export interface InventoryTurnoverResult {
  costOfGoodsSold: number;
  beginningInventory: number;
  endingInventory: number;
  days: number;
  averageInventory: number;
  inventoryTurnover: number | null;
  inventoryDays: number | null;
  status: InventoryTurnoverStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedCostOfGoodsSold: string;
  formattedBeginningInventory: string;
  formattedEndingInventory: string;
  formattedAverageInventory: string;
  formattedInventoryTurnover: string | null;
  formattedInventoryDays: string | null;
}

export type InventoryTurnoverFieldErrors = {
  costOfGoodsSold?: string;
  beginningInventory?: string;
  endingInventory?: string;
  days?: string;
  form?: string;
};

export function createDefaultInput(): InventoryTurnoverInput {
  return {
    costOfGoodsSold: '',
    beginningInventory: '',
    endingInventory: '',
    days: '365',
    currency: 'PKR',
  };
}
