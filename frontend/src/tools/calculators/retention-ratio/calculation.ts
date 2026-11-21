import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { RetentionStatus } from './types';

export interface RetentionMathResult {
  retainedEarnings: number;
  retentionRatioPercent: number | null;
  dividendPayoutRatio: number | null;
  status: RetentionStatus;
}

/**
 * Retained earnings (period) = Net Income − Dividends Paid
 * Retention % = (RE / NI) × 100 when NI ≠ 0
 * Equivalent: (1 − payout) × 100 when payout = Div / NI
 */
export function calculateRetentionRatio(
  netIncome: number,
  dividendsPaid: number
): RetentionMathResult | null {
  if (!Number.isFinite(netIncome) || !Number.isFinite(dividendsPaid)) {
    return null;
  }
  if (dividendsPaid < 0) return null;

  const retainedEarnings = netIncome - dividendsPaid;
  if (!Number.isFinite(retainedEarnings)) return null;

  if (netIncome === 0) {
    return {
      retainedEarnings,
      retentionRatioPercent: null,
      dividendPayoutRatio: null,
      status: 'undefined',
    };
  }

  const retentionRatioPercent = (retainedEarnings / netIncome) * 100;
  const dividendPayoutRatio = dividendsPaid / netIncome;
  if (
    !Number.isFinite(retentionRatioPercent) ||
    !Number.isFinite(dividendPayoutRatio)
  ) {
    return null;
  }

  return {
    retainedEarnings,
    retentionRatioPercent,
    dividendPayoutRatio,
    status: netIncome < 0 ? 'negative-income' : 'valid',
  };
}

export function formatRetentionMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatPercent(value: number, digits = 2): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}%`;
}

export function interpretRetentionRatio(
  retentionPercent: number,
  netIncome: number
): string {
  if (!Number.isFinite(retentionPercent)) {
    return 'Retention ratio is unavailable.';
  }
  if (netIncome < 0) {
    return `Retention ratio ${formatPercent(retentionPercent)}, with negative net income, a conventional retention-ratio interpretation is difficult and should be treated cautiously.`;
  }
  if (retentionPercent > 100) {
    return `Retention ratio ${formatPercent(retentionPercent)}; above 100% can appear when dividends are negative (unusual) or with atypical inputs; verify the figures.`;
  }
  if (retentionPercent === 100 || Math.abs(retentionPercent - 100) < 1e-9) {
    return 'Retention ratio 100.00%: the company retained all net income (no dividends paid) for the period.';
  }
  if (retentionPercent === 0 || Math.abs(retentionPercent) < 1e-9) {
    return 'Retention ratio 0.00%; all net income was paid as dividends (payout ≈ 100%).';
  }
  if (retentionPercent < 0) {
    return `Retention ratio ${formatPercent(retentionPercent)}; negative when dividends exceed positive net income (dividends funded partly from other capital or prior earnings).`;
  }
  if (retentionPercent >= 70) {
    return `Retention ratio ${formatPercent(retentionPercent)}; relatively high retention; common for growth-oriented firms that reinvest more of earnings. Not automatically “better.”`;
  }
  if (retentionPercent <= 30) {
    return `Retention ratio ${formatPercent(retentionPercent)}; relatively low retention / higher payout; common for mature dividend-focused businesses. Context still matters.`;
  }
  return `Retention ratio ${formatPercent(retentionPercent)}: a moderate share of earnings was retained after dividends. Compare with peers, growth plans, and payout policy.`;
}
