/**
 * LCR = HQLA / Expected 30-day net cash outflows × 100
 * Simplified HQLA helper (educational, not full regulatory):
 *   preliminary = L1 + 0.85·L2A + 0.75·L2B25 + 0.50·L2B50
 *   Level 2B ≤ 15% of adjusted HQLA; Level 2 ≤ 40% of adjusted HQLA
 * Net outflows helper: Outflows − min(Inflows, 75% × Outflows)
 */

export function calculateLiquidityCoverageRatio(
  highQualityLiquidAssets: number,
  netCashOutflows30Days: number
): number | null {
  if (
    !Number.isFinite(highQualityLiquidAssets) ||
    !Number.isFinite(netCashOutflows30Days) ||
    highQualityLiquidAssets < 0 ||
    netCashOutflows30Days <= 0
  ) {
    return null;
  }
  return (highQualityLiquidAssets / netCashOutflows30Days) * 100;
}

export function calculateCoverageMultiple(
  hqla: number,
  netOutflows: number
): number | null {
  if (!Number.isFinite(hqla) || !Number.isFinite(netOutflows) || netOutflows <= 0) {
    return null;
  }
  return hqla / netOutflows;
}

export function calculateLiquidityDifference(
  hqla: number,
  netOutflows: number
): number {
  return hqla - netOutflows;
}

export function calculateRequiredHQLA(netOutflows: number): number {
  return netOutflows;
}

export function calculateAdditionalHQLANeeded(
  hqla: number,
  netOutflows: number
): number {
  return Math.max(0, netOutflows - hqla);
}

export function calculatePreliminaryHQLA(
  level1: number,
  level2A: number,
  level2B25: number,
  level2B50: number
): number {
  assertNonNeg(level1, 'Level 1 assets');
  assertNonNeg(level2A, 'Level 2A assets');
  assertNonNeg(level2B25, 'Level 2B (25% haircut) assets');
  assertNonNeg(level2B50, 'Level 2B (50% haircut) assets');
  return level1 + 0.85 * level2A + 0.75 * level2B25 + 0.5 * level2B50;
}

/**
 * Simplified Basel-style composition caps on haircut-adjusted amounts.
 * Iteratively enforces Level 2B ≤ 15% and Level 2 ≤ 40% of adjusted stock.
 */
export function calculateEstimatedEligibleHQLA(
  level1: number,
  level2A: number,
  level2B25: number,
  level2B50: number
): {
  preliminary: number;
  afterCaps: number;
  adjustedL2A: number;
  adjustedL2B: number;
  cappedByLevel2: boolean;
  cappedByLevel2B: boolean;
} {
  const l1 = level1;
  let adj2A = 0.85 * level2A;
  let adj2B = 0.75 * level2B25 + 0.5 * level2B50;
  const preliminary = l1 + adj2A + adj2B;

  let cappedByLevel2B = false;
  let cappedByLevel2 = false;

  // Cap Level 2B at 15% of HQLA = L1 + L2A_adj + L2B_adj
  // L2B ≤ 0.15/(1-0.15) × (L1+L2A) = (3/17)×(L1+L2A)
  const max2B = (0.15 / 0.85) * (l1 + adj2A);
  if (adj2B > max2B + 1e-9) {
    adj2B = Math.max(0, max2B);
    cappedByLevel2B = true;
  }

  // Cap Level 2 (2A+2B) at 40% of HQLA
  // L2 ≤ 0.40/(1-0.40) × L1 = (2/3)×L1
  const maxL2 = (0.4 / 0.6) * l1;
  let adjL2 = adj2A + adj2B;
  if (adjL2 > maxL2 + 1e-9) {
    cappedByLevel2 = true;
    const scale = maxL2 / adjL2;
    adj2A *= scale;
    adj2B *= scale;
    adjL2 = maxL2;
  }

  const afterCaps = l1 + adjL2;
  return {
    preliminary,
    afterCaps,
    adjustedL2A: adj2A,
    adjustedL2B: adj2B,
    cappedByLevel2,
    cappedByLevel2B,
  };
}

export function calculateNetCashOutflows(
  totalOutflows: number,
  totalInflows: number,
  inflowCapFraction = 0.75
): number {
  assertNonNeg(totalOutflows, 'Total cash outflows');
  assertNonNeg(totalInflows, 'Total cash inflows');
  if (!(inflowCapFraction >= 0) || !(inflowCapFraction <= 1)) {
    throw new Error('Inflow cap fraction must be between 0 and 1.');
  }
  const cappedInflows = Math.min(
    totalInflows,
    inflowCapFraction * totalOutflows
  );
  return totalOutflows - cappedInflows;
}

function assertNonNeg(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a finite number ≥ 0.`);
  }
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number, digits = 2): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}%`;
}

export function formatMultiple(value: number): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}×`;
}

export function interpretLcr(lcrPercent: number): {
  status: 'above' | 'equal' | 'below';
  interpretation: string;
} {
  if (Math.abs(lcrPercent - 100) < 0.005) {
    return {
      status: 'equal',
      interpretation:
        "The bank's eligible high-quality liquid assets equal its estimated 30-day net cash outflows under this illustrative calculation.",
    };
  }
  if (lcrPercent > 100) {
    return {
      status: 'above',
      interpretation:
        "The bank's eligible high-quality liquid assets exceed its estimated net cash outflows over the specified 30-day stress period under this illustrative calculation.",
    };
  }
  return {
    status: 'below',
    interpretation:
      "The bank's eligible high-quality liquid assets are lower than its estimated 30-day net cash outflows under this illustrative calculation.",
  };
}
