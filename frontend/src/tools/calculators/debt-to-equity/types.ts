import type { SupportedCurrency } from '@/tools/shared/currency';

export interface DebtToEquityInput {
  totalLiabilities: string;
  totalLiabilitiesCurrency: SupportedCurrency;
  stockholdersEquity: string;
  stockholdersEquityCurrency: SupportedCurrency;
}

export interface DebtToEquityResult {
  /** Full-precision D/E ratio (dimensionless). */
  debtToEquityRatio: number;
  /** Total liabilities normalized into the calculation currency. */
  liabilitiesNormalized: number;
  /** Stockholders' equity normalized into the calculation currency. */
  equityNormalized: number;
  /** Currency used for the division (liabilities currency). */
  calcCurrency: SupportedCurrency;
  formattedRatio: string;
}

export type DebtToEquityFieldErrors = {
  totalLiabilities?: string;
  stockholdersEquity?: string;
  form?: string;
};

export function createDefaultInput(): DebtToEquityInput {
  return {
    totalLiabilities: '',
    totalLiabilitiesCurrency: 'PKR',
    stockholdersEquity: '',
    stockholdersEquityCurrency: 'PKR',
  };
}
