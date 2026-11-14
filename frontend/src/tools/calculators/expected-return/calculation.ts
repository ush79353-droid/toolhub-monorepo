import type { ExpectedReturnResult } from './types';

export interface ScenarioValues {
  probability: number;
  stockA: number;
  stockB: number;
}

function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Number(value.toFixed(4));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(rounded);
}

/** True when probabilities sum to 100% within tolerance. */
export function probabilitiesSumTo100(total: number, tolerance = 0.01): boolean {
  return Number.isFinite(total) && Math.abs(total - 100) <= tolerance;
}

/**
 * Expected Return (%) = Σ [(Probability_i / 100) × Return_i]
 */
export function calculateExpectedReturns(
  scenarios: ScenarioValues[]
): ExpectedReturnResult | null {
  if (scenarios.length === 0) return null;

  let expectedReturnA = 0;
  let expectedReturnB = 0;
  let probabilityTotal = 0;

  for (const s of scenarios) {
    if (
      ![s.probability, s.stockA, s.stockB].every(Number.isFinite) ||
      s.probability < 0 ||
      s.probability > 100
    ) {
      return null;
    }
    probabilityTotal += s.probability;
    expectedReturnA += (s.probability / 100) * s.stockA;
    expectedReturnB += (s.probability / 100) * s.stockB;
  }

  if (!probabilitiesSumTo100(probabilityTotal)) return null;
  if (!Number.isFinite(expectedReturnA) || !Number.isFinite(expectedReturnB)) return null;

  return {
    expectedReturnA,
    expectedReturnB,
    formattedExpectedReturnA: formatPercent(expectedReturnA),
    formattedExpectedReturnB: formatPercent(expectedReturnB),
    probabilityTotal,
  };
}
