import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * EPS = Net Earnings / Outstanding Shares
 */
export function calculateEps(
  netEarnings: number,
  outstandingShares: number
): number | null {
  if (!Number.isFinite(netEarnings)) return null;
  if (!Number.isFinite(outstandingShares) || outstandingShares <= 0) {
    return null;
  }
  const eps = netEarnings / outstandingShares;
  return Number.isFinite(eps) ? eps : null;
}

/**
 * P/E = Price / EPS when EPS > 0
 */
export function calculatePeRatio(
  pricePerShare: number,
  earningsPerShare: number
): number | null {
  if (!Number.isFinite(pricePerShare) || pricePerShare < 0) return null;
  if (!Number.isFinite(earningsPerShare) || earningsPerShare <= 0) return null;
  const pe = pricePerShare / earningsPerShare;
  return Number.isFinite(pe) ? pe : null;
}

/**
 * Sustainable growth % = (retention% × ROE%) / 100
 */
export function calculateEarningsGrowthPercent(
  retentionRatePercent: number,
  returnOnEquityPercent: number
): number | null {
  if (
    !Number.isFinite(retentionRatePercent) ||
    retentionRatePercent < 0 ||
    retentionRatePercent > 100
  ) {
    return null;
  }
  if (!Number.isFinite(returnOnEquityPercent)) return null;
  const g = (retentionRatePercent * returnOnEquityPercent) / 100;
  return Number.isFinite(g) ? g : null;
}

/**
 * PEG = P/E ÷ growth%  (growth as percentage points, e.g. 4.8)
 */
export function calculatePegFromPeAndGrowth(
  peRatio: number,
  earningsGrowthPercent: number
): number | null {
  if (!Number.isFinite(peRatio) || peRatio < 0) return null;
  if (!Number.isFinite(earningsGrowthPercent) || earningsGrowthPercent <= 0) {
    return null;
  }
  const peg = peRatio / earningsGrowthPercent;
  return Number.isFinite(peg) ? peg : null;
}

export function formatPegMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatRatio(value: number, digits = 4): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPercent(value: number, digits = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatShareCount(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
}
