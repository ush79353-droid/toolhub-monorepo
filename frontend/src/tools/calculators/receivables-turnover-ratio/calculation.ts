import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Average AR = (Opening + Closing) / 2. Both ≥ 0. */
export function calculateAverageAccountsReceivable(
  openingAR: number,
  closingAR: number
): number | null {
  if (
    !Number.isFinite(openingAR) ||
    openingAR < 0 ||
    !Number.isFinite(closingAR) ||
    closingAR < 0
  ) {
    return null;
  }
  const averageAR = (openingAR + closingAR) / 2;
  return Number.isFinite(averageAR) ? averageAR : null;
}

/**
 * RTR = Net Credit Sales ÷ Average AR.
 * - average AR ≤ 0 → undefined (null)
 * - sales = 0 with average AR > 0 → 0
 */
export function calculateReceivablesTurnoverRatio(
  netCreditSales: number,
  averageAccountsReceivable: number
): number | null {
  if (
    !Number.isFinite(netCreditSales) ||
    netCreditSales < 0 ||
    !Number.isFinite(averageAccountsReceivable) ||
    averageAccountsReceivable < 0
  ) {
    return null;
  }
  if (averageAccountsReceivable === 0) return null;
  const turnover = netCreditSales / averageAccountsReceivable;
  return Number.isFinite(turnover) ? turnover : null;
}

export function formatRtrMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatRtrRatio(ratio: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(ratio);
}

export function interpretReceivablesTurnover(
  turnover: number | null,
  averageAR: number,
  netCreditSales: number | null
): string {
  if (averageAR === 0) {
    if (netCreditSales === 0) {
      return 'Average accounts receivable is zero and net credit sales are zero: the turnover ratio is undefined under the standard formula.';
    }
    return 'Receivables turnover is undefined because average accounts receivable is zero (division by zero).';
  }
  if (turnover === null) {
    return 'Enter net credit sales to calculate the receivables turnover ratio.';
  }
  if (Math.abs(turnover) < 5e-12) {
    return 'Turnover is 0 times; net credit sales are zero while average receivables are positive.';
  }
  return `Receivables turnover is ${formatRtrRatio(turnover)} times for the reporting period; net credit sales are about ${formatRtrRatio(turnover)}× average accounts receivable. Compare with payment terms, history, and industry peers; this is not a profit or percentage metric.`;
}
