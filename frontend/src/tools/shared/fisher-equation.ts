/**
 * Exact Fisher: (1+i)=(1+r)(1+πᵉ)
 * Approximate: i≈r+πᵉ
 * Shared by Fisher Effect and Fisher Equation calculators.
 * Rates are percentages; convert to decimals for math.
 */

export function calculateExactRealRate(
  nominalRate: number,
  inflationRate: number
): number | null {
  if (![nominalRate, inflationRate].every(Number.isFinite)) return null;
  if (nominalRate < -100) return null;
  if (inflationRate <= -100) return null;
  const real =
    ((1 + nominalRate / 100) / (1 + inflationRate / 100) - 1) * 100;
  return Number.isFinite(real) ? real : null;
}

/** Alias used by Fisher Effect calculator. */
export const calculateRealRate = calculateExactRealRate;

export function calculateApproximateRealRate(
  nominalRate: number,
  inflationRate: number
): number {
  return nominalRate - inflationRate;
}

export const approximateRealRate = calculateApproximateRealRate;

export function calculateNominalRate(
  realRate: number,
  inflationRate: number
): number | null {
  if (![realRate, inflationRate].every(Number.isFinite)) return null;
  if (realRate < -100 || inflationRate < -100) return null;
  const nominal =
    ((1 + realRate / 100) * (1 + inflationRate / 100) - 1) * 100;
  return Number.isFinite(nominal) ? nominal : null;
}

export function calculateApproximateNominalRate(
  realRate: number,
  inflationRate: number
): number {
  return realRate + inflationRate;
}

export const approximateNominalRate = calculateApproximateNominalRate;

export function calculateExpectedInflation(
  nominalRate: number,
  realRate: number
): number | null {
  if (![nominalRate, realRate].every(Number.isFinite)) return null;
  if (nominalRate < -100) return null;
  if (realRate <= -100) return null;
  const inflation =
    ((1 + nominalRate / 100) / (1 + realRate / 100) - 1) * 100;
  return Number.isFinite(inflation) ? inflation : null;
}

export function calculateApproximateExpectedInflation(
  nominalRate: number,
  realRate: number
): number {
  return nominalRate - realRate;
}

export const approximateExpectedInflation =
  calculateApproximateExpectedInflation;

export function calculateApproximationDifference(
  exact: number,
  approximate: number
): number {
  return exact - approximate;
}

export function formatRatePercent(value: number, digits = 2): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}%`;
}

export function interpretRealRate(realRate: number): string {
  if (realRate > 0) {
    return 'The nominal interest rate exceeds expected inflation, resulting in a positive real interest rate.';
  }
  if (realRate < 0) {
    return 'Expected inflation exceeds the nominal interest rate, resulting in a negative real interest rate.';
  }
  return 'The nominal interest rate exactly offsets expected inflation under the Fisher equation.';
}
