import type { SupportedCurrency } from '@/tools/shared/currency';

/** First five years always visible (screenshot). Omni allows up to 9 annual flows. */
export const INITIAL_YEARS = 5;
export const MAX_YEARS = 9;

export interface NpvInput {
  discountRatePercent: string;
  initialCosts: string;
  cashFlows: string[];
  showMoreCashFlows: boolean;
  currency: SupportedCurrency;
}

export interface NpvResult {
  npv: number;
  expectedCashFlows: number;
  npvDisplay: string;
  expectedCashFlowsDisplay: string;
  yearsUsed: number;
  currency: SupportedCurrency;
}

export type NpvFieldErrors = {
  discountRatePercent?: string;
  initialCosts?: string;
  form?: string;
  [key: `year${number}`]: string | undefined;
};

export function createDefaultInput(): NpvInput {
  return {
    discountRatePercent: '10',
    initialCosts: '',
    cashFlows: Array.from({ length: INITIAL_YEARS }, () => '0'),
    showMoreCashFlows: false,
    currency: 'PKR',
  };
}
