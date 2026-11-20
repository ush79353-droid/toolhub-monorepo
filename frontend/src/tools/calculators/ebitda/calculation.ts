import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * EBITDA = Operating Profit + Amortization + Depreciation.
 * Operating profit may be signed. A and D must be ≥ 0.
 */
export function calculateEbitda(
  operatingProfit: number,
  amortization: number,
  depreciation: number
): number | null {
  if (
    !Number.isFinite(operatingProfit) ||
    !Number.isFinite(amortization) ||
    amortization < 0 ||
    !Number.isFinite(depreciation) ||
    depreciation < 0
  ) {
    return null;
  }
  const ebitda = operatingProfit + amortization + depreciation;
  return Number.isFinite(ebitda) ? ebitda : null;
}

/** EBIT = EBITDA − A − D */
export function calculateOperatingProfitFromEbitda(
  ebitda: number,
  amortization: number,
  depreciation: number
): number | null {
  if (
    !Number.isFinite(ebitda) ||
    !Number.isFinite(amortization) ||
    amortization < 0 ||
    !Number.isFinite(depreciation) ||
    depreciation < 0
  ) {
    return null;
  }
  const ebit = ebitda - amortization - depreciation;
  return Number.isFinite(ebit) ? ebit : null;
}

/** A = EBITDA − EBIT − D. Must be ≥ 0. */
export function calculateAmortizationFromEbitda(
  ebitda: number,
  operatingProfit: number,
  depreciation: number
): number | null {
  if (
    !Number.isFinite(ebitda) ||
    !Number.isFinite(operatingProfit) ||
    !Number.isFinite(depreciation) ||
    depreciation < 0
  ) {
    return null;
  }
  const a = ebitda - operatingProfit - depreciation;
  if (!Number.isFinite(a) || a < 0) return null;
  return a;
}

/** D = EBITDA − EBIT − A. Must be ≥ 0. */
export function calculateDepreciationFromEbitda(
  ebitda: number,
  operatingProfit: number,
  amortization: number
): number | null {
  if (
    !Number.isFinite(ebitda) ||
    !Number.isFinite(operatingProfit) ||
    !Number.isFinite(amortization) ||
    amortization < 0
  ) {
    return null;
  }
  const d = ebitda - operatingProfit - amortization;
  if (!Number.isFinite(d) || d < 0) return null;
  return d;
}

/** EBITDA margin = (EBITDA / Revenue) × 100. Unavailable when revenue ≤ 0. */
export function calculateEbitdaMargin(
  ebitda: number,
  revenue: number
): number | null {
  if (!Number.isFinite(ebitda) || !Number.isFinite(revenue) || revenue <= 0) {
    return null;
  }
  const margin = (ebitda / revenue) * 100;
  return Number.isFinite(margin) ? margin : null;
}

export function interpretEbitda(ebitda: number): string {
  if (!Number.isFinite(ebitda)) {
    return 'EBITDA could not be determined from the inputs.';
  }
  if (ebitda > 0) {
    return `Positive EBITDA of ${formatPlain(ebitda)} means earnings before interest, income taxes, depreciation, and amortization are positive for the period. That is not automatically net income or cash flow.`;
  }
  if (ebitda === 0) {
    return 'EBITDA is zero: earnings before the specified exclusions are zero for the selected period.';
  }
  return `Negative EBITDA of ${formatPlain(ebitda)} means earnings remain negative even after adding back the entered depreciation and amortization. That does not by itself mean insolvency.`;
}

function formatPlain(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatEbitdaMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatEbitdaMargin(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
