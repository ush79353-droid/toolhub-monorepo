import type { SupportedCurrency } from '@/tools/shared/currency';

/** Time-to-maturity unit shown beside the input (screenshot default: yrs). */
export type MaturityTimeUnit = 'years' | 'months' | 'days';

export interface BlackScholesInput {
  stockPrice: string;
  stockCurrency: SupportedCurrency;
  strikePrice: string;
  strikeCurrency: SupportedCurrency;
  timeToMaturity: string;
  timeUnit: MaturityTimeUnit;
  dividendYieldPercent: string;
  volatilityPercent: string;
  riskFreeRatePercent: string;
  callCurrency: SupportedCurrency;
  putCurrency: SupportedCurrency;
}

export interface BlackScholesResult {
  /** Spot used in the model (stock field currency). */
  stockCanonical: number;
  /** Strike converted into stock currency for the model. */
  strikeCanonical: number;
  timeYears: number;
  dividendYield: number;
  volatility: number;
  riskFreeRate: number;
  d1: number | null;
  d2: number | null;
  callCanonical: number;
  putCanonical: number;
  call: number;
  put: number;
  stockCurrency: SupportedCurrency;
  strikeCurrency: SupportedCurrency;
  callCurrency: SupportedCurrency;
  putCurrency: SupportedCurrency;
  formattedCall: string;
  formattedPut: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
  boundaryNote: string | null;
}

export type BlackScholesFieldErrors = {
  form?: string;
  stockPrice?: string;
  strikePrice?: string;
  timeToMaturity?: string;
  dividendYieldPercent?: string;
  volatilityPercent?: string;
  riskFreeRatePercent?: string;
};

export const TIME_UNIT_LABELS: Record<MaturityTimeUnit, string> = {
  years: 'yrs',
  months: 'mos',
  days: 'days',
};

export function createDefaultInput(): BlackScholesInput {
  return {
    stockPrice: '',
    stockCurrency: 'PKR',
    strikePrice: '',
    strikeCurrency: 'PKR',
    timeToMaturity: '',
    timeUnit: 'years',
    dividendYieldPercent: '',
    volatilityPercent: '',
    riskFreeRatePercent: '',
    callCurrency: 'PKR',
    putCurrency: 'PKR',
  };
}

export function createEmptyInput(): BlackScholesInput {
  return createDefaultInput();
}

/**
 * Textbook at-the-money European example (Hull-style):
 * S=K=100, T=1y, q=0%, σ=20%, r=5% → call ≈ 10.45, put ≈ 5.57.
 */
export function createExampleInput(): BlackScholesInput {
  return {
    stockPrice: '100',
    stockCurrency: 'PKR',
    strikePrice: '100',
    strikeCurrency: 'PKR',
    timeToMaturity: '1',
    timeUnit: 'years',
    dividendYieldPercent: '0',
    volatilityPercent: '20',
    riskFreeRatePercent: '5',
    callCurrency: 'PKR',
    putCurrency: 'PKR',
  };
}
