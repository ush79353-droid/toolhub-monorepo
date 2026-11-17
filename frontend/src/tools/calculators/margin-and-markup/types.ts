import type { SupportedCurrency } from '@/tools/shared/currency';

/** Which field last drove the bidirectional solve (avoids circular updates). */
export type MarginMarkupDriver =
  | 'cost'
  | 'margin'
  | 'markup'
  | 'revenue'
  | 'profit';

export interface MarginAndMarkupInput {
  cost: string;
  costCurrency: SupportedCurrency;
  compareTwo: boolean;
  margin: string;
  markup: string;
  revenue: string;
  revenueCurrency: SupportedCurrency;
  profit: string;
  profitCurrency: SupportedCurrency;
  driver: MarginMarkupDriver;
  /** Second scenario (shown when compareTwo). Shares cost + money currencies. */
  margin2: string;
  markup2: string;
  revenue2: string;
  profit2: string;
  driver2: MarginMarkupDriver;
}

export interface ScenarioAmounts {
  marginPercent: number;
  markupPercent: number;
  /** Full-precision in cost currency. */
  revenueInCost: number;
  /** Full-precision in cost currency. */
  profitInCost: number;
  /** Display amounts in their field currencies. */
  revenue: number;
  profit: number;
  formattedMargin: string;
  formattedMarkup: string;
  formattedRevenue: string;
  formattedProfit: string;
}

export interface MarginAndMarkupResult {
  scenario1: ScenarioAmounts;
  scenario2: ScenarioAmounts | null;
  costInCostCurrency: number;
  costCurrency: SupportedCurrency;
  revenueCurrency: SupportedCurrency;
  profitCurrency: SupportedCurrency;
}

export type MarginAndMarkupFieldErrors = {
  cost?: string;
  margin?: string;
  markup?: string;
  revenue?: string;
  profit?: string;
  margin2?: string;
  markup2?: string;
  revenue2?: string;
  profit2?: string;
  form?: string;
};

export function createDefaultInput(): MarginAndMarkupInput {
  return {
    cost: '',
    costCurrency: 'PKR',
    compareTwo: false,
    margin: '',
    markup: '',
    revenue: '',
    revenueCurrency: 'PKR',
    profit: '',
    profitCurrency: 'PKR',
    driver: 'margin',
    margin2: '',
    markup2: '',
    revenue2: '',
    profit2: '',
    driver2: 'margin',
  };
}
