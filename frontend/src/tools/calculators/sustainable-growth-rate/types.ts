import type { SupportedCurrency } from '@/tools/shared/currency';

export type SgrInputMode = 'build' | 'direct';

export interface SustainableGrowthRateInput {
  mode: SgrInputMode;
  netIncome: string;
  dividendsPaid: string;
  shareholdersEquity: string;
  useAverageEquity: boolean;
  beginningEquity: string;
  endingEquity: string;
  /** Direct mode: ROE % */
  roePercent: string;
  /** Direct mode: retention % */
  retentionPercent: string;
  currency: SupportedCurrency;
}

export interface SustainableGrowthRateResult {
  retainedEarnings: number | null;
  retentionRatioPercent: number;
  returnOnEquityPercent: number;
  sustainableGrowthRatePercent: number;
  equityBase: number | null;
  usedAverageEquity: boolean;
  usedDirectInputs: boolean;
  currency: SupportedCurrency;
  formattedRetainedEarnings: string | null;
  formattedRetention: string;
  formattedRoe: string;
  formattedSgr: string;
  interpretation: string;
  explanation: string;
  warningMessage: string | null;
}

export type SustainableGrowthRateFieldErrors = {
  form?: string;
  netIncome?: string;
  dividendsPaid?: string;
  shareholdersEquity?: string;
  beginningEquity?: string;
  endingEquity?: string;
  roePercent?: string;
  retentionPercent?: string;
};

/** Reference: NI 2M · Div 1M · Equity 10M → retention 50% · ROE 20% · SGR 10% */
export function createDefaultInput(): SustainableGrowthRateInput {
  return {
    mode: 'build',
    netIncome: '2000000',
    dividendsPaid: '1000000',
    shareholdersEquity: '10000000',
    useAverageEquity: false,
    beginningEquity: '9000000',
    endingEquity: '11000000',
    roePercent: '20',
    retentionPercent: '50',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): SustainableGrowthRateInput {
  return {
    mode: 'build',
    netIncome: '',
    dividendsPaid: '',
    shareholdersEquity: '',
    useAverageEquity: false,
    beginningEquity: '',
    endingEquity: '',
    roePercent: '',
    retentionPercent: '',
    currency,
  };
}
