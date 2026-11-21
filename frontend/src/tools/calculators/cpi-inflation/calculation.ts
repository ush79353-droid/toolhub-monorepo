/**
 * CPI inflation: A_target = A × (CPI_target / CPI_base)
 * Cumulative I% = (CPI_target/CPI_base − 1) × 100
 * Annualized r% uses chronologically earlier→later CPI with n = |Δyears|
 * Purchasing-power change % = (CPI_base/CPI_target − 1) × 100
 */

export interface CpiInflationMathResult {
  equivalentValue: number;
  cumulativeInflationPercent: number;
  averageAnnualInflationPercent: number | null;
  purchasingPowerChangePercent: number;
  sameYear: boolean;
}

export function calculateCpiInflation(
  amount: number,
  baseCPI: number,
  targetCPI: number,
  baseYear: number | null,
  targetYear: number | null,
  yearsSpanOverride: number | null = null
): CpiInflationMathResult | null {
  if (
    ![amount, baseCPI, targetCPI].every(Number.isFinite) ||
    amount < 0 ||
    baseCPI <= 0 ||
    targetCPI <= 0
  ) {
    return null;
  }

  const equivalentValue = amount * (targetCPI / baseCPI);
  const cumulativeInflationPercent = (targetCPI / baseCPI - 1) * 100;
  const purchasingPowerChangePercent = (baseCPI / targetCPI - 1) * 100;

  let sameYear = false;
  let averageAnnualInflationPercent: number | null = null;

  if (
    baseYear != null &&
    targetYear != null &&
    Number.isFinite(baseYear) &&
    Number.isFinite(targetYear)
  ) {
    sameYear = baseYear === targetYear;
    if (!sameYear) {
      const earlierYear = Math.min(baseYear, targetYear);
      const laterYear = Math.max(baseYear, targetYear);
      const n = laterYear - earlierYear;
      const cpiEarlier = baseYear < targetYear ? baseCPI : targetCPI;
      const cpiLater = baseYear < targetYear ? targetCPI : baseCPI;
      if (n > 0 && cpiEarlier > 0 && cpiLater > 0) {
        averageAnnualInflationPercent =
          (Math.pow(cpiLater / cpiEarlier, 1 / n) - 1) * 100;
      }
    }
  } else if (
    yearsSpanOverride != null &&
    Number.isFinite(yearsSpanOverride) &&
    yearsSpanOverride > 0
  ) {
    // Custom mode: user-supplied span from base CPI observation to target.
    averageAnnualInflationPercent =
      (Math.pow(targetCPI / baseCPI, 1 / yearsSpanOverride) - 1) * 100;
  }

  if (
    ![equivalentValue, cumulativeInflationPercent, purchasingPowerChangePercent].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (
    averageAnnualInflationPercent != null &&
    !Number.isFinite(averageAnnualInflationPercent)
  ) {
    return null;
  }

  return {
    equivalentValue,
    cumulativeInflationPercent,
    averageAnnualInflationPercent,
    purchasingPowerChangePercent,
    sameYear,
  };
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCpiIndex(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 3,
  }).format(value);
}

export function formatPercent(value: number, digits = 2): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Math.abs(value))}%`;
}

export function interpretCpiChange(
  cumulativeInflationPercent: number,
  sameYear: boolean
): string {
  if (sameYear) {
    return 'The selected years are identical, so the equivalent amount is unchanged and cumulative CPI change is 0%. Average annual inflation is not applicable.';
  }
  if (Math.abs(cumulativeInflationPercent) < 1e-9) {
    return 'CPI is effectively unchanged between the selected observations.';
  }
  if (cumulativeInflationPercent > 0) {
    return 'CPI increased from the base observation to the target observation. The inflation-adjusted equivalent amount is higher than the original amount.';
  }
  return 'CPI decreased from the base observation to the target observation. The inflation-adjusted equivalent amount is lower than the original amount.';
}

export function explainCpiInflation(
  amount: number,
  equivalentValue: number,
  baseLabel: string,
  targetLabel: string
): string {
  return `Based on the selected CPI values, ${formatUsd(amount)} in ${baseLabel} has roughly the same CPI-adjusted purchasing power as ${formatUsd(equivalentValue)} in ${targetLabel}. This is an index-based comparison for a general consumer basket, not any particular household's exact cost of living.`;
}
