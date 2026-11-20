import type { SupportedCurrency } from '@/tools/shared/currency';

export type CogsKnownMode = 'yes' | 'no';

export type EndingInventoryStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'negativeEndingInventory'
  | 'zeroAverageInventory';

export interface EndingInventoryInput {
  cogsKnown: CogsKnownMode;
  startingInventory: string;
  netPurchases: string;
  costOfGoodsSold: string;
  inventoryTurnover: string;
  currency: SupportedCurrency;
}

export interface EndingInventoryResult {
  startingInventory: number;
  netPurchases: number;
  costOfGoodsSold: number;
  endingInventory: number;
  averageInventory: number;
  inventoryTurnover: number | null;
  status: EndingInventoryStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedStartingInventory: string;
  formattedNetPurchases: string;
  formattedCostOfGoodsSold: string;
  formattedEndingInventory: string;
  formattedAverageInventory: string;
  formattedInventoryTurnover: string | null;
}

export type EndingInventoryFieldErrors = {
  startingInventory?: string;
  netPurchases?: string;
  costOfGoodsSold?: string;
  inventoryTurnover?: string;
  form?: string;
};

export function createDefaultInput(): EndingInventoryInput {
  return {
    cogsKnown: 'yes',
    startingInventory: '',
    netPurchases: '',
    costOfGoodsSold: '',
    inventoryTurnover: '',
    currency: 'PKR',
  };
}
