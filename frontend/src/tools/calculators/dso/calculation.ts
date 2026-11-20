import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Average AR = (beginning + ending) / 2. Both must be finite and ≥ 0. */
export function calculateAverageAccountsReceivable(
  beginning: number,
  ending: number
): number | null {
  if (
    !Number.isFinite(beginning) ||
    beginning < 0 ||
    !Number.isFinite(ending) ||
    ending < 0
  ) {
    return null;
  }
  const avg = (beginning + ending) / 2;
  return Number.isFinite(avg) ? avg : null;
}

/**
 * DSO = (Average AR / Sales) × T.
 * Returns 0 when average AR is 0 and sales > 0.
 * Returns null when sales ≤ 0 or period ≤ 0.
 */
export function calculateDaysSalesOutstanding(
  averageAr: number,
  sales: number,
  periodDays: number
): number | null {
  if (
    !Number.isFinite(averageAr) ||
    averageAr < 0 ||
    !Number.isFinite(sales) ||
    !Number.isFinite(periodDays) ||
    periodDays <= 0
  ) {
    return null;
  }
  if (sales <= 0) return null;
  const dso = (averageAr / sales) * periodDays;
  return Number.isFinite(dso) ? dso : null;
}

/**
 * AR turnover = Sales / Average AR.
 * Undefined when average AR is 0 (do not show Infinity).
 */
export function calculateAccountsReceivableTurnover(
  sales: number,
  averageAr: number
): number | null {
  if (
    !Number.isFinite(sales) ||
    sales < 0 ||
    !Number.isFinite(averageAr) ||
    averageAr <= 0
  ) {
    return null;
  }
  const turnover = sales / averageAr;
  return Number.isFinite(turnover) ? turnover : null;
}

export function interpretDso(
  dso: number,
  averageAr: number,
  sales: number
): string {
  if (!Number.isFinite(dso)) {
    return 'Days sales outstanding could not be determined from the inputs.';
  }
  if (averageAr === 0 && sales > 0) {
    return `DSO is ${formatDays(dso)} days because average accounts receivable is zero with positive sales. That may reflect cash sales, reporting timing, or other accounting circumstances — not automatically proof that every customer pays immediately.`;
  }
  if (dso < 30) {
    return `A DSO of about ${formatDays(dso)} days means receivables are relatively low versus sales over this period. Faster collections can free cash, but very short credit terms may also affect customer relationships. Industry and payment terms matter.`;
  }
  if (dso <= 60) {
    return `A DSO of about ${formatDays(dso)} days is a mid-range collection period under these inputs. Compare with negotiated customer terms, peers, and prior periods rather than treating any single number as universally good or bad.`;
  }
  return `A DSO of about ${formatDays(dso)} days means receivables remain outstanding longer relative to sales. Causes can include longer credit terms, slow collections, seasonal sales, or large recent credit sales — not automatically poor performance without context.`;
}

export function formatDsoMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatDays(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatTurnover(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
