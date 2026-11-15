import type { SupportedCurrency } from '@/tools/shared/currency';

/**
 * No verified Bitcoin-ETF expense-ratio catalog exists in-repo yet.
 * Only a Custom option is offered so users enter expense ratio manually.
 * Do not invent ticker expense ratios here.
 */
export const BITCOIN_ETF_OPTIONS = [
  { id: 'custom', label: 'Custom (manual expense ratio)', expenseRatioPercent: null },
] as const;

export type BitcoinEtfId = (typeof BITCOIN_ETF_OPTIONS)[number]['id'] | '';

export interface BitcoinEtfInput {
  etfId: BitcoinEtfId;
  investmentAmount: string;
  durationYears: string;
  expenseRatio: string;
  otherCosts: string;
  expectedReturn: string;
  currency: SupportedCurrency;
}

export interface BitcoinEtfResult {
  effectiveReturnPercent: number;
  futureValue: number;
  totalCost: number;
  netInvested: number;
  formattedEffectiveReturn: string;
  formattedFutureValue: string;
  formattedTotalCost: string;
}

export type BitcoinEtfFieldErrors = {
  etfId?: string;
  investmentAmount?: string;
  durationYears?: string;
  expenseRatio?: string;
  otherCosts?: string;
  expectedReturn?: string;
  form?: string;
};

export function createDefaultInput(): BitcoinEtfInput {
  return {
    etfId: '',
    investmentAmount: '',
    durationYears: '',
    expenseRatio: '',
    otherCosts: '0.00',
    expectedReturn: '10',
    currency: 'PKR',
  };
}
