import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Standard REIT / Nareit-style simplified FFO:
 * FFO = NI + D&A − Gains + Losses
 * Interest income is NOT subtracted (already in NI).
 */
export function calculateStandardFfo(
  netIncome: number,
  depreciationAmortization: number,
  gainsFromPropertySales: number,
  lossesFromPropertySales: number
): number | null {
  if (
    !Number.isFinite(netIncome) ||
    !Number.isFinite(depreciationAmortization) ||
    depreciationAmortization < 0 ||
    !Number.isFinite(gainsFromPropertySales) ||
    gainsFromPropertySales < 0 ||
    !Number.isFinite(lossesFromPropertySales) ||
    lossesFromPropertySales < 0
  ) {
    return null;
  }
  const ffo =
    netIncome +
    depreciationAmortization -
    gainsFromPropertySales +
    lossesFromPropertySales;
  return Number.isFinite(ffo) ? ffo : null;
}

/**
 * Custom reference-style adjustment (not standard Nareit):
 * Adjusted FFO = Standard FFO − Interest Income
 */
export function calculateFfoExcludingInterestIncome(
  standardFfo: number,
  interestIncome: number
): number | null {
  if (
    !Number.isFinite(standardFfo) ||
    !Number.isFinite(interestIncome) ||
    interestIncome < 0
  ) {
    return null;
  }
  const adjusted = standardFfo - interestIncome;
  return Number.isFinite(adjusted) ? adjusted : null;
}

export function interpretFfo(
  ffo: number,
  convention: 'standard' | 'excludeInterestIncome'
): string {
  if (!Number.isFinite(ffo)) {
    return 'Funds from operations could not be determined from the inputs.';
  }
  const label =
    convention === 'excludeInterestIncome'
      ? 'FFO excluding interest income'
      : 'funds from operations';
  if (ffo > 0) {
    return `Positive ${label} of ${formatPlain(ffo)} under the selected convention. Positive FFO does not guarantee cash flow, dividend capacity, or low financial risk.`;
  }
  if (ffo === 0) {
    return `Calculated ${label} is zero for the reporting period under the entered assumptions.`;
  }
  return `Negative ${label} of ${formatPlain(ffo)} under the entered assumptions. Negative FFO does not automatically mean insolvency.`;
}

function formatPlain(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatFfoMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
