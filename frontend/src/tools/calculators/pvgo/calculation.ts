import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { PvgoResult } from './types';

/** EPS = Earnings / Number of Shares Outstanding */
export function calculateEps(earnings: number, sharesOutstanding: number): number | null {
  if (!Number.isFinite(earnings) || !Number.isFinite(sharesOutstanding)) return null;
  if (sharesOutstanding <= 0) return null;
  const eps = earnings / sharesOutstanding;
  return Number.isFinite(eps) ? eps : null;
}

/**
 * PVGO = Share Price − (EPS / (Cost of Equity / 100))
 * Cost of equity is entered as a percent (e.g. 10 for 10%).
 */
export function calculatePvgo(
  sharePrice: number,
  eps: number,
  costOfEquityPercent: number
): number | null {
  if (
    !Number.isFinite(sharePrice) ||
    !Number.isFinite(eps) ||
    !Number.isFinite(costOfEquityPercent)
  ) {
    return null;
  }
  if (costOfEquityPercent <= 0) return null;
  const noGrowthValue = eps / (costOfEquityPercent / 100);
  if (!Number.isFinite(noGrowthValue)) return null;
  const pvgo = sharePrice - noGrowthValue;
  return Number.isFinite(pvgo) ? pvgo : null;
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function buildPvgoResult(
  earnings: number,
  sharesOutstanding: number,
  sharePrice: number,
  costOfEquityPercent: number,
  currency: SupportedCurrency
): PvgoResult {
  const eps = calculateEps(earnings, sharesOutstanding);
  const pvgo = eps === null ? null : calculatePvgo(sharePrice, eps, costOfEquityPercent);

  return {
    eps,
    pvgo,
    epsDisplay: eps === null ? '' : formatMoney(eps, currency),
    pvgoDisplay: pvgo === null ? '' : formatMoney(pvgo, currency),
    currency,
  };
}
