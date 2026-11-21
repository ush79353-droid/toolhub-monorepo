import { WEIGHT_TOLERANCE_PERCENT } from './types';

export interface PortfolioStockMath {
  id: string;
  label: string;
  beta: number;
  weightPercent: number;
}

export interface StockContributionMath {
  id: string;
  label: string;
  beta: number;
  weightPercent: number;
  weightedBeta: number;
}

export interface PortfolioBetaMathResult {
  totalWeightPercent: number;
  portfolioBeta: number | null;
  contributions: StockContributionMath[];
  isFullyAllocated: boolean;
}

/**
 * βp = Σ (wi/100 × βi) when Σ wi ≈ 100%
 */
export function calculatePortfolioBeta(
  stocks: PortfolioStockMath[]
): PortfolioBetaMathResult | null {
  if (stocks.length === 0) return null;

  for (const s of stocks) {
    if (!Number.isFinite(s.beta) || !Number.isFinite(s.weightPercent)) {
      return null;
    }
    if (s.weightPercent < 0 || s.weightPercent > 100) return null;
  }

  const totalWeightPercent = stocks.reduce(
    (sum, s) => sum + s.weightPercent,
    0
  );
  if (!Number.isFinite(totalWeightPercent)) return null;

  const contributions: StockContributionMath[] = stocks.map((s) => ({
    id: s.id,
    label: s.label,
    beta: s.beta,
    weightPercent: s.weightPercent,
    weightedBeta: (s.weightPercent / 100) * s.beta,
  }));

  if (contributions.some((c) => !Number.isFinite(c.weightedBeta))) {
    return null;
  }

  const isFullyAllocated =
    Math.abs(totalWeightPercent - 100) <= WEIGHT_TOLERANCE_PERCENT;

  let portfolioBeta: number | null = null;
  if (isFullyAllocated) {
    portfolioBeta = contributions.reduce((sum, c) => sum + c.weightedBeta, 0);
    if (!Number.isFinite(portfolioBeta)) return null;
  }

  return {
    totalWeightPercent,
    portfolioBeta,
    contributions,
    isFullyAllocated,
  };
}

export function interpretPortfolioBeta(beta: number): string {
  if (!Number.isFinite(beta)) {
    return 'Portfolio beta is unavailable.';
  }
  if (beta > 1) {
    return `Portfolio beta ${formatBeta(beta)} is above 1 — higher estimated systematic market sensitivity than the benchmark. A 1% benchmark move is associated with roughly a ${formatBeta(beta)}% portfolio move under the beta model (not a guarantee).`;
  }
  if (beta === 1 || Math.abs(beta - 1) < 1e-9) {
    return 'Portfolio beta is approximately 1.00 — about the same systematic market sensitivity as the benchmark.';
  }
  if (beta > 0 && beta < 1) {
    return `Portfolio beta ${formatBeta(beta)} is between 0 and 1 — lower estimated systematic market sensitivity than the benchmark.`;
  }
  if (beta === 0 || Math.abs(beta) < 1e-12) {
    return 'Portfolio beta is approximately 0.00 — roughly zero estimated linear sensitivity to benchmark movements.';
  }
  return `Portfolio beta ${formatBeta(beta)} is negative — historically an inverse relationship with the benchmark within the estimated beta model (not a guarantee of future returns).`;
}

export function formatBeta(value: number, digits = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatWeightPercent(value: number, digits = 2): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}%`;
}

export function weightStatusMessage(totalWeightPercent: number): string | null {
  if (!Number.isFinite(totalWeightPercent)) return null;
  if (Math.abs(totalWeightPercent - 100) <= WEIGHT_TOLERANCE_PERCENT) {
    return null;
  }
  if (totalWeightPercent < 100) {
    const remaining = 100 - totalWeightPercent;
    return `Total portfolio weight: ${formatWeightPercent(totalWeightPercent)}. Allocate the remaining ${formatWeightPercent(remaining)} to complete a fully invested long-only portfolio.`;
  }
  return `Total portfolio weight: ${formatWeightPercent(totalWeightPercent)}. Weights exceed 100% — review the investment allocations.`;
}
