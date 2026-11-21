import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Dividends = Earnings × (Payout% / 100).
 * Requires earnings > 0 and payout ≥ 0 (payout may exceed 100).
 */
export function calculateDividendsDistributed(
  earnings: number,
  payoutRatioPercent: number
): number | null {
  if (
    !Number.isFinite(earnings) ||
    !Number.isFinite(payoutRatioPercent) ||
    earnings <= 0 ||
    payoutRatioPercent < 0
  ) {
    return null;
  }
  const dividends = earnings * (payoutRatioPercent / 100);
  return Number.isFinite(dividends) ? dividends : null;
}

/** Current-period RE = Earnings − Dividends. Dividends ≥ 0. */
export function calculateRetainedEarnings(
  earnings: number,
  dividends: number
): number | null {
  if (
    !Number.isFinite(earnings) ||
    !Number.isFinite(dividends) ||
    dividends < 0
  ) {
    return null;
  }
  const result = earnings - dividends;
  return Number.isFinite(result) ? result : null;
}

/** Retention ratio as percent: 100 − payout%. */
export function calculateRetentionRatioPercent(
  payoutRatioPercent: number
): number | null {
  if (!Number.isFinite(payoutRatioPercent) || payoutRatioPercent < 0) {
    return null;
  }
  const retention = 100 - payoutRatioPercent;
  return Number.isFinite(retention) ? retention : null;
}

/** REPS = RE ÷ shares. Shares must be positive integers. */
export function calculateRetainedEarningsPerShare(
  retainedEarnings: number,
  sharesOutstanding: number
): number | null {
  if (
    !Number.isFinite(retainedEarnings) ||
    !Number.isFinite(sharesOutstanding) ||
    sharesOutstanding <= 0 ||
    !Number.isInteger(sharesOutstanding)
  ) {
    return null;
  }
  const result = retainedEarnings / sharesOutstanding;
  return Number.isFinite(result) ? result : null;
}

export function formatReMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatRePercent(percent: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(percent);
}

export function formatReShares(shares: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(shares);
}

export function interpretRetainedEarnings(
  earnings: number,
  dividends: number,
  retainedEarnings: number,
  reps: number | null
): string {
  const parts = [
    `Current-period retained earnings are ${formatPlain(retainedEarnings)} after distributing ${formatPlain(dividends)} of ${formatPlain(earnings)} in earnings.`,
  ];
  if (reps !== null) {
    parts.push(
      `That equals ${formatPlain(reps)} per outstanding share for this period.`
    );
  }
  parts.push(
    'This is the period contribution to retained earnings; not the cumulative balance-sheet RE without beginning RE. It is not EPS or cash on hand.'
  );
  return parts.join(' ');
}

function formatPlain(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
