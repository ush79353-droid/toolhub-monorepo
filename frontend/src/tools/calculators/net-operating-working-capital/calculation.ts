import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** COA = Cash + AR + Inventories. All ≥ 0. */
export function calculateCurrentOperatingAssets(
  cash: number,
  accountsReceivable: number,
  inventories: number
): number | null {
  const parts = [cash, accountsReceivable, inventories];
  if (parts.some((v) => !Number.isFinite(v) || v < 0)) return null;
  const total = cash + accountsReceivable + inventories;
  return Number.isFinite(total) ? total : null;
}

/** COL = AP + Accrued expenses. Both ≥ 0. */
export function calculateCurrentOperatingLiabilities(
  accountsPayable: number,
  accruedExpenses: number
): number | null {
  if (
    !Number.isFinite(accountsPayable) ||
    accountsPayable < 0 ||
    !Number.isFinite(accruedExpenses) ||
    accruedExpenses < 0
  ) {
    return null;
  }
  const total = accountsPayable + accruedExpenses;
  return Number.isFinite(total) ? total : null;
}

/** NOWC = COA − COL. Negative NOWC is valid. */
export function calculateNetOperatingWorkingCapital(
  currentOperatingAssets: number,
  currentOperatingLiabilities: number
): number | null {
  if (
    !Number.isFinite(currentOperatingAssets) ||
    currentOperatingAssets < 0 ||
    !Number.isFinite(currentOperatingLiabilities) ||
    currentOperatingLiabilities < 0
  ) {
    return null;
  }
  const nowc = currentOperatingAssets - currentOperatingLiabilities;
  return Number.isFinite(nowc) ? nowc : null;
}

export function interpretNowc(
  nowc: number,
  coa: number,
  col: number
): string {
  if (Math.abs(nowc) < 5e-12) {
    return 'NOWC is zero — current operating assets equal current operating liabilities under this simplified classification.';
  }
  if (nowc > 0) {
    return `Positive NOWC: current operating assets (${formatPlain(coa)}) exceed current operating liabilities (${formatPlain(col)}) by ${formatPlain(nowc)}. This is a balance-sheet operating-capital measure, not a profitability metric.`;
  }
  return `Negative NOWC: current operating liabilities (${formatPlain(col)}) exceed current operating assets (${formatPlain(coa)}) by ${formatPlain(Math.abs(nowc))}. Negative NOWC is not automatically insolvency — some models run with supplier credit and fast turnover.`;
}

export function formatNowcMoney(
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
