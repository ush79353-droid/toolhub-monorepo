import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** EBIT = Revenue − Operating Expenses. Revenue and OE must be ≥ 0. */
export function calculateEbit(
  revenue: number,
  operatingExpenses: number
): number | null {
  if (
    !Number.isFinite(revenue) ||
    revenue < 0 ||
    !Number.isFinite(operatingExpenses) ||
    operatingExpenses < 0
  ) {
    return null;
  }
  const ebit = revenue - operatingExpenses;
  return Number.isFinite(ebit) ? ebit : null;
}

/** Revenue = EBIT + Operating Expenses. Result must be ≥ 0 for standard model. */
export function calculateRevenueFromEbit(
  ebit: number,
  operatingExpenses: number
): number | null {
  if (
    !Number.isFinite(ebit) ||
    !Number.isFinite(operatingExpenses) ||
    operatingExpenses < 0
  ) {
    return null;
  }
  const revenue = ebit + operatingExpenses;
  if (!Number.isFinite(revenue) || revenue < 0) return null;
  return revenue;
}

/**
 * Operating Expenses = Revenue − EBIT.
 * Result must be ≥ 0 for standard model.
 */
export function calculateOperatingExpensesFromEbit(
  revenue: number,
  ebit: number
): number | null {
  if (!Number.isFinite(revenue) || revenue < 0 || !Number.isFinite(ebit)) {
    return null;
  }
  const oe = revenue - ebit;
  if (!Number.isFinite(oe) || oe < 0) return null;
  return oe;
}

/**
 * EBIT margin = (EBIT / Revenue) × 100.
 * Unavailable when revenue ≤ 0.
 */
export function calculateEbitMargin(
  ebit: number,
  revenue: number
): number | null {
  if (!Number.isFinite(ebit) || !Number.isFinite(revenue) || revenue <= 0) {
    return null;
  }
  const margin = (ebit / revenue) * 100;
  return Number.isFinite(margin) ? margin : null;
}

export function interpretEbit(ebit: number, revenue: number): string {
  if (!Number.isFinite(ebit)) {
    return 'EBIT could not be determined from the inputs.';
  }
  if (ebit > 0) {
    return `Positive EBIT of ${formatEbitMoneyPlain(ebit)} means revenue exceeds the included operating expenses for the period. This is earnings before interest and income taxes; not automatically profit after all expenses.`;
  }
  if (ebit === 0) {
    return 'EBIT is zero: the included operating expenses equal revenue. The business breaks even at the EBIT level under these assumptions.';
  }
  if (revenue === 0) {
    return `Negative EBIT of ${formatEbitMoneyPlain(ebit)} with zero revenue means the entered operating costs remain after no sales in the period.`;
  }
  return `Negative EBIT of ${formatEbitMoneyPlain(ebit)} means the included operating costs exceed revenue for the period. An operating loss at the EBIT level is valid and does not by itself mean insolvency.`;
}

function formatEbitMoneyPlain(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatEbitMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatEbitMargin(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
