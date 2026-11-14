import type { SupportedCurrency } from '@/tools/shared/currency';

export interface GmroiDraft {
  startingInventory: string;
  finalInventory: string;
  averageInventory: string;
  grossProfit: string;
  currency: SupportedCurrency;
  /** True when the user typed average inventory (do not overwrite). */
  averageManual: boolean;
}

export interface GmroiResult {
  startingInventory: number | null;
  finalInventory: number | null;
  averageInventory: number;
  grossProfit: number;
  gmroi: number;
  gmroiPercent: number;
  currency: SupportedCurrency;
  averageDisplay: string;
  gmroiDisplay: string;
  gmroiPercentDisplay: string;
}

export type GmroiFieldErrors = Record<string, string>;

export function createDefaultDraft(): GmroiDraft {
  return {
    startingInventory: '',
    finalInventory: '',
    averageInventory: '',
    grossProfit: '',
    currency: 'PKR',
    averageManual: false,
  };
}
