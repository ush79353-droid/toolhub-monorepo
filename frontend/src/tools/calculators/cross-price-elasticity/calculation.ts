import type {
  CrossPriceMagnitude,
  CrossPriceRelationship,
} from './types';

const UNIT_TOLERANCE = 1e-9;

/** Initial-value %ΔPA = ((PA2 − PA1) / PA1) × 100. PA1 must be > 0. */
export function calculatePercentagePriceChange(
  initialPriceA: number,
  finalPriceA: number
): number | null {
  if (
    !Number.isFinite(initialPriceA) ||
    initialPriceA <= 0 ||
    !Number.isFinite(finalPriceA) ||
    finalPriceA < 0
  ) {
    return null;
  }
  const pct = ((finalPriceA - initialPriceA) / initialPriceA) * 100;
  return Number.isFinite(pct) ? pct : null;
}

/** Initial-value %ΔQB = ((QB2 − QB1) / QB1) × 100. QB1 must be > 0. */
export function calculatePercentageDemandChange(
  initialDemandB: number,
  finalDemandB: number
): number | null {
  if (
    !Number.isFinite(initialDemandB) ||
    initialDemandB <= 0 ||
    !Number.isFinite(finalDemandB) ||
    finalDemandB < 0
  ) {
    return null;
  }
  const pct = ((finalDemandB - initialDemandB) / initialDemandB) * 100;
  return Number.isFinite(pct) ? pct : null;
}

/** Midpoint %ΔPA. Average price must be > 0. */
export function calculateMidpointPriceChange(
  initialPriceA: number,
  finalPriceA: number
): number | null {
  if (
    !Number.isFinite(initialPriceA) ||
    initialPriceA < 0 ||
    !Number.isFinite(finalPriceA) ||
    finalPriceA < 0
  ) {
    return null;
  }
  const avg = (initialPriceA + finalPriceA) / 2;
  if (avg <= 0) return null;
  const pct = ((finalPriceA - initialPriceA) / avg) * 100;
  return Number.isFinite(pct) ? pct : null;
}

/** Midpoint %ΔQB. Average demand must be > 0. */
export function calculateMidpointDemandChange(
  initialDemandB: number,
  finalDemandB: number
): number | null {
  if (
    !Number.isFinite(initialDemandB) ||
    initialDemandB < 0 ||
    !Number.isFinite(finalDemandB) ||
    finalDemandB < 0
  ) {
    return null;
  }
  const avg = (initialDemandB + finalDemandB) / 2;
  if (avg <= 0) return null;
  const pct = ((finalDemandB - initialDemandB) / avg) * 100;
  return Number.isFinite(pct) ? pct : null;
}

/**
 * EBA = %ΔQB / %ΔPA.
 * Returns null when price change is 0 (undefined) or inputs invalid.
 * Zero demand change with nonzero price change → 0.
 */
export function calculateCrossPriceElasticity(
  demandChangePercentage: number,
  priceChangePercentage: number
): number | null {
  if (
    !Number.isFinite(demandChangePercentage) ||
    !Number.isFinite(priceChangePercentage)
  ) {
    return null;
  }
  if (priceChangePercentage === 0) return null;
  const e = demandChangePercentage / priceChangePercentage;
  return Number.isFinite(e) ? e : null;
}

export function calculateMidpointCrossPriceElasticity(
  initialPriceA: number,
  finalPriceA: number,
  initialDemandB: number,
  finalDemandB: number
): number | null {
  const pricePct = calculateMidpointPriceChange(initialPriceA, finalPriceA);
  const demandPct = calculateMidpointDemandChange(
    initialDemandB,
    finalDemandB
  );
  if (pricePct === null || demandPct === null) return null;
  return calculateCrossPriceElasticity(demandPct, pricePct);
}

export function classifyRelationship(
  elasticity: number
): CrossPriceRelationship {
  if (!Number.isFinite(elasticity)) return 'unknown';
  if (Math.abs(elasticity) < UNIT_TOLERANCE) return 'approximatelyUnrelated';
  if (elasticity > 0) return 'substitutes';
  return 'complements';
}

export function classifyMagnitude(elasticity: number): CrossPriceMagnitude {
  if (!Number.isFinite(elasticity)) return 'unknown';
  const abs = Math.abs(elasticity);
  if (abs < UNIT_TOLERANCE) return 'zero';
  if (Math.abs(abs - 1) < UNIT_TOLERANCE) return 'unitMagnitude';
  if (abs < 1) return 'inelastic';
  return 'elastic';
}

export function interpretCrossPriceElasticity(
  elasticity: number,
  relationship: CrossPriceRelationship,
  magnitude: CrossPriceMagnitude
): string {
  const parts: string[] = [];

  if (relationship === 'substitutes') {
    parts.push(
      'Positive cross-price elasticity is consistent with substitute goods under these assumptions (demand for B moves with A\'s price). Two observations alone do not prove causation.'
    );
  } else if (relationship === 'complements') {
    parts.push(
      'Negative cross-price elasticity is consistent with complementary goods under these assumptions (demand for B moves opposite A\'s price). Correlation is not automatic causation.'
    );
  } else if (relationship === 'approximatelyUnrelated') {
    parts.push(
      'Observed elasticity is about zero; Product B\'s demand did not respond to the measured change in Product A\'s price over this interval. That does not prove the goods are permanently unrelated.'
    );
  }

  if (magnitude === 'inelastic') {
    parts.push(
      'Magnitude below 1: relatively inelastic cross-price response.'
    );
  } else if (magnitude === 'unitMagnitude') {
    parts.push('Magnitude ≈ 1: unit-magnitude cross-price response.');
  } else if (magnitude === 'elastic') {
    parts.push(
      'Magnitude above 1: relatively elastic cross-price response.'
    );
  }

  if (parts.length === 0) {
    return `Cross-price elasticity ≈ ${formatElasticity(elasticity)}.`;
  }
  return parts.join(' ');
}

export function formatElasticity(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
    signDisplay: 'exceptZero',
  }).format(value);
}

export function formatPercentageChange(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'exceptZero',
  }).format(value);
}

export function formatCsMoneyQuantity(value: number): string {
  if (Number.isInteger(value)) {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(value);
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value);
}
