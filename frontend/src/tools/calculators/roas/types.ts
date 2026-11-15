import type { SupportedCurrency } from '@/tools/shared/currency';

export type KnowRevenue = 'yes' | 'no';

export interface RoasInput {
  adSpend: string;
  knowRevenue: KnowRevenue;
  adRevenue: string;
  roiOpen: boolean;
  currency: SupportedCurrency;
}

export interface RoasResult {
  adSpend: number;
  adRevenue: number;
  roasPercent: number;
  roasRatio: number;
  adOnlyRoiPercent: number;
  currency: SupportedCurrency;
  formattedRoasPercent: string;
  formattedRoasRatio: string;
  formattedAdOnlyRoiPercent: string;
}

export type RoasFieldErrors = {
  adSpend?: string;
  adRevenue?: string;
  form?: string;
};

export function createDefaultInput(): RoasInput {
  return {
    adSpend: '',
    knowRevenue: 'yes',
    adRevenue: '',
    roiOpen: false,
    currency: 'PKR',
  };
}
