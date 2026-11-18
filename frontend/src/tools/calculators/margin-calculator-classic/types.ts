import type { SupportedCurrency } from '@/tools/shared/currency';

/** Last-edited field (avoids circular bidirectional updates). */
export type MarginClassicDriver = 'cost' | 'margin' | 'revenue' | 'profit';

export interface MarginCalculatorClassicInput {
  cost: string;
  costCurrency: SupportedCurrency;
  marginPercent: string;
  /** When true, cost edits hold margin and recompute revenue/profit. */
  marginPinned: boolean;
  revenue: string;
  revenueCurrency: SupportedCurrency;
  profit: string;
  profitCurrency: SupportedCurrency;
  driver: MarginClassicDriver;
}

export interface MarginCalculatorClassicResult {
  costInCalc: number;
  marginPercent: number;
  revenueInCalc: number;
  profitInCalc: number;
  revenueDisplayed: number;
  profitDisplayed: number;
  calcCurrency: SupportedCurrency;
  revenueCurrency: SupportedCurrency;
  profitCurrency: SupportedCurrency;
  formattedMargin: string;
  formattedRevenue: string;
  formattedProfit: string;
  formattedCost: string;
}

/** Non-driver fields refreshed after a solve (keeps the edited field as typed). */
export type MarginClassicSyncedFields = Partial<
  Pick<
    MarginCalculatorClassicInput,
    'cost' | 'marginPercent' | 'revenue' | 'profit'
  >
>;

export type MarginCalculatorClassicFieldErrors = {
  cost?: string;
  marginPercent?: string;
  revenue?: string;
  profit?: string;
  form?: string;
};

export function createDefaultInput(): MarginCalculatorClassicInput {
  return {
    cost: '',
    costCurrency: 'PKR',
    marginPercent: '',
    marginPinned: true,
    revenue: '',
    revenueCurrency: 'PKR',
    profit: '',
    profitCurrency: 'PKR',
    driver: 'margin',
  };
}
