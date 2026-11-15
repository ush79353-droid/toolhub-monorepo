import type { BetaStockResult, PricePair } from './types';
import type { SupportedCurrency } from '@/tools/shared/currency';

/** Asset/benchmark return(t) = price(t) / price(t−1) − 1 */
export function dailyReturns(prices: number[]): number[] | null {
  if (prices.length < 2) return null;
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    const prev = prices[i - 1]!;
    const curr = prices[i]!;
    if (!(prev > 0) || !(curr > 0)) return null;
    const r = curr / prev - 1;
    if (!Number.isFinite(r)) return null;
    returns.push(r);
  }
  return returns;
}

function mean(values: number[]): number {
  let sum = 0;
  for (const v of values) sum += v;
  return sum / values.length;
}

/** Sample covariance (n − 1). */
export function sampleCovariance(a: number[], b: number[]): number | null {
  if (a.length !== b.length || a.length < 2) return null;
  const ma = mean(a);
  const mb = mean(b);
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += (a[i]! - ma) * (b[i]! - mb);
  }
  const cov = sum / (a.length - 1);
  return Number.isFinite(cov) ? cov : null;
}

/** Sample variance (n − 1). */
export function sampleVariance(values: number[]): number | null {
  return sampleCovariance(values, values);
}

export function formatBeta(value: number): string {
  if (!Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    useGrouping: false,
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(value);
}

/**
 * Beta = Cov(asset returns, benchmark returns) / Var(benchmark returns)
 * Returns null when undefined (zero benchmark variance or invalid domain).
 */
export function calculateBeta(pairs: PricePair[]): number | null {
  if (pairs.length < 4) return null;
  if (pairs.some((p) => !(p.asset > 0) || !(p.benchmark > 0))) return null;

  const assetReturns = dailyReturns(pairs.map((p) => p.asset));
  const benchReturns = dailyReturns(pairs.map((p) => p.benchmark));
  if (!assetReturns || !benchReturns) return null;

  const cov = sampleCovariance(assetReturns, benchReturns);
  const variance = sampleVariance(benchReturns);
  if (cov === null || variance === null) return null;
  if (variance === 0) return null;

  const beta = cov / variance;
  return Number.isFinite(beta) ? beta : null;
}

export function buildBetaStockResult(
  pairs: PricePair[],
  currency: SupportedCurrency
): BetaStockResult | null {
  const beta = calculateBeta(pairs);
  if (beta === null) return null;
  return {
    beta,
    formattedBeta: formatBeta(beta),
    pairs,
    currency,
  };
}
