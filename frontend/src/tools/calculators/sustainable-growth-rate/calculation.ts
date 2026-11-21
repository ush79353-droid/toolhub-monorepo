import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function calculateAverageEquity(
  beginning: number,
  ending: number
): number | null {
  if (!Number.isFinite(beginning) || !Number.isFinite(ending)) return null;
  const avg = (beginning + ending) / 2;
  return Number.isFinite(avg) ? avg : null;
}

/**
 * Retention % = (NI − D) / NI × 100 when NI ≠ 0
 * Dividends must be ≥ 0.
 */
export function calculateRetentionRatio(
  netIncome: number,
  dividendsPaid: number
): {
  retainedEarnings: number;
  retentionRatioPercent: number;
} | null {
  if (!Number.isFinite(netIncome) || !Number.isFinite(dividendsPaid)) {
    return null;
  }
  if (dividendsPaid < 0) return null;
  if (netIncome === 0) return null;
  const retainedEarnings = netIncome - dividendsPaid;
  const retentionRatioPercent = (retainedEarnings / netIncome) * 100;
  if (
    !Number.isFinite(retainedEarnings) ||
    !Number.isFinite(retentionRatioPercent)
  ) {
    return null;
  }
  return { retainedEarnings, retentionRatioPercent };
}

/** ROE % = NI / Equity × 100 when Equity > 0 */
export function calculateRoe(
  netIncome: number,
  shareholdersEquity: number
): number | null {
  if (!Number.isFinite(netIncome) || !Number.isFinite(shareholdersEquity)) {
    return null;
  }
  if (shareholdersEquity <= 0) return null;
  const roe = (netIncome / shareholdersEquity) * 100;
  return Number.isFinite(roe) ? roe : null;
}

/**
 * SGR % = (ROE% × retention%) / 100
 * Equivalent to ROE_decimal × b_decimal × 100.
 */
export function calculateSustainableGrowthRate(
  roePercent: number,
  retentionRatioPercent: number
): number | null {
  if (!Number.isFinite(roePercent) || !Number.isFinite(retentionRatioPercent)) {
    return null;
  }
  const sgr = (roePercent * retentionRatioPercent) / 100;
  return Number.isFinite(sgr) ? sgr : null;
}

export function formatSgrMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatSgrPercent(value: number, digits = 2): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}%`;
}

export function interpretSgr(sgrPercent: number): string {
  if (!Number.isFinite(sgrPercent)) {
    return 'Sustainable growth rate is unavailable.';
  }
  if (sgrPercent > 0) {
    return 'The simplified model indicates a positive sustainable growth capacity under the assumed profitability and payout policies. This is a planning estimate, not a guaranteed future growth forecast.';
  }
  if (sgrPercent === 0 || Math.abs(sgrPercent) < 1e-12) {
    return 'The company has no positive sustainable growth capacity under the selected assumptions (for example, full payout or zero ROE).';
  }
  return 'The model produces a negative sustainable growth rate, which may reflect losses, distributions exceeding earnings, or other conditions requiring closer financial analysis — not automatically insolvency.';
}
