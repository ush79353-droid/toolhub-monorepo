import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { PeStatus } from './types';

/**
 * EPS = (Net Income − Preferred Dividends) / Weighted-Average Shares
 */
export function calculateEps(
  netIncome: number,
  preferredDividends: number,
  weightedAverageShares: number
): number | null {
  if (!Number.isFinite(netIncome)) return null;
  if (!Number.isFinite(preferredDividends) || preferredDividends < 0) {
    return null;
  }
  if (
    !Number.isFinite(weightedAverageShares) ||
    weightedAverageShares <= 0
  ) {
    return null;
  }
  const eps = (netIncome - preferredDividends) / weightedAverageShares;
  return Number.isFinite(eps) ? eps : null;
}

export interface PeMathResult {
  peRatio: number | null;
  status: PeStatus;
}

/**
 * P/E = Price / EPS when EPS > 0
 */
export function calculatePeRatio(
  pricePerShare: number,
  earningsPerShare: number
): PeMathResult {
  if (!Number.isFinite(pricePerShare) || pricePerShare < 0) {
    return { peRatio: null, status: 'invalid' };
  }
  if (!Number.isFinite(earningsPerShare)) {
    return { peRatio: null, status: 'invalid' };
  }
  if (earningsPerShare === 0) {
    return { peRatio: null, status: 'undefined' };
  }
  if (earningsPerShare < 0) {
    return { peRatio: null, status: 'not-meaningful' };
  }
  const peRatio = pricePerShare / earningsPerShare;
  if (!Number.isFinite(peRatio)) {
    return { peRatio: null, status: 'invalid' };
  }
  return { peRatio, status: 'valid' };
}

export function formatPeMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatRatio(value: number, digits = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function interpretPeRatio(pe: number): string {
  if (pe < 10) {
    return `P/E ratio ${formatRatio(pe)}×: the market price is about ${formatRatio(pe)} times earnings per share. A relatively low multiple may reflect valuation, risk, or weaker expected growth; it is not automatically a bargain.`;
  }
  if (pe <= 20) {
    return `P/E ratio ${formatRatio(pe)}×; investors are paying about ${formatRatio(pe)} times the company's earnings per share. Compare with peers, history, and growth expectations.`;
  }
  return `P/E ratio ${formatRatio(pe)}×: the share price is about ${formatRatio(pe)} times earnings per share. A higher multiple may reflect growth expectations or other valuation factors; not an automatic buy or sell signal.`;
}
