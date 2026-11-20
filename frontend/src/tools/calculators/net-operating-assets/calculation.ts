import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** OA = C + AR + I + PE + FA. All ≥ 0. */
export function calculateOperatingAssets(
  cash: number,
  accountsReceivable: number,
  inventory: number,
  prepaidExpenses: number,
  fixedAssets: number
): number | null {
  const parts = [
    cash,
    accountsReceivable,
    inventory,
    prepaidExpenses,
    fixedAssets,
  ];
  if (parts.some((v) => !Number.isFinite(v) || v < 0)) return null;
  const total = parts.reduce((sum, v) => sum + v, 0);
  return Number.isFinite(total) ? total : null;
}

/** OL = AP + AOE. Both ≥ 0. */
export function calculateOperatingLiabilities(
  accountsPayable: number,
  accruedOperatingExpenses: number
): number | null {
  if (
    !Number.isFinite(accountsPayable) ||
    accountsPayable < 0 ||
    !Number.isFinite(accruedOperatingExpenses) ||
    accruedOperatingExpenses < 0
  ) {
    return null;
  }
  const total = accountsPayable + accruedOperatingExpenses;
  return Number.isFinite(total) ? total : null;
}

/** NOA = OA − OL. Negative NOA is valid. */
export function calculateNetOperatingAssets(
  operatingAssets: number,
  operatingLiabilities: number
): number | null {
  if (
    !Number.isFinite(operatingAssets) ||
    operatingAssets < 0 ||
    !Number.isFinite(operatingLiabilities) ||
    operatingLiabilities < 0
  ) {
    return null;
  }
  const noa = operatingAssets - operatingLiabilities;
  return Number.isFinite(noa) ? noa : null;
}

export function interpretNoa(
  noa: number,
  operatingAssets: number,
  operatingLiabilities: number
): string {
  if (Math.abs(noa) < 5e-12) {
    return 'NOA is zero — operating assets equal operating liabilities under this simplified classification.';
  }
  if (noa > 0) {
    return `Positive NOA: operating assets (${formatPlain(operatingAssets)}) exceed operating liabilities (${formatPlain(operatingLiabilities)}) by ${formatPlain(noa)}. NOA is a balance-sheet measure, not a profitability metric.`;
  }
  return `Negative NOA: operating liabilities (${formatPlain(operatingLiabilities)}) exceed operating assets (${formatPlain(operatingAssets)}) by ${formatPlain(Math.abs(noa))}. Negative NOA is not automatically insolvency — interpret with the business model.`;
}

export function formatNoaMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

function formatPlain(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
