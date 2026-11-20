import type { SupportedCurrency } from '@/tools/shared/currency';

export type ValuationStatus = 'below' | 'above' | 'equal';

export interface GrahamNumberInput {
  bookValuePerShare: string;
  earningsPerShare: string;
  currentPrice: string;
  /** Derived EPS helper (optional; not applied until user clicks Apply) */
  netIncome: string;
  preferredDividends: string;
  weightedShares: string;
  /** Derived BVPS helper */
  totalEquity: string;
  preferredEquity: string;
  commonShares: string;
  currency: SupportedCurrency;
  helperOpen: boolean;
}

export interface GrahamNumberResult {
  grahamNumber: number;
  currency: SupportedCurrency;
  formattedGrahamNumber: string;
  valuationStatus: ValuationStatus | null;
  valuationLabel: string | null;
  priceDifferencePercentage: number | null;
  formattedPriceDifference: string | null;
  upsidePercentage: number | null;
  formattedUpside: string | null;
  interpretation: string;
  warningMessage: string | null;
}

export type GrahamNumberFieldErrors = {
  form?: string;
  bookValuePerShare?: string;
  earningsPerShare?: string;
  currentPrice?: string;
  netIncome?: string;
  preferredDividends?: string;
  weightedShares?: string;
  totalEquity?: string;
  preferredEquity?: string;
  commonShares?: string;
  derivedEps?: string;
  derivedBvps?: string;
};

/** Reference: EPS $5 · BVPS $20 → GN ≈ $47.43; price $40 → below */
export function createDefaultInput(): GrahamNumberInput {
  return {
    bookValuePerShare: '20',
    earningsPerShare: '5',
    currentPrice: '40',
    netIncome: '',
    preferredDividends: '',
    weightedShares: '',
    totalEquity: '',
    preferredEquity: '',
    commonShares: '',
    currency: 'PKR',
    helperOpen: false,
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): GrahamNumberInput {
  return {
    bookValuePerShare: '',
    earningsPerShare: '',
    currentPrice: '',
    netIncome: '',
    preferredDividends: '',
    weightedShares: '',
    totalEquity: '',
    preferredEquity: '',
    commonShares: '',
    currency,
    helperOpen: false,
  };
}
