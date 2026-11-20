import type { SupportedCurrency } from '@/tools/shared/currency';

export type AccrualRatioMethod = 'balanceSheet' | 'cashFlow';

export type AccrualRatioStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'zeroDenominator'
  | 'negativeDenominator';

export interface AccrualRatioInput {
  method: AccrualRatioMethod;
  beginningOperatingAssets: string;
  beginningOperatingLiabilities: string;
  endingOperatingAssets: string;
  endingOperatingLiabilities: string;
  netIncome: string;
  operatingCashFlow: string;
  currency: SupportedCurrency;
}

export interface AccrualRatioResult {
  method: AccrualRatioMethod;
  beginningNOA: number;
  endingNOA: number;
  averageNOA: number;
  changeInNOA: number;
  cashFlowAccruals: number | null;
  /** Decimal ratio (e.g. 0.153846). Null when unavailable. */
  accrualRatio: number | null;
  /** Percentage (e.g. 15.3846). Null when unavailable. */
  accrualRatioPercent: number | null;
  status: AccrualRatioStatus;
  warningMessage: string | null;
  interpretation: string;
  currency: SupportedCurrency;
  formattedBeginningNOA: string;
  formattedEndingNOA: string;
  formattedAverageNOA: string;
  formattedChangeInNOA: string;
  formattedCashFlowAccruals: string | null;
  formattedAccrualRatioPercent: string | null;
  formattedNetIncome: string | null;
  formattedOperatingCashFlow: string | null;
}

export type AccrualRatioFieldErrors = {
  beginningOperatingAssets?: string;
  beginningOperatingLiabilities?: string;
  endingOperatingAssets?: string;
  endingOperatingLiabilities?: string;
  netIncome?: string;
  operatingCashFlow?: string;
  form?: string;
};

export function createDefaultInput(): AccrualRatioInput {
  return {
    method: 'balanceSheet',
    beginningOperatingAssets: '',
    beginningOperatingLiabilities: '',
    endingOperatingAssets: '',
    endingOperatingLiabilities: '',
    netIncome: '',
    operatingCashFlow: '',
    currency: 'PKR',
  };
}
