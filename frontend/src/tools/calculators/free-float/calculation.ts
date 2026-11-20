export interface FreeFloatMathInput {
  outstandingShares: number;
  restrictedShares: number;
  closelyHeldShares: number;
}

export interface FreeFloatMathResult {
  freeFloat: number;
  freeFloatPercentage: number;
  totalExcluded: number;
}

/**
 * Free float = outstanding − restricted − closely held
 * Percentage = (free float / outstanding) × 100
 */
export function calculateFreeFloat(
  input: FreeFloatMathInput
): FreeFloatMathResult | null {
  const { outstandingShares, restrictedShares, closelyHeldShares } = input;

  const values = [outstandingShares, restrictedShares, closelyHeldShares];
  if (!values.every((v) => Number.isSafeInteger(v))) return null;
  if (outstandingShares <= 0) return null;
  if (restrictedShares < 0 || closelyHeldShares < 0) return null;

  const totalExcluded = restrictedShares + closelyHeldShares;
  if (!Number.isSafeInteger(totalExcluded)) return null;
  if (totalExcluded > outstandingShares) return null;

  const freeFloat = outstandingShares - totalExcluded;
  if (!Number.isSafeInteger(freeFloat) || freeFloat < 0) return null;

  const freeFloatPercentage = (freeFloat / outstandingShares) * 100;
  if (!Number.isFinite(freeFloatPercentage)) return null;

  return { freeFloat, freeFloatPercentage, totalExcluded };
}

export function formatShareCount(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatFloatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function interpretFreeFloat(
  freeFloat: number,
  percentage: number
): string {
  const shares = formatShareCount(freeFloat);
  const pct = formatFloatPercent(percentage);
  if (freeFloat === 0) {
    return `Free float is 0 shares (0%). All outstanding shares are excluded as restricted or closely held under these inputs.`;
  }
  if (percentage === 100) {
    return `Free float is ${shares} shares (100%). No shares are excluded under these inputs.`;
  }
  return `Free float is ${shares} shares (${pct}% of outstanding shares).`;
}
