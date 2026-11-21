import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Average AP = (beginning + ending) / 2. Both must be finite and ≥ 0. */
export function calculateAverageAccountsPayable(
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
 * Purchases = COGS + Ending Inventory − Beginning Inventory.
 * Returns the signed result when inputs are finite and ≥ 0.
 * Negative purchases are returned as-is (caller blocks DPO).
 */
export function calculatePurchases(
  cogs: number,
  endingInventory: number,
  beginningInventory: number
): number | null {
  if (
    !Number.isFinite(cogs) ||
    cogs < 0 ||
    !Number.isFinite(endingInventory) ||
    endingInventory < 0 ||
    !Number.isFinite(beginningInventory) ||
    beginningInventory < 0
  ) {
    return null;
  }
  const purchases = cogs + endingInventory - beginningInventory;
  return Number.isFinite(purchases) ? purchases : null;
}

/**
 * DPO = (Average AP / Purchases) × T.
 * Returns 0 when average AP is 0 and purchases > 0.
 * Returns null when purchases ≤ 0 or period ≤ 0.
 */
export function calculateDaysPayableOutstanding(
  averageAp: number,
  purchases: number,
  periodDays: number
): number | null {
  if (
    !Number.isFinite(averageAp) ||
    averageAp < 0 ||
    !Number.isFinite(purchases) ||
    !Number.isFinite(periodDays) ||
    periodDays <= 0
  ) {
    return null;
  }
  if (purchases <= 0) return null;
  const dpo = (averageAp / purchases) * periodDays;
  return Number.isFinite(dpo) ? dpo : null;
}

/**
 * AP turnover = Purchases / Average AP.
 * Undefined when average AP is 0 (do not show Infinity).
 */
export function calculatePayablesTurnover(
  purchases: number,
  averageAp: number
): number | null {
  if (
    !Number.isFinite(purchases) ||
    purchases < 0 ||
    !Number.isFinite(averageAp) ||
    averageAp <= 0
  ) {
    return null;
  }
  const turnover = purchases / averageAp;
  return Number.isFinite(turnover) ? turnover : null;
}

export function interpretDpo(
  dpo: number,
  averageAp: number,
  purchases: number
): string {
  if (!Number.isFinite(dpo)) {
    return 'Days payable outstanding could not be determined from the inputs.';
  }
  if (averageAp === 0 && purchases > 0) {
    return `DPO is ${formatDays(dpo)} days because average accounts payable is zero with positive purchases. That may reflect immediate payment, reporting timing, or other accounting circumstances — not automatically ideal payables management.`;
  }
  if (dpo < 30) {
    return `A DPO of about ${formatDays(dpo)} days means payables are settled relatively quickly versus purchases in this period. Faster payment can support supplier relationships and discounts, but also increases near-term cash outflows. Agreed credit terms matter more than any universal “good” number.`;
  }
  if (dpo <= 60) {
    return `A DPO of about ${formatDays(dpo)} days is a mid-range payables period under these inputs. Compare with negotiated supplier terms, peers, and prior periods rather than treating the figure as universally good or bad.`;
  }
  return `A DPO of about ${formatDays(dpo)} days means accounts payable remain outstanding longer relative to purchases. That can temporarily conserve cash, but stretching beyond agreed terms can create supplier and operational risk. Context and contracts matter.`;
}

export function formatDpoMoney(
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
