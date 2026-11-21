import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Average Inventory = (Beginning + Ending) / 2. Both ≥ 0. */
export function calculateAverageInventory(
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
 * Inventory Turnover = COGS / Average Inventory.
 * - average = 0 → undefined (null)
 * - COGS = 0 with average > 0 → 0
 */
export function calculateInventoryTurnover(
  cogs: number,
  averageInventory: number
): number | null {
  if (
    !Number.isFinite(cogs) ||
    cogs < 0 ||
    !Number.isFinite(averageInventory) ||
    averageInventory < 0
  ) {
    return null;
  }
  if (averageInventory === 0) return null;
  const turnover = cogs / averageInventory;
  return Number.isFinite(turnover) ? turnover : null;
}

/**
 * Inventory Days = (Average Inventory / COGS) × Days.
 * - COGS = 0 → null (unavailable / indeterminate with zero inventory)
 * - COGS > 0 and average = 0 → 0 days
 * - days ≤ 0 → null
 */
export function calculateInventoryDays(
  cogs: number,
  averageInventory: number,
  days: number
): number | null {
  if (
    !Number.isFinite(cogs) ||
    cogs < 0 ||
    !Number.isFinite(averageInventory) ||
    averageInventory < 0 ||
    !Number.isFinite(days) ||
    days <= 0
  ) {
    return null;
  }
  if (cogs === 0) return null;
  const inventoryDays = (averageInventory / cogs) * days;
  return Number.isFinite(inventoryDays) ? inventoryDays : null;
}

export function interpretInventoryTurnover(
  turnover: number | null,
  inventoryDays: number | null,
  averageInventory: number,
  cogs: number
): string {
  if (averageInventory === 0 && cogs === 0) {
    return 'Both COGS and average inventory are zero; inventory turnover and inventory days are undefined under the standard formulas.';
  }
  if (averageInventory === 0 && cogs > 0) {
    return 'Average inventory is zero with positive COGS. Inventory turnover is undefined (do not show Infinity). Inventory days equal 0 under the direct formula, which may reflect timing, a special model, or a data issue; not automatically perfect efficiency.';
  }
  if (cogs === 0 && averageInventory > 0) {
    return 'COGS is zero with positive average inventory. Turnover is 0.00×; inventory days cannot be calculated (division by zero COGS).';
  }
  if (turnover === null) {
    return 'Inventory turnover could not be determined from the inputs.';
  }
  const daysPart =
    inventoryDays !== null
      ? ` Average holding period ≈ ${formatInvDays(inventoryDays)} days.`
      : '';
  if (turnover >= 8) {
    return `Inventory turnover of ${formatInvTurnover(turnover)}× indicates relatively fast inventory movement versus average stock under these inputs.${daysPart} Very high turnover can free cash but may raise stockout risk; judge with industry context.`;
  }
  if (turnover >= 3) {
    return `Inventory turnover of ${formatInvTurnover(turnover)}× means COGS was about ${formatInvTurnover(turnover)} times average inventory in the period.${daysPart} Compare with peers, seasonality, and prior periods.`;
  }
  return `Inventory turnover of ${formatInvTurnover(turnover)}× indicates slower inventory movement relative to average stock under these inputs.${daysPart} Causes can include seasonality, weak demand, or intentional stock builds; not automatically poor performance.`;
}

export function formatInvMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatInvTurnover(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatInvDays(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
