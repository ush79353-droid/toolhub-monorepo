import type { SupportedCurrency } from '@/tools/shared/currency';

export interface GoogleAdsenseInput {
  pageviews: number;
  adsPerPage: number;
  ctrPercent: number;
  cpc: number;
  currency: SupportedCurrency;
}

export interface GoogleAdsenseResult {
  impressions: number | null;
  clicks: number | null;
  revenue: number | null;
  impressionsDisplay: string;
  clicksDisplay: string;
  revenueDisplay: string;
  currency: SupportedCurrency;
}

export type GoogleAdsenseFieldErrors = Record<string, string>;

export function createDefaultInput(): GoogleAdsenseInput {
  return {
    pageviews: Number.NaN,
    adsPerPage: Number.NaN,
    ctrPercent: Number.NaN,
    cpc: Number.NaN,
    currency: 'PKR',
  };
}
