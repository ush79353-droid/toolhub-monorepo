import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  DAYS_PER_YEAR,
  WEEKS_PER_YEAR,
  type Period,
  type YoutubeMoneyResult,
} from './types';

/** Convert a per-period amount into an equivalent yearly amount. */
export function toYearly(amount: number, period: Period): number {
  switch (period) {
    case 'day':
      return amount * DAYS_PER_YEAR;
    case 'week':
      return amount * WEEKS_PER_YEAR;
    case 'month':
      return amount * 12;
    case 'year':
      return amount;
  }
}

/** Convert an amount from one recurring period into another. */
export function convertPeriod(amount: number, from: Period, to: Period): number {
  if (from === to) return amount;
  return toYearly(amount, from) / toYearly(1, to);
}

/**
 * Gross revenue = (views / 1000) × RPM for the views' period, then scaled to the
 * requested output period. Net equals gross when no separate deduction exists
 * (creator RPM already reflects platform revenue sharing).
 */
export function calculateYoutubeMoney(
  rpm: number,
  views: number,
  viewsPeriod: Period,
  grossPeriod: Period,
  netPeriod: Period,
  currency: SupportedCurrency
): YoutubeMoneyResult | null {
  if (![rpm, views].every(Number.isFinite)) return null;
  if (rpm < 0 || views < 0) return null;

  const viewsForGross = convertPeriod(views, viewsPeriod, grossPeriod);
  const viewsForNet = convertPeriod(views, viewsPeriod, netPeriod);
  const grossRevenue = (viewsForGross / 1000) * rpm;
  const netRevenue = (viewsForNet / 1000) * rpm;

  if (![viewsForGross, viewsForNet, grossRevenue, netRevenue].every(Number.isFinite)) {
    return null;
  }

  const digits = getCurrencyFractionDigits(currency);
  const formatMoney = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(amount);

  return {
    rpm,
    views,
    viewsPeriod,
    grossPeriod,
    netPeriod,
    currency,
    grossRevenue,
    netRevenue,
    formattedGrossRevenue: formatMoney(grossRevenue),
    formattedNetRevenue: formatMoney(netRevenue),
  };
}
