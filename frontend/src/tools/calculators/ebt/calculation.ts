import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Gross Profit = Revenue − COGS. Revenue and COGS ≥ 0. */
export function calculateGrossProfit(
  revenue: number,
  cogs: number
): number | null {
  if (
    !Number.isFinite(revenue) ||
    revenue < 0 ||
    !Number.isFinite(cogs) ||
    cogs < 0
  ) {
    return null;
  }
  const gp = revenue - cogs;
  return Number.isFinite(gp) ? gp : null;
}

/** Operating Expenses = SG&A + D&A. Both ≥ 0. */
export function calculateOperatingExpenses(
  sga: number,
  da: number
): number | null {
  if (
    !Number.isFinite(sga) ||
    sga < 0 ||
    !Number.isFinite(da) ||
    da < 0
  ) {
    return null;
  }
  const oe = sga + da;
  return Number.isFinite(oe) ? oe : null;
}

/** EBIT = Gross Profit − Operating Expenses (under this calculator's structure). */
export function calculateEbitFromGross(
  grossProfit: number,
  operatingExpenses: number
): number | null {
  if (
    !Number.isFinite(grossProfit) ||
    !Number.isFinite(operatingExpenses) ||
    operatingExpenses < 0
  ) {
    return null;
  }
  const ebit = grossProfit - operatingExpenses;
  return Number.isFinite(ebit) ? ebit : null;
}

/**
 * EBT = Gross Profit − Operating Expenses − Interest + Other Income.
 * Interest ≥ 0; other income may be signed.
 */
export function calculateEbt(
  grossProfit: number,
  operatingExpenses: number,
  interestExpenses: number,
  otherIncome: number
): number | null {
  if (
    !Number.isFinite(grossProfit) ||
    !Number.isFinite(operatingExpenses) ||
    operatingExpenses < 0 ||
    !Number.isFinite(interestExpenses) ||
    interestExpenses < 0 ||
    !Number.isFinite(otherIncome)
  ) {
    return null;
  }
  const ebt =
    grossProfit - operatingExpenses - interestExpenses + otherIncome;
  return Number.isFinite(ebt) ? ebt : null;
}

/** EBT margin = (EBT / Revenue) × 100. Unavailable when revenue ≤ 0. */
export function calculateEbtMargin(
  ebt: number,
  revenue: number
): number | null {
  if (!Number.isFinite(ebt) || !Number.isFinite(revenue) || revenue <= 0) {
    return null;
  }
  const margin = (ebt / revenue) * 100;
  return Number.isFinite(margin) ? margin : null;
}

export function interpretEbt(ebt: number): string {
  if (!Number.isFinite(ebt)) {
    return 'Earnings before tax could not be determined from the inputs.';
  }
  if (ebt > 0) {
    return `Positive EBT of ${formatPlain(ebt)} means the company generated positive earnings before income taxes for the selected period. That is pretax income — not net income or cash flow.`;
  }
  if (ebt === 0) {
    return 'EBT is zero: there are no earnings before income taxes under the entered financial assumptions.';
  }
  return `Negative EBT of ${formatPlain(ebt)} means a pretax loss for the selected period. That does not by itself mean insolvency or bankruptcy.`;
}

function formatPlain(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatEbtMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatEbtMargin(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
