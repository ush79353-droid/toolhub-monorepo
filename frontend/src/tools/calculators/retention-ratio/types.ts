import type { SupportedCurrency } from '@/tools/shared/currency';

export type RetentionStatus =
  | 'valid'
  | 'undefined'
  | 'negative-income'
  | 'missing'
  | 'invalid';

export interface RetentionRatioInput {
  netIncome: string;
  dividendsPaid: string;
  currency: SupportedCurrency;
}

export interface RetentionRatioResult {
  retainedEarnings: number | null;
  retentionRatioPercent: number | null;
  dividendPayoutRatio: number | null;
  status: RetentionStatus;
  currency: SupportedCurrency;
  formattedRetainedEarnings: string | null;
  formattedRetentionRatio: string | null;
  formattedPayoutRatio: string | null;
  interpretation: string | null;
  unavailableReason: string | null;
  warningMessage: string | null;
}

export type RetentionRatioFieldErrors = {
  form?: string;
  netIncome?: string;
  dividendsPaid?: string;
};

/** Reference: NI 1,000,000 · Div 350,000 → RE 650,000 · retention 65% */
export function createDefaultInput(): RetentionRatioInput {
  return {
    netIncome: '1000000',
    dividendsPaid: '350000',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): RetentionRatioInput {
  return {
    netIncome: '',
    dividendsPaid: '',
    currency,
  };
}
