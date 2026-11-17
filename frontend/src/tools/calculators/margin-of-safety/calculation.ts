/**
 * Margin of Safety = Current Sales − Breakeven Sales
 * Ratio = MoS / Current Sales
 * Percent = Ratio × 100
 * Units = MoS / Selling Price per Unit
 *
 * Amounts must already share one currency. Never returns NaN/Infinity.
 */

export interface MarginOfSafetyCalcInput {
  currentSales: number;
  breakevenSales: number;
  sellingPricePerUnit: number | null;
}

export interface MarginOfSafetyCalcOutput {
  marginOfSafety: number;
  marginOfSafetyRatio: number | null;
  marginOfSafetyPercent: number | null;
  marginOfSafetyUnits: number | null;
}

export function calculateMarginOfSafety(
  input: MarginOfSafetyCalcInput
): MarginOfSafetyCalcOutput | null {
  const { currentSales, breakevenSales, sellingPricePerUnit } = input;

  if (![currentSales, breakevenSales].every(Number.isFinite)) return null;

  const marginOfSafety = currentSales - breakevenSales;
  if (!Number.isFinite(marginOfSafety)) return null;

  let marginOfSafetyRatio: number | null = null;
  let marginOfSafetyPercent: number | null = null;
  if (currentSales !== 0) {
    const ratio = marginOfSafety / currentSales;
    if (Number.isFinite(ratio)) {
      marginOfSafetyRatio = ratio;
      marginOfSafetyPercent = ratio * 100;
    }
  }

  let marginOfSafetyUnits: number | null = null;
  if (
    sellingPricePerUnit !== null &&
    Number.isFinite(sellingPricePerUnit) &&
    sellingPricePerUnit !== 0
  ) {
    const units = marginOfSafety / sellingPricePerUnit;
    if (Number.isFinite(units)) marginOfSafetyUnits = units;
  }

  return {
    marginOfSafety,
    marginOfSafetyRatio,
    marginOfSafetyPercent,
    marginOfSafetyUnits,
  };
}

/** Derive current sales from volume × unit selling price (same currency). */
export function deriveCurrentSalesFromPerUnit(
  salesVolume: number,
  sellingPricePerUnit: number
): number | null {
  if (![salesVolume, sellingPricePerUnit].every(Number.isFinite)) return null;
  const product = salesVolume * sellingPricePerUnit;
  return Number.isFinite(product) ? product : null;
}

export function formatMoneyDisplay(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatRatioDisplay(ratio: number): string {
  if (!Number.isFinite(ratio)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(ratio);
}

export function formatPercentDisplay(percent: number): string {
  if (!Number.isFinite(percent)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(percent);
}

export function formatUnitsDisplay(units: number): string {
  if (!Number.isFinite(units)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(units);
}
