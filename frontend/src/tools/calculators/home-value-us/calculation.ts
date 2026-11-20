/**
 * Pure index-ratio home value math. Index points are dimensionless —
 * only their ratio scales the purchase price.
 */

export function calculateIndexedHomeValue(
  purchasePrice: number,
  purchaseIndex: number,
  valuationIndex: number
): number | null {
  if (
    !Number.isFinite(purchasePrice) ||
    purchasePrice < 0 ||
    !Number.isFinite(purchaseIndex) ||
    !Number.isFinite(valuationIndex) ||
    purchaseIndex <= 0 ||
    valuationIndex <= 0
  ) {
    return null;
  }
  const value = purchasePrice * (valuationIndex / purchaseIndex);
  return Number.isFinite(value) ? value : null;
}

export function calculateNominalDollarChange(
  estimatedHomeValue: number,
  purchasePrice: number
): number | null {
  if (
    !Number.isFinite(estimatedHomeValue) ||
    !Number.isFinite(purchasePrice)
  ) {
    return null;
  }
  return estimatedHomeValue - purchasePrice;
}

export function calculateNominalPercentageChange(
  estimatedHomeValue: number,
  purchasePrice: number
): number | null {
  if (
    !Number.isFinite(estimatedHomeValue) ||
    !Number.isFinite(purchasePrice) ||
    purchasePrice === 0
  ) {
    return null;
  }
  return (estimatedHomeValue / purchasePrice - 1) * 100;
}

export function calculateInflationAdjustedPurchasePrice(
  purchasePrice: number,
  purchaseCpi: number,
  valuationCpi: number
): number | null {
  if (
    !Number.isFinite(purchasePrice) ||
    purchasePrice < 0 ||
    !Number.isFinite(purchaseCpi) ||
    !Number.isFinite(valuationCpi) ||
    purchaseCpi <= 0 ||
    valuationCpi <= 0
  ) {
    return null;
  }
  const adjusted = purchasePrice * (valuationCpi / purchaseCpi);
  return Number.isFinite(adjusted) ? adjusted : null;
}

export function calculateRealDollarChange(
  estimatedHomeValue: number,
  inflationAdjustedPurchasePrice: number
): number | null {
  if (
    !Number.isFinite(estimatedHomeValue) ||
    !Number.isFinite(inflationAdjustedPurchasePrice)
  ) {
    return null;
  }
  return estimatedHomeValue - inflationAdjustedPurchasePrice;
}

/**
 * Real % = [(HPI ratio / CPI ratio) − 1] × 100
 * Equivalent: [(estimated / inflation-adjusted purchase) − 1] × 100
 */
export function calculateRealPercentageChange(
  homeIndexRatio: number,
  cpiRatio: number
): number | null {
  if (
    !Number.isFinite(homeIndexRatio) ||
    !Number.isFinite(cpiRatio) ||
    cpiRatio <= 0 ||
    homeIndexRatio <= 0
  ) {
    return null;
  }
  return (homeIndexRatio / cpiRatio - 1) * 100;
}

export function findObservation(
  observations: ReadonlyArray<{ period: string; value: number }>,
  period: string
): { period: string; value: number } | null {
  const hit = observations.find((o) => o.period === period);
  if (!hit || !(hit.value > 0) || !Number.isFinite(hit.value)) return null;
  return hit;
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function toPeriod(year: number, month: number): string | null {
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    return null;
  }
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function comparePeriods(a: string, b: string): number {
  return a.localeCompare(b);
}
