import type { SupportedCurrency } from '@/tools/shared/currency';

export type RetainedEarningsStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'partial'
  | 'zeroEarnings'
  | 'negativeEarnings'
  | 'payoutAbove100';

export interface RetainedEarningsInput {
  earnings: string;
  dividendPayoutRatio: string;
  sharesOutstanding: string;
  currency: SupportedCurrency;
}

export interface RetainedEarningsResult {
  earnings: number;
  dividendPayoutRatio: number;
  dividendsDistributed: number;
  retainedEarnings: number;
  retentionRatio: number;
  sharesOutstanding: number | null;
  retainedEarningsPerShare: number | null;
  status: RetainedEarningsStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedEarnings: string;
  formattedPayoutRatio: string;
  formattedDividends: string;
  formattedRetainedEarnings: string;
  formattedRetentionRatio: string;
  formattedShares: string | null;
  formattedRetainedEarningsPerShare: string | null;
}

export type RetainedEarningsFieldErrors = {
  earnings?: string;
  dividendPayoutRatio?: string;
  sharesOutstanding?: string;
  form?: string;
};

export function createDefaultInput(): RetainedEarningsInput {
  return {
    earnings: '',
    dividendPayoutRatio: '',
    sharesOutstanding: '',
    currency: 'PKR',
  };
}
