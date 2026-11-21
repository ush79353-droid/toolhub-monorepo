import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export interface NavMathInput {
  totalInvestmentValue: number;
  cashAndCashEquivalents: number;
  accountsReceivable: number;
  shortTermLiabilities: number;
  longTermLiabilities: number;
  /** Positive share count for NAV/share; null skips per-share. */
  outstandingShares: number | null;
}

export interface NavMathResult {
  fundAssets: number;
  fundLiabilities: number;
  netAssetValue: number;
  navPerShare: number | null;
}

/**
 * FA = IV + C + AR
 * FL = STL + LTL
 * NAV = FA − FL
 * NAV/share = NAV / N when N > 0
 *
 * Invalid or non-positive shares leave navPerShare null without blocking NAV.
 */
export function calculateNav(input: NavMathInput): NavMathResult | null {
  const {
    totalInvestmentValue,
    cashAndCashEquivalents,
    accountsReceivable,
    shortTermLiabilities,
    longTermLiabilities,
    outstandingShares,
  } = input;

  const amounts = [
    totalInvestmentValue,
    cashAndCashEquivalents,
    accountsReceivable,
    shortTermLiabilities,
    longTermLiabilities,
  ];

  if (amounts.some((v) => !Number.isFinite(v) || v < 0)) return null;

  const fundAssets =
    totalInvestmentValue + cashAndCashEquivalents + accountsReceivable;
  const fundLiabilities = shortTermLiabilities + longTermLiabilities;
  const netAssetValue = fundAssets - fundLiabilities;

  if (
    ![fundAssets, fundLiabilities, netAssetValue].every(Number.isFinite)
  ) {
    return null;
  }

  let navPerShare: number | null = null;
  if (
    outstandingShares !== null &&
    Number.isFinite(outstandingShares) &&
    outstandingShares > 0
  ) {
    navPerShare = netAssetValue / outstandingShares;
    if (!Number.isFinite(navPerShare)) return null;
  }

  return {
    fundAssets,
    fundLiabilities,
    netAssetValue,
    navPerShare,
  };
}

export function roundMoneyAmount(
  amount: number,
  currency: SupportedCurrency
): number {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function formatNavMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatShareCount(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
}
