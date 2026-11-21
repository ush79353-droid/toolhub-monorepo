import type { SupportedCurrency } from '@/tools/shared/currency';

/**
 * Screenshot-first Economic Profit inputs.
 * All money fields keep independent display currencies.
 * Explicit costs = direct monetary expenses; implicit costs = opportunity costs.
 * Do not enter the same cost in both fields.
 */
export interface EconomicProfitInput {
  totalRevenue: string;
  totalRevenueCurrency: SupportedCurrency;
  explicitCosts: string;
  explicitCostsCurrency: SupportedCurrency;
  implicitCosts: string;
  implicitCostsCurrency: SupportedCurrency;
  economicProfitCurrency: SupportedCurrency;
}

export interface EconomicProfitResult {
  /** Profit in the total-revenue (canonical calc) currency before display FX. */
  economicProfitCanonical: number;
  /** Profit converted for the result currency selector. */
  economicProfit: number;
  calcCurrency: SupportedCurrency;
  economicProfitCurrency: SupportedCurrency;
  formattedEconomicProfit: string;
  summaryText: string;
}

export type EconomicProfitFieldErrors = {
  totalRevenue?: string;
  explicitCosts?: string;
  implicitCosts?: string;
  form?: string;
};

export function createDefaultInput(): EconomicProfitInput {
  return {
    totalRevenue: '',
    totalRevenueCurrency: 'PKR',
    explicitCosts: '',
    explicitCostsCurrency: 'PKR',
    implicitCosts: '',
    implicitCostsCurrency: 'PKR',
    economicProfitCurrency: 'PKR',
  };
}
