import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { GoogleAdsenseResult } from './types';

/** Ad Impressions = Pageviews × Ads per Page */
export function calculateImpressions(pageviews: number, adsPerPage: number): number | null {
  if (!Number.isFinite(pageviews) || !Number.isFinite(adsPerPage)) return null;
  if (pageviews < 0 || adsPerPage < 0) return null;
  const impressions = pageviews * adsPerPage;
  return Number.isFinite(impressions) ? impressions : null;
}

/** Number of Clicks = Ad Impressions × (CTR / 100) */
export function calculateClicks(impressions: number, ctrPercent: number): number | null {
  if (!Number.isFinite(impressions) || !Number.isFinite(ctrPercent)) return null;
  if (impressions < 0 || ctrPercent < 0 || ctrPercent > 100) return null;
  const clicks = impressions * (ctrPercent / 100);
  return Number.isFinite(clicks) ? clicks : null;
}

/** Google AdSense Revenue = Number of Clicks × CPC */
export function calculateRevenue(clicks: number, cpc: number): number | null {
  if (!Number.isFinite(clicks) || !Number.isFinite(cpc)) return null;
  if (clicks < 0 || cpc < 0) return null;
  const revenue = clicks * cpc;
  return Number.isFinite(revenue) ? revenue : null;
}

export function formatPlainNumber(value: number): string {
  return Number(value.toFixed(4)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function buildGoogleAdsenseResult(
  pageviews: number,
  adsPerPage: number,
  ctrPercent: number,
  cpc: number,
  currency: SupportedCurrency
): GoogleAdsenseResult {
  const impressions = calculateImpressions(pageviews, adsPerPage);
  const clicks =
    impressions === null ? null : calculateClicks(impressions, ctrPercent);
  const revenue = clicks === null ? null : calculateRevenue(clicks, cpc);

  return {
    impressions,
    clicks,
    revenue,
    impressionsDisplay: impressions === null ? '' : formatPlainNumber(impressions),
    clicksDisplay: clicks === null ? '' : formatPlainNumber(clicks),
    revenueDisplay: revenue === null ? '' : formatMoney(revenue, currency),
    currency,
  };
}
