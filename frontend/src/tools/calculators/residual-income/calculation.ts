import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Equity Charge = Equity Capital × (Cost of Equity % / 100)
 * Residual Income = Net Income − Equity Charge
 */
export function calculateEquityCharge(
  equityCapital: number,
  costOfEquityPercent: number
): number | null {
  if (!Number.isFinite(equityCapital) || equityCapital < 0) return null;
  if (!Number.isFinite(costOfEquityPercent) || costOfEquityPercent < 0) {
    return null;
  }
  const charge = equityCapital * (costOfEquityPercent / 100);
  return Number.isFinite(charge) ? charge : null;
}

export function calculateResidualIncome(
  netIncome: number,
  equityCharge: number
): number | null {
  if (!Number.isFinite(netIncome) || !Number.isFinite(equityCharge)) {
    return null;
  }
  const ri = netIncome - equityCharge;
  return Number.isFinite(ri) ? ri : null;
}

export function formatRiMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function interpretResidualIncome(ri: number): string {
  if (!Number.isFinite(ri)) return 'Residual income is unavailable.';
  if (ri > 0) {
    return 'Positive residual income — the company earned more than the required return on its equity capital for the selected period. This does not guarantee long-term valuation or performance.';
  }
  if (ri === 0 || Math.abs(ri) < 1e-12) {
    return 'Zero residual income — net income exactly covers the required equity charge for the selected period.';
  }
  return 'Negative residual income — net income is insufficient to cover the required return on equity capital for the selected period. Positive accounting profit can still yield negative residual income.';
}
