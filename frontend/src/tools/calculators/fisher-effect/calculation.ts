/**
 * Exact Fisher: (1+i) = (1+r)(1+πᵉ)
 * Approximate: i ≈ r + πᵉ
 * Rates are percentages; convert to decimals for math.
 */

export function calculateRealRate(
  nominalRate: number,
  expectedInflation: number
): number | null {
  if (![nominalRate, expectedInflation].every(Number.isFinite)) return null;
  if (nominalRate < -100) return null;
  if (expectedInflation <= -100) return null; // division by zero / invalid
  const real =
    ((1 + nominalRate / 100) / (1 + expectedInflation / 100) - 1) * 100;
  return Number.isFinite(real) ? real : null;
}

export function calculateNominalRate(
  realRate: number,
  expectedInflation: number
): number | null {
  if (![realRate, expectedInflation].every(Number.isFinite)) return null;
  if (realRate < -100 || expectedInflation < -100) return null;
  const nominal =
    ((1 + realRate / 100) * (1 + expectedInflation / 100) - 1) * 100;
  return Number.isFinite(nominal) ? nominal : null;
}

export function calculateExpectedInflation(
  nominalRate: number,
  realRate: number
): number | null {
  if (![nominalRate, realRate].every(Number.isFinite)) return null;
  if (nominalRate < -100) return null;
  if (realRate <= -100) return null; // division undefined
  const inflation =
    ((1 + nominalRate / 100) / (1 + realRate / 100) - 1) * 100;
  return Number.isFinite(inflation) ? inflation : null;
}

/** Approximate counterparts (percentage points). */
export function approximateRealRate(
  nominalRate: number,
  expectedInflation: number
): number {
  return nominalRate - expectedInflation;
}

export function approximateNominalRate(
  realRate: number,
  expectedInflation: number
): number {
  return realRate + expectedInflation;
}

export function approximateExpectedInflation(
  nominalRate: number,
  realRate: number
): number {
  return nominalRate - realRate;
}

export function formatRatePercent(value: number, digits = 2): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}%`;
}

export function interpretRealRate(realRate: number): string {
  if (realRate > 0) {
    return 'A positive real interest rate indicates that the nominal return exceeds expected inflation in purchasing-power terms.';
  }
  if (realRate < 0) {
    return 'A negative real interest rate indicates that expected inflation exceeds the nominal interest return, reducing purchasing power over the period.';
  }
  return 'A zero real interest rate indicates that the nominal return exactly offsets expected inflation under the Fisher equation.';
}
