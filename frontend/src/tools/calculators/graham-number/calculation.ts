import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export const GRAHAM_MULTIPLIER = 22.5;

export type ValuationStatus = 'below' | 'above' | 'equal';

export interface GrahamMathInput {
  earningsPerShare: number;
  bookValuePerShare: number;
  currentPrice?: number;
}

export interface GrahamMathResult {
  grahamNumber: number;
  valuationStatus?: ValuationStatus;
  priceDifferencePercentage?: number;
  upsidePercentage?: number;
}

export interface DerivedEpsInput {
  netIncome: number;
  preferredDividends: number;
  weightedShares: number;
}

export interface DerivedBvpsInput {
  totalEquity: number;
  preferredEquity: number;
  commonShares: number;
}

/**
 * GN = √(22.5 × EPS × BVPS)
 */
export function calculateGrahamNumber(
  input: GrahamMathInput
): GrahamMathResult | null {
  const { earningsPerShare, bookValuePerShare, currentPrice } = input;

  if (
    !Number.isFinite(earningsPerShare) ||
    !Number.isFinite(bookValuePerShare)
  ) {
    return null;
  }
  if (earningsPerShare <= 0 || bookValuePerShare <= 0) return null;

  const radicand =
    GRAHAM_MULTIPLIER * earningsPerShare * bookValuePerShare;
  if (!Number.isFinite(radicand) || radicand < 0) return null;

  const grahamNumber = Math.sqrt(radicand);
  if (!Number.isFinite(grahamNumber)) return null;

  const result: GrahamMathResult = { grahamNumber };

  if (currentPrice !== undefined) {
    if (!Number.isFinite(currentPrice) || currentPrice <= 0) return null;

    const priceDifferencePercentage =
      ((grahamNumber - currentPrice) / grahamNumber) * 100;
    const upsidePercentage =
      ((grahamNumber - currentPrice) / currentPrice) * 100;

    if (
      !Number.isFinite(priceDifferencePercentage) ||
      !Number.isFinite(upsidePercentage)
    ) {
      return null;
    }

    const tolerance =
      1e-10 * Math.max(Math.abs(grahamNumber), Math.abs(currentPrice));
    const difference = grahamNumber - currentPrice;

    result.valuationStatus =
      Math.abs(difference) <= tolerance
        ? 'equal'
        : difference > 0
          ? 'below'
          : 'above';
    result.priceDifferencePercentage = priceDifferencePercentage;
    result.upsidePercentage = upsidePercentage;
  }

  return result;
}

export function calculateDerivedEps(
  input: DerivedEpsInput
): number | null {
  const { netIncome, preferredDividends, weightedShares } = input;
  if (
    !Number.isFinite(netIncome) ||
    !Number.isFinite(preferredDividends) ||
    !Number.isFinite(weightedShares)
  ) {
    return null;
  }
  if (preferredDividends < 0) return null;
  if (!(weightedShares > 0)) return null;
  const eps = (netIncome - preferredDividends) / weightedShares;
  return Number.isFinite(eps) ? eps : null;
}

export function calculateDerivedBvps(
  input: DerivedBvpsInput
): number | null {
  const { totalEquity, preferredEquity, commonShares } = input;
  if (
    !Number.isFinite(totalEquity) ||
    !Number.isFinite(preferredEquity) ||
    !Number.isFinite(commonShares)
  ) {
    return null;
  }
  if (preferredEquity < 0) return null;
  if (!(commonShares > 0)) return null;
  const bvps = (totalEquity - preferredEquity) / commonShares;
  return Number.isFinite(bvps) ? bvps : null;
}

export function formatGrahamMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatGrahamPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function valuationLabel(status: ValuationStatus): string {
  if (status === 'below') return 'Below Graham Number';
  if (status === 'above') return 'Above Graham Number';
  return 'At Graham Number';
}

export function interpretGraham(
  grahamNumber: number,
  symbol: string,
  currency: SupportedCurrency,
  status: ValuationStatus | null
): string {
  const gn = `${symbol}${formatGrahamMoney(grahamNumber, currency)}`;
  if (status === 'below') {
    return `Graham Number is ${gn} per share. The market price is below this screening level (potentially undervalued according to the Graham Number; not a guarantee).`;
  }
  if (status === 'above') {
    return `Graham Number is ${gn} per share. The market price is trading above its Graham Number.`;
  }
  if (status === 'equal') {
    return `Graham Number is ${gn} per share. The market price is trading approximately at its Graham Number.`;
  }
  return `Graham Number is ${gn} per share using √(22.5 × EPS × BVPS). Enter a current price to compare.`;
}
