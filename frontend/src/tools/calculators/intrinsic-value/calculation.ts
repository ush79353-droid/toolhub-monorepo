import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Historical no-growth P/E base in the Graham formula */
export const GRAHAM_BASE_PE = 8.5;
/** Historical benchmark bond yield used as the numerator adjustment */
export const GRAHAM_BENCHMARK_YIELD = 4.4;

export type ValuationStatus = 'below' | 'above' | 'equal';

export interface IntrinsicValueMathInput {
  earningsPerShare: number;
  /** Growth in percentage points (5 means 5%) */
  expectedGrowthRate: number;
  /** Bond yield in percentage points (4.4 means 4.4%) */
  corporateBondYield: number;
  currentMarketPrice?: number;
}

export interface IntrinsicValueMathResult {
  intrinsicValue: number;
  marginOfSafety?: number;
  valuationStatus?: ValuationStatus;
}

/**
 * V = EPS × (8.5 + 2g) × 4.4 / Y
 * g and Y are percentage points (not decimals).
 */
export function calculateIntrinsicValue(
  input: IntrinsicValueMathInput
): IntrinsicValueMathResult | null {
  const {
    earningsPerShare,
    expectedGrowthRate,
    corporateBondYield,
    currentMarketPrice,
  } = input;

  if (!Number.isFinite(earningsPerShare) || earningsPerShare <= 0) {
    return null;
  }
  if (!Number.isFinite(expectedGrowthRate)) return null;

  const multiplier = GRAHAM_BASE_PE + 2 * expectedGrowthRate;
  if (multiplier < 0) return null;

  if (!Number.isFinite(corporateBondYield) || corporateBondYield <= 0) {
    return null;
  }

  const intrinsicValue =
    (earningsPerShare * multiplier * GRAHAM_BENCHMARK_YIELD) /
    corporateBondYield;

  if (!Number.isFinite(intrinsicValue)) return null;

  const result: IntrinsicValueMathResult = { intrinsicValue };

  if (currentMarketPrice !== undefined) {
    if (!Number.isFinite(currentMarketPrice) || currentMarketPrice <= 0) {
      return null;
    }
    if (!(intrinsicValue > 0)) return null;

    const marginOfSafety =
      ((intrinsicValue - currentMarketPrice) / intrinsicValue) * 100;
    if (!Number.isFinite(marginOfSafety)) return null;

    const tolerance =
      1e-10 * Math.max(Math.abs(intrinsicValue), Math.abs(currentMarketPrice));
    const difference = intrinsicValue - currentMarketPrice;

    result.marginOfSafety = marginOfSafety;
    result.valuationStatus =
      Math.abs(difference) <= tolerance
        ? 'equal'
        : difference > 0
          ? 'below'
          : 'above';
  }

  return result;
}

export function formatIvMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatIvPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function valuationLabel(status: ValuationStatus): string {
  if (status === 'below') return 'Market price below estimated intrinsic value';
  if (status === 'above') return 'Market price above estimated intrinsic value';
  return 'Market price at estimated intrinsic value';
}

export function interpretIntrinsicValue(
  intrinsicValue: number,
  symbol: string,
  currency: SupportedCurrency,
  status: ValuationStatus | null,
  marginOfSafety: number | null
): string {
  const v = `${symbol}${formatIvMoney(intrinsicValue, currency)}`;
  if (status == null || marginOfSafety == null) {
    return `Estimated intrinsic value is ${v} per share using the adjusted Benjamin Graham formula. Enter a current market price to compute margin of safety.`;
  }
  const ms = `${formatIvPercent(marginOfSafety)}%`;
  if (status === 'below') {
    return `Estimated intrinsic value is ${v}. Margin of safety is ${ms} — the market price is below this estimate (not a guaranteed return).`;
  }
  if (status === 'above') {
    return `Estimated intrinsic value is ${v}. Margin of safety is ${ms} — the market price exceeds this estimate.`;
  }
  return `Estimated intrinsic value is ${v}. Margin of safety is ${ms} — price approximately equals the estimate.`;
}
