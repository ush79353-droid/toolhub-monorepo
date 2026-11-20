import type { SupportedCurrency } from '@/tools/shared/currency';

export type OptimalPriceStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'noFiniteOptimum'
  | 'mrInconsistent';

export interface OptimalPriceInput {
  marginalCost: string;
  marginalRevenue: string;
  initialPrice: string;
  initialQuantity: string;
  finalPrice: string;
  finalQuantity: string;
  currency: SupportedCurrency;
}

export interface OptimalPriceResult {
  marginalCost: number;
  marginalRevenue: number | null;
  initialPrice: number;
  initialQuantity: number;
  finalPrice: number;
  finalQuantity: number;
  constantElasticity: number;
  midpointElasticity: number | null;
  impliedMarginalRevenueAtInitial: number | null;
  optimalPrice: number | null;
  optimalQuantity: number | null;
  profitAtInitial: number;
  profitAtFinal: number;
  profitAtOptimal: number | null;
  status: OptimalPriceStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedMarginalCost: string;
  formattedMarginalRevenue: string | null;
  formattedInitialPrice: string;
  formattedFinalPrice: string;
  formattedConstantElasticity: string;
  formattedMidpointElasticity: string | null;
  formattedImpliedMr: string | null;
  formattedOptimalPrice: string | null;
  formattedOptimalQuantity: string | null;
  formattedProfitAtInitial: string;
  formattedProfitAtFinal: string;
  formattedProfitAtOptimal: string | null;
}

export type OptimalPriceFieldErrors = {
  marginalCost?: string;
  marginalRevenue?: string;
  initialPrice?: string;
  initialQuantity?: string;
  finalPrice?: string;
  finalQuantity?: string;
  form?: string;
};

export function createDefaultInput(): OptimalPriceInput {
  return {
    marginalCost: '',
    marginalRevenue: '',
    initialPrice: '',
    initialQuantity: '',
    finalPrice: '',
    finalQuantity: '',
    currency: 'PKR',
  };
}
