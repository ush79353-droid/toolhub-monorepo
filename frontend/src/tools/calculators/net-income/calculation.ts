import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Gross Profit = Revenue − Cost of Sales. Both ≥ 0. */
export function calculateGrossProfit(
  revenue: number,
  costOfSales: number
): number | null {
  if (
    !Number.isFinite(revenue) ||
    revenue < 0 ||
    !Number.isFinite(costOfSales) ||
    costOfSales < 0
  ) {
    return null;
  }
  const gp = revenue - costOfSales;
  return Number.isFinite(gp) ? gp : null;
}

/** Operating Income = Gross Profit − Operating Expenses. OpEx ≥ 0. */
export function calculateOperatingIncome(
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
  const oi = grossProfit - operatingExpenses;
  return Number.isFinite(oi) ? oi : null;
}

/** EBT = Operating Income − Interest. Interest ≥ 0. */
export function calculateEarningsBeforeTax(
  operatingIncome: number,
  interest: number
): number | null {
  if (
    !Number.isFinite(operatingIncome) ||
    !Number.isFinite(interest) ||
    interest < 0
  ) {
    return null;
  }
  const ebt = operatingIncome - interest;
  return Number.isFinite(ebt) ? ebt : null;
}

/**
 * Estimated taxes = max(EBT, 0) × (taxRate / 100).
 * Tax rate in [0, 100]. No automatic refund on pretax loss.
 */
export function calculateEstimatedIncomeTax(
  earningsBeforeTax: number,
  taxRatePercent: number
): number | null {
  if (
    !Number.isFinite(earningsBeforeTax) ||
    !Number.isFinite(taxRatePercent) ||
    taxRatePercent < 0 ||
    taxRatePercent > 100
  ) {
    return null;
  }
  const taxes = Math.max(earningsBeforeTax, 0) * (taxRatePercent / 100);
  return Number.isFinite(taxes) ? taxes : null;
}

/** Net Income = EBT − Taxes. */
export function calculateNetIncome(
  earningsBeforeTax: number,
  totalTaxes: number
): number | null {
  if (
    !Number.isFinite(earningsBeforeTax) ||
    !Number.isFinite(totalTaxes) ||
    totalTaxes < 0
  ) {
    return null;
  }
  const ni = earningsBeforeTax - totalTaxes;
  return Number.isFinite(ni) ? ni : null;
}

/** Net profit margin = (Net Income / Revenue) × 100. Undefined when revenue ≤ 0. */
export function calculateNetProfitMargin(
  netIncome: number,
  revenue: number
): number | null {
  if (!Number.isFinite(netIncome) || !Number.isFinite(revenue) || revenue <= 0) {
    return null;
  }
  const margin = (netIncome / revenue) * 100;
  return Number.isFinite(margin) ? margin : null;
}

export function interpretNetIncome(netIncome: number): string {
  if (!Number.isFinite(netIncome)) {
    return 'Net income could not be determined from the inputs.';
  }
  if (netIncome > 0) {
    return `Net income after taxes of ${formatPlain(netIncome)} is the estimated bottom-line profit for the period under this simplified income-statement model.`;
  }
  if (netIncome === 0) {
    return 'Net income after taxes is zero under the entered assumptions.';
  }
  return `Net loss of ${formatPlain(Math.abs(netIncome))} — expenses and estimated taxes exceed revenue under this simplified model. That is not by itself insolvency.`;
}

function formatPlain(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNiMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatNiPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}
