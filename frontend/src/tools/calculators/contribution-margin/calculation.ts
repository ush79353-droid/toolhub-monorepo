import type { ContributionMarginInput, ContributionMarginResult } from './types';

/** Round money once for display. */
export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round(value * 100) / 100;
}

/** Round percent to two decimal places. */
export function roundPercent(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round(value * 100) / 100;
}

/**
 * Contribution margin = (selling price − variable cost) × units
 * Ratio (%) = ((price − variable) / price) × 100  — omitted when price is 0
 * Profit = contribution margin − fixed costs (may be negative)
 */
export function calculateContributionMargin(
  input: ContributionMarginInput,
): ContributionMarginResult | null {
  const {
    sellingPricePerUnit: price,
    variableCostPerUnit: variable,
    numberOfUnits: units,
    fixedCosts: fixed,
  } = input;

  if (price === null || variable === null || units === null || fixed === null) return null;
  if (
    !Number.isFinite(price) ||
    !Number.isFinite(variable) ||
    !Number.isFinite(units) ||
    !Number.isFinite(fixed)
  ) {
    return null;
  }

  const contributionPerUnit = price - variable;
  const contributionMargin = roundMoney(contributionPerUnit * units);
  if (!Number.isFinite(contributionMargin)) return null;

  let contributionMarginRatioPercent: number | null = null;
  if (price !== 0) {
    const ratio = roundPercent((contributionPerUnit / price) * 100);
    if (Number.isFinite(ratio)) {
      contributionMarginRatioPercent = ratio;
    }
  }

  const profitGenerated = roundMoney(contributionMargin - fixed);
  if (!Number.isFinite(profitGenerated)) return null;

  return {
    sellingPricePerUnit: price,
    variableCostPerUnit: variable,
    numberOfUnits: units,
    fixedCosts: fixed,
    contributionMargin,
    contributionMarginRatioPercent,
    profitGenerated,
    currency: input.currency,
  };
}
