import type { SupportedCurrency } from '@/tools/shared/currency';

export interface ReturnOnEquityInput {
  netProfit: string;
  shareholdersEquity: string;
  useAverageEquity: boolean;
  beginningEquity: string;
  endingEquity: string;
  currency: SupportedCurrency;
}

export interface ReturnOnEquityResult {
  roePercentage: number;
  returnPerEquityUnit: number;
  equityBase: number;
  usedAverageEquity: boolean;
  hasNegativeEquity: boolean;
  currency: SupportedCurrency;
  formattedRoe: string;
  formattedEquityBase: string;
  interpretation: string;
  explanation: string;
  warningMessage: string | null;
}

export type ReturnOnEquityFieldErrors = {
  form?: string;
  netProfit?: string;
  shareholdersEquity?: string;
  beginningEquity?: string;
  endingEquity?: string;
};

/** Reference: NP 35,000 · Equity 450,000 → ROE ≈ 7.78% */
export function createDefaultInput(): ReturnOnEquityInput {
  return {
    netProfit: '35000',
    shareholdersEquity: '450000',
    useAverageEquity: false,
    beginningEquity: '400000',
    endingEquity: '500000',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): ReturnOnEquityInput {
  return {
    netProfit: '',
    shareholdersEquity: '',
    useAverageEquity: false,
    beginningEquity: '',
    endingEquity: '',
    currency,
  };
}
