import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Effective tax rate decimal = (PreTax − NetIncome) / PreTax
 * when PreTax ≠ 0.
 */
export function calculateEffectiveTaxRate(
  netIncome: number,
  preTaxIncome: number
): number | null {
  if (!Number.isFinite(netIncome) || !Number.isFinite(preTaxIncome)) {
    return null;
  }
  if (preTaxIncome === 0) return null;
  const rate = (preTaxIncome - netIncome) / preTaxIncome;
  return Number.isFinite(rate) ? rate : null;
}

/** D/E = Debt / Equity when Equity > 0 and Debt ≥ 0 */
export function calculateDebtToEquity(
  totalDebt: number,
  shareholdersEquity: number
): number | null {
  if (!Number.isFinite(totalDebt) || !Number.isFinite(shareholdersEquity)) {
    return null;
  }
  if (totalDebt < 0) return null;
  if (shareholdersEquity <= 0) return null;
  const ratio = totalDebt / shareholdersEquity;
  return Number.isFinite(ratio) ? ratio : null;
}

/**
 * Hamada-style: βU = βL / [1 + (1 − T) × (D/E)]
 * T is a decimal tax rate in [0, 1].
 */
export function calculateUnleveredBeta(
  leveredBeta: number,
  taxRateDecimal: number,
  debtToEquity: number
): number | null {
  if (
    !Number.isFinite(leveredBeta) ||
    !Number.isFinite(taxRateDecimal) ||
    !Number.isFinite(debtToEquity)
  ) {
    return null;
  }
  if (taxRateDecimal < 0 || taxRateDecimal > 1) return null;
  if (debtToEquity < 0) return null;

  const denominator = 1 + (1 - taxRateDecimal) * debtToEquity;
  if (!Number.isFinite(denominator) || Math.abs(denominator) < 1e-15) {
    return null;
  }
  const unlevered = leveredBeta / denominator;
  return Number.isFinite(unlevered) ? unlevered : null;
}

/** Reverse: βL = βU × [1 + (1 − T) × (D/E)] */
export function calculateLeveredBeta(
  unleveredBeta: number,
  taxRateDecimal: number,
  debtToEquity: number
): number | null {
  if (
    !Number.isFinite(unleveredBeta) ||
    !Number.isFinite(taxRateDecimal) ||
    !Number.isFinite(debtToEquity)
  ) {
    return null;
  }
  if (taxRateDecimal < 0 || taxRateDecimal > 1) return null;
  if (debtToEquity < 0) return null;
  const levered =
    unleveredBeta * (1 + (1 - taxRateDecimal) * debtToEquity);
  return Number.isFinite(levered) ? levered : null;
}

export function formatUbMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatUbPercent(value: number, digits = 2): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}%`;
}

export function formatUbRatio(value: number, digits = 2): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}×`;
}

export function formatUbBeta(value: number, digits = 4): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function interpretUnleveredBeta(beta: number): string {
  if (!Number.isFinite(beta)) {
    return 'Unlevered beta is unavailable.';
  }
  if (beta < 0) {
    return 'Negative unlevered beta suggests estimated inverse linear sensitivity to market moves under the model assumptions. Context and estimation method still matter — beta does not measure every risk.';
  }
  if (Math.abs(beta) < 1e-12) {
    return 'Unlevered beta near zero suggests little estimated linear market sensitivity for the business risk measure under the selected assumptions.';
  }
  if (beta < 1) {
    return 'Unlevered beta below 1 suggests lower estimated positive systematic business sensitivity than the broad market under the model assumptions. This does not mean the investment is automatically “safe.”';
  }
  if (Math.abs(beta - 1) < 1e-9) {
    return 'Unlevered beta near 1 suggests estimated business systematic sensitivity similar to the market under the selected assumptions.';
  }
  return 'Unlevered beta above 1 suggests higher estimated positive systematic business sensitivity than the market under the model assumptions. Beta is not a complete risk measure.';
}
