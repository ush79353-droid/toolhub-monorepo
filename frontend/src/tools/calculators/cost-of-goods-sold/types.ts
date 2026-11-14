import type { SupportedCurrency } from '@/tools/shared/currency';

export interface CostOfGoodsSoldInput {
  beginningInventory: number;
  purchases: number;
  endingInventory: number;
  currency: SupportedCurrency;
}

export interface CostOfGoodsSoldResult {
  beginningInventory: number;
  purchases: number;
  endingInventory: number;
  cogs: number;
  currency: SupportedCurrency;
  cogsDisplay: string;
}

export type CostOfGoodsSoldFieldErrors = Record<string, string>;

export function createDefaultInput(): CostOfGoodsSoldInput {
  return {
    beginningInventory: Number.NaN,
    purchases: Number.NaN,
    endingInventory: Number.NaN,
    currency: 'PKR',
  };
}
