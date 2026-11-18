import type { SupportedCurrency } from '@/tools/shared/currency';

export type GpCatchUp = 'no' | 'yes';

export interface CarriedInterestInput {
  initialFundValue: string;
  finalFundValue: string;
  holdPeriodYears: string;
  hurdleRatePercent: string;
  carriedInterestPercent: string;
  gpCatchUp: GpCatchUp;
  currency: SupportedCurrency;
}

export interface CarriedInterestResult {
  fundReturnPercent: number;
  totalProfit: number;
  hurdleProfit: number;
  profitAboveHurdle: number;
  gpCarriedInterestAmount: number;
  catchUpAmount: number;
  residualCarryAmount: number;
  currency: SupportedCurrency;
  formattedFundReturnPercent: string;
  formattedTotalProfit: string;
  formattedHurdleProfit: string;
  formattedProfitAboveHurdle: string;
  formattedGpCarriedInterestAmount: string;
}

export type CarriedInterestFieldErrors = {
  initialFundValue?: string;
  finalFundValue?: string;
  holdPeriodYears?: string;
  hurdleRatePercent?: string;
  carriedInterestPercent?: string;
  form?: string;
};

export function createDefaultInput(): CarriedInterestInput {
  return {
    initialFundValue: '',
    finalFundValue: '',
    holdPeriodYears: '10',
    hurdleRatePercent: '0',
    carriedInterestPercent: '20',
    gpCatchUp: 'no',
    currency: 'PKR',
  };
}
