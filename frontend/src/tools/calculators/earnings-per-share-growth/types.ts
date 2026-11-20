import type { SupportedCurrency } from '@/tools/shared/currency';

export interface EpsGrowthInput {
  initialEps: string;
  finalEps: string;
  numberOfPeriods: string;
  currency: SupportedCurrency;
}

export interface EpsGrowthResult {
  absoluteEpsChange: number;
  totalGrowthPercentage: number | null;
  compoundGrowthRate: number | null;
  currency: SupportedCurrency;
  formattedAbsoluteChange: string;
  formattedTotalGrowth: string | null;
  formattedCagr: string | null;
  interpretation: string;
  warningMessage: string | null;
}

export type EpsGrowthFieldErrors = {
  form?: string;
  initialEps?: string;
  finalEps?: string;
  numberOfPeriods?: string;
};

/** Reference: $2.50 → $4.00 over 3 periods → 60% total · ≈16.99% CAGR */
export function createDefaultInput(): EpsGrowthInput {
  return {
    initialEps: '2.50',
    finalEps: '4.00',
    numberOfPeriods: '3',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): EpsGrowthInput {
  return {
    initialEps: '',
    finalEps: '',
    numberOfPeriods: '1',
    currency,
  };
}
