import type { SupportedCurrency } from '@/tools/shared/currency';

export type LotteryTaxTreatment = 'without' | 'us' | 'custom';

export interface LotteryAnnuityInput {
  prizeAmount: string;
  prizeCurrency: SupportedCurrency;
  years: string;
  payoutGrowthPercent: string;
  rateOfReturnPercent: string;
  taxTreatment: LotteryTaxTreatment;
  /** Used only when taxTreatment === 'custom'. */
  customTaxRatePercent: string;
}

export interface LotteryAnnuityScheduleRow {
  year: number;
  payout: number;
  totalPayout: number;
  formattedPayout: string;
  formattedTotalPayout: string;
}

export interface LotteryAnnuityResult {
  firstPayout: number;
  schedule: LotteryAnnuityScheduleRow[];
  taxApplied: boolean;
  tableCaption: string;
  currency: SupportedCurrency;
}

export type LotteryAnnuityFieldErrors = {
  prizeAmount?: string;
  years?: string;
  payoutGrowthPercent?: string;
  rateOfReturnPercent?: string;
  customTaxRatePercent?: string;
  form?: string;
};

export function createDefaultInput(): LotteryAnnuityInput {
  return {
    prizeAmount: '1,000,000',
    prizeCurrency: 'PKR',
    years: '30',
    payoutGrowthPercent: '5',
    rateOfReturnPercent: '0',
    taxTreatment: 'without',
    customTaxRatePercent: '',
  };
}
