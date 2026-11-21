import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export interface EpsMathInput {
  netIncome: number;
  preferredDividends: number;
  commonShares: number;
}

export interface EpsMathResult {
  earningsAvailableToCommon: number;
  earningsPerShare: number;
}

/**
 * Basic EPS = (Net Income − Preferred Dividends) / Weighted-Average Common Shares
 */
export function calculateEps(input: EpsMathInput): EpsMathResult | null {
  const { netIncome, preferredDividends, commonShares } = input;

  if (
    !Number.isFinite(netIncome) ||
    !Number.isFinite(preferredDividends) ||
    !Number.isFinite(commonShares)
  ) {
    return null;
  }
  if (preferredDividends < 0) return null;
  if (!(commonShares > 0)) return null;

  const earningsAvailableToCommon = netIncome - preferredDividends;
  const earningsPerShare = earningsAvailableToCommon / commonShares;

  if (
    !Number.isFinite(earningsAvailableToCommon) ||
    !Number.isFinite(earningsPerShare)
  ) {
    return null;
  }

  return { earningsAvailableToCommon, earningsPerShare };
}

export function formatEpsMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatEpsPerShare(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: Math.max(digits, 4),
  }).format(amount);
}

export function formatShareCount(shares: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(shares);
}

export function interpretEps(
  eps: number,
  currency: SupportedCurrency,
  symbol: string
): string {
  const formatted = `${symbol}${formatEpsPerShare(eps, currency)}`;
  if (eps < 0) {
    return `Basic EPS is ${formatted} per share: a loss attributable to common shareholders. This calculator reports basic EPS, not diluted EPS.`;
  }
  if (eps === 0) {
    return 'Basic EPS is zero for this period after preferred dividends.';
  }
  return `Basic EPS is ${formatted} per weighted-average common share. EPS is an accounting profitability measure, not cash paid to shareholders.`;
}
