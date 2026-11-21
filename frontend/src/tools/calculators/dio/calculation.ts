import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Average inventory = (starting + ending) / 2. Both must be finite and ≥ 0. */
export function calculateAverageInventory(
  starting: number,
  ending: number
): number | null {
  if (
    !Number.isFinite(starting) ||
    starting < 0 ||
    !Number.isFinite(ending) ||
    ending < 0
  ) {
    return null;
  }
  const avg = (starting + ending) / 2;
  return Number.isFinite(avg) ? avg : null;
}

/**
 * DIO = (Average Inventory / COGS) × T.
 * Returns 0 when inventory is 0 and COGS > 0.
 * Returns null when COGS ≤ 0 or period ≤ 0.
 */
export function calculateDaysInventoryOutstanding(
  averageInventory: number,
  cogs: number,
  periodDays: number
): number | null {
  if (
    !Number.isFinite(averageInventory) ||
    averageInventory < 0 ||
    !Number.isFinite(cogs) ||
    !Number.isFinite(periodDays) ||
    periodDays <= 0
  ) {
    return null;
  }
  if (cogs <= 0) return null;
  const dio = (averageInventory / cogs) * periodDays;
  return Number.isFinite(dio) ? dio : null;
}

/**
 * Inventory turnover = COGS / Average Inventory.
 * Undefined when average inventory is 0 (do not show Infinity).
 */
export function calculateInventoryTurnover(
  cogs: number,
  averageInventory: number
): number | null {
  if (
    !Number.isFinite(cogs) ||
    cogs < 0 ||
    !Number.isFinite(averageInventory) ||
    averageInventory <= 0
  ) {
    return null;
  }
  const turnover = cogs / averageInventory;
  return Number.isFinite(turnover) ? turnover : null;
}

export function interpretDio(
  dio: number,
  averageInventory: number,
  cogs: number
): string {
  if (!Number.isFinite(dio)) {
    return 'Days inventory outstanding could not be determined from the inputs.';
  }
  if (averageInventory === 0 && cogs > 0) {
    return `DIO is ${formatDays(dio)} days because average inventory is zero with positive COGS. That may reflect a special business model, measurement timing, or a data issue; not automatically perfect inventory management.`;
  }
  if (dio < 30) {
    return `A DIO of about ${formatDays(dio)} days means inventory is relatively low versus COGS over this period. Faster turns can free cash, but very low DIO may also signal thin safety stock or stockout risk. Industry context matters.`;
  }
  if (dio <= 90) {
    return `A DIO of about ${formatDays(dio)} days is a mid-range holding period under these inputs. Compare with peers and prior periods rather than treating any single number as universally good or bad.`;
  }
  return `A DIO of about ${formatDays(dio)} days means inventory remains on hand longer relative to COGS in this period. Causes can include seasonality, long production cycles, weak demand, or overstocking; not automatically poor performance without industry context.`;
}

export function formatDioMoney(
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
