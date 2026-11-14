import type { SupportedCurrency } from '@/tools/shared/currency';

export interface WebsiteAdRevenueInput {
  visits: number;
  pageViewsPerVisit: number;
  pageRpm: number;
  currency: SupportedCurrency;
}

export interface WebsiteAdRevenueResult {
  pageViews: number | null;
  revenue: number | null;
  pageViewsDisplay: string;
  revenueDisplay: string;
  currency: SupportedCurrency;
}

export type WebsiteAdRevenueFieldErrors = Record<string, string>;

export function createDefaultInput(): WebsiteAdRevenueInput {
  return {
    visits: Number.NaN,
    pageViewsPerVisit: Number.NaN,
    pageRpm: Number.NaN,
    currency: 'PKR',
  };
}
