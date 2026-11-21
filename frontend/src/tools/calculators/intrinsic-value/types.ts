import type { SupportedCurrency } from '@/tools/shared/currency';

export type ValuationStatus = 'below' | 'above' | 'equal';

export interface IntrinsicValueInput {
  earningsPerShare: string;
  expectedGrowthRate: string;
  corporateBondYield: string;
  currentMarketPrice: string;
  currency: SupportedCurrency;
}

export interface IntrinsicValueResult {
  intrinsicValue: number;
  currency: SupportedCurrency;
  formattedIntrinsicValue: string;
  marginOfSafety: number | null;
  formattedMarginOfSafety: string | null;
  valuationStatus: ValuationStatus | null;
  valuationLabel: string | null;
  interpretation: string;
  warningMessage: string | null;
}

export type IntrinsicValueFieldErrors = {
  form?: string;
  earningsPerShare?: string;
  expectedGrowthRate?: string;
  corporateBondYield?: string;
  currentMarketPrice?: string;
};

/** Reference: EPS $5 · g 6% · Y 4.4% · CMP $80 → V $102.50 · MS ≈ 21.95% */
export function createDefaultInput(): IntrinsicValueInput {
  return {
    earningsPerShare: '5',
    expectedGrowthRate: '6',
    corporateBondYield: '4.4',
    currentMarketPrice: '80',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): IntrinsicValueInput {
  return {
    earningsPerShare: '',
    expectedGrowthRate: '',
    corporateBondYield: '',
    currentMarketPrice: '',
    currency,
  };
}
