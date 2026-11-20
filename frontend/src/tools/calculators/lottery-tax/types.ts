import type { SupportedCurrency } from '@/tools/shared/currency';

export type LotteryTaxMode = 'us' | 'custom';

export interface LotteryTaxDraft {
  annuityPayout: string;
  annuityCurrency: SupportedCurrency;
  lumpSumPercent: string;
  lumpSumCurrency: SupportedCurrency;
  taxMode: LotteryTaxMode;
  taxRateI: string;
  taxRateII: string;
  /** Annuity setup (collapsed by default). */
  years: string;
  growthPercent: string;
  setupOpen: boolean;
  resultsOpen: boolean;
  scheduleOpen: boolean;
}

export interface LotteryTaxScheduleRow {
  year: number;
  gross: number;
  taxI: number;
  taxII: number;
  net: number;
  formattedGross: string;
  formattedTaxI: string;
  formattedTaxII: string;
  formattedNet: string;
}

export interface LotteryTaxColumn {
  payout: number;
  taxI: number;
  taxII: number;
  net: number;
  formattedPayout: string;
  formattedTaxI: string;
  formattedTaxII: string;
  formattedNet: string;
}

export interface LotteryTaxResult {
  lumpSum: LotteryTaxColumn;
  annuity: LotteryTaxColumn;
  difference: LotteryTaxColumn;
  schedule: LotteryTaxScheduleRow[];
  years: number;
  growthPercent: number;
  lumpSumPercent: number;
  taxMode: LotteryTaxMode;
  effectiveTaxRateI: number;
  effectiveTaxRateII: number;
  calcCurrency: SupportedCurrency;
  lumpSumCurrency: SupportedCurrency;
  annuityCurrency: SupportedCurrency;
  usTaxNote: string | null;
  summaryText: string;
}

export type LotteryTaxFieldErrors = {
  annuityPayout?: string;
  lumpSumPercent?: string;
  taxRateI?: string;
  taxRateII?: string;
  years?: string;
  growthPercent?: string;
  form?: string;
};

export function createDefaultDraft(): LotteryTaxDraft {
  return {
    annuityPayout: '1,200,000,000',
    annuityCurrency: 'PKR',
    lumpSumPercent: '52',
    lumpSumCurrency: 'PKR',
    taxMode: 'custom',
    taxRateI: '0',
    taxRateII: '0',
    years: '30',
    growthPercent: '5',
    setupOpen: false,
    resultsOpen: true,
    scheduleOpen: true,
  };
}
