import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { WebsiteAdRevenueResult } from './types';

/** Page Views = Visits × Page Views per Visit */
export function calculatePageViews(
  visits: number,
  pageViewsPerVisit: number
): number | null {
  if (!Number.isFinite(visits) || !Number.isFinite(pageViewsPerVisit)) return null;
  if (visits < 0 || pageViewsPerVisit < 0) return null;
  const pageViews = visits * pageViewsPerVisit;
  return Number.isFinite(pageViews) ? pageViews : null;
}

/** Revenue = (Page Views / 1000) × Page RPM */
export function calculateRevenue(pageViews: number, pageRpm: number): number | null {
  if (!Number.isFinite(pageViews) || !Number.isFinite(pageRpm)) return null;
  if (pageViews < 0 || pageRpm < 0) return null;
  const revenue = (pageViews / 1000) * pageRpm;
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

export function buildWebsiteAdRevenueResult(
  visits: number,
  pageViewsPerVisit: number,
  pageRpm: number,
  currency: SupportedCurrency
): WebsiteAdRevenueResult {
  const pageViews = calculatePageViews(visits, pageViewsPerVisit);
  const revenue = pageViews === null ? null : calculateRevenue(pageViews, pageRpm);

  return {
    pageViews,
    revenue,
    pageViewsDisplay: pageViews === null ? '' : formatPlainNumber(pageViews),
    revenueDisplay: revenue === null ? '' : formatMoney(revenue, currency),
    currency,
  };
}
