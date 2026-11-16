import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function formatDdmPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  }).format(value);
}

export function formatDdmMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * Retention growth: g = ROE × (1 − payout). Rates as decimals.
 * Example: ROE 15%, payout 40% → g = 0.15 × 0.60 = 0.09.
 */
export function calculateExpectedGrowthRate(input: {
  payoutRatioDecimal: number;
  roeDecimal: number;
}): number | null {
  const { payoutRatioDecimal, roeDecimal } = input;
  if (![payoutRatioDecimal, roeDecimal].every(Number.isFinite)) return null;
  const g = roeDecimal * (1 - payoutRatioDecimal);
  return Number.isFinite(g) ? g : null;
}

/** D₁ = D₀ × (1 + g). D₀ is current annual dividend per share. */
export function calculateExpectedDividend(input: {
  dividendPerShare: number;
  growthRateDecimal: number;
}): number | null {
  const { dividendPerShare, growthRateDecimal } = input;
  if (![dividendPerShare, growthRateDecimal].every(Number.isFinite)) return null;
  if (dividendPerShare < 0) return null;
  const d1 = dividendPerShare * (1 + growthRateDecimal);
  return Number.isFinite(d1) ? d1 : null;
}

/** CAPM: Ke = Rf + β × MRP. Rates as decimals. */
export function calculateCostOfEquity(input: {
  riskFreeRateDecimal: number;
  marketRiskPremiumDecimal: number;
  beta: number;
}): number | null {
  const { riskFreeRateDecimal, marketRiskPremiumDecimal, beta } = input;
  if (![riskFreeRateDecimal, marketRiskPremiumDecimal, beta].every(Number.isFinite)) {
    return null;
  }
  const ke = riskFreeRateDecimal + beta * marketRiskPremiumDecimal;
  return Number.isFinite(ke) ? ke : null;
}

/**
 * Gordon Growth Model: P₀ = D₁ / (Ke − g).
 * Requires Ke > g; otherwise returns null (invalid constant-growth DDM).
 */
export function calculateDdmStockValue(input: {
  expectedDividend: number;
  costOfEquityDecimal: number;
  growthRateDecimal: number;
}): number | null {
  const { expectedDividend, costOfEquityDecimal, growthRateDecimal } = input;
  if (
    ![expectedDividend, costOfEquityDecimal, growthRateDecimal].every(Number.isFinite)
  ) {
    return null;
  }
  if (expectedDividend < 0) return null;
  const spread = costOfEquityDecimal - growthRateDecimal;
  if (!(spread > 0)) return null;
  const p0 = expectedDividend / spread;
  return Number.isFinite(p0) ? p0 : null;
}
