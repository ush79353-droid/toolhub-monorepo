import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Average Equity = (Beginning + Ending) / 2
 * Average may be negative; must not be zero.
 */
export function calculateAverageEquity(
  beginningEquity: number,
  endingEquity: number
): number | null {
  if (!Number.isFinite(beginningEquity) || !Number.isFinite(endingEquity)) {
    return null;
  }
  const avg = (beginningEquity + endingEquity) / 2;
  if (!Number.isFinite(avg) || avg === 0) return null;
  return avg;
}

/**
 * ROE = (Net Profit / Shareholders' Equity) × 100
 * Equity may be negative; must not be zero.
 */
export function calculateROE(
  netProfit: number,
  shareholdersEquity: number
): {
  roePercentage: number;
  returnPerEquityUnit: number;
  hasNegativeEquity: boolean;
} | null {
  if (!Number.isFinite(netProfit)) return null;
  if (!Number.isFinite(shareholdersEquity) || shareholdersEquity === 0) {
    return null;
  }
  const returnPerEquityUnit = netProfit / shareholdersEquity;
  if (!Number.isFinite(returnPerEquityUnit)) return null;
  const roePercentage = returnPerEquityUnit * 100;
  if (!Number.isFinite(roePercentage)) return null;
  return {
    roePercentage,
    returnPerEquityUnit,
    hasNegativeEquity: shareholdersEquity < 0,
  };
}

export function formatRoeMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatRoePercent(value: number, digits = 2): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}%`;
}

export function explainReturnPerEquity(
  returnPerEquityUnit: number,
  currency: SupportedCurrency
): string {
  const symbol = getCurrencySymbol(currency);
  const perUnit = formatRoeMoney(returnPerEquityUnit, currency);
  if (returnPerEquityUnit < 0) {
    return `For every ${symbol}1 of shareholders' equity, the company generated approximately ${symbol}${perUnit} in net profit (a loss relative to equity).`;
  }
  if (returnPerEquityUnit === 0) {
    return `For every ${symbol}1 of shareholders' equity, the company generated no net profit during the measured period.`;
  }
  return `For every ${symbol}1 of shareholders' equity, the company generated approximately ${symbol}${perUnit} in net profit.`;
}

export function interpretROE(
  roePercentage: number,
  hasNegativeEquity: boolean
): string {
  if (!Number.isFinite(roePercentage)) {
    return 'Return on equity is unavailable.';
  }
  if (hasNegativeEquity) {
    return "Shareholders' equity is negative, so the standard interpretation of ROE may not apply. Do not compare this result directly with conventional positive-equity ROE ratios.";
  }
  if (roePercentage > 0 && roePercentage < 25) {
    return 'Positive ROE: the company generated positive profit relative to its shareholders\' equity. Compare with industry peers and multi-period trends.';
  }
  if (roePercentage >= 25) {
    return 'A relatively high ROE can indicate strong profitability, but it may also reflect significant financial leverage or a comparatively small equity base. Context still matters.';
  }
  if (roePercentage === 0 || Math.abs(roePercentage) < 1e-12) {
    return 'Zero ROE: the company reported no net profit during the measured period relative to its shareholders\' equity.';
  }
  return 'Negative ROE: the company incurred a net loss relative to its shareholders\' equity.';
}
