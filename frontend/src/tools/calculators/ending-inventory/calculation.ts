import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Ending Inventory = Starting + Net Purchases − COGS. Inputs ≥ 0. */
export function calculateEndingInventory(
  startingInventory: number,
  netPurchases: number,
  cogs: number
): number | null {
  if (
    !Number.isFinite(startingInventory) ||
    startingInventory < 0 ||
    !Number.isFinite(netPurchases) ||
    netPurchases < 0 ||
    !Number.isFinite(cogs) ||
    cogs < 0
  ) {
    return null;
  }
  const ending = startingInventory + netPurchases - cogs;
  return Number.isFinite(ending) ? ending : null;
}

/** Average Inventory = (Starting + Ending) / 2. */
export function calculateAverageInventory(
  startingInventory: number,
  endingInventory: number
): number | null {
  if (
    !Number.isFinite(startingInventory) ||
    startingInventory < 0 ||
    !Number.isFinite(endingInventory) ||
    endingInventory < 0
  ) {
    return null;
  }
  const avg = (startingInventory + endingInventory) / 2;
  return Number.isFinite(avg) ? avg : null;
}

/** Inventory Turnover = COGS / Average Inventory. Undefined when avg ≤ 0. */
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
  const t = cogs / averageInventory;
  return Number.isFinite(t) ? t : null;
}

/**
 * Derive COGS from turnover when COGS is unknown:
 * COGS = T(2B + P) / (T + 2)
 */
export function calculateCogsFromTurnover(
  startingInventory: number,
  netPurchases: number,
  turnover: number
): number | null {
  if (
    !Number.isFinite(startingInventory) ||
    startingInventory < 0 ||
    !Number.isFinite(netPurchases) ||
    netPurchases < 0 ||
    !Number.isFinite(turnover) ||
    turnover < 0
  ) {
    return null;
  }
  // B = P = 0: no inventory flow; turnover is undefined for any T > 0
  if (startingInventory === 0 && netPurchases === 0) {
    if (turnover === 0) return 0;
    return null;
  }
  const denom = turnover + 2;
  if (denom === 0) return null;
  const cogs = (turnover * (2 * startingInventory + netPurchases)) / denom;
  if (!Number.isFinite(cogs) || cogs < 0) return null;
  return cogs;
}

export function interpretEndingInventory(
  endingInventory: number,
  turnover: number | null
): string {
  if (!Number.isFinite(endingInventory) || endingInventory < 0) {
    return 'Ending inventory could not be determined as a valid nonnegative balance.';
  }
  let base: string;
  if (endingInventory === 0) {
    base =
      'Ending inventory is zero: the inventory-flow equation indicates no remaining stock at period end. That does not by itself prove efficient operations.';
  } else {
    base = `Ending inventory of ${formatPlain(endingInventory)} is the remaining inventory value at period end under the entered cost basis.`;
  }
  if (turnover === null) {
    return `${base} Inventory turnover is unavailable (average inventory is zero or undefined).`;
  }
  if (turnover === 0) {
    return `${base} Inventory turnover is 0 — no COGS relative to average inventory for the period.`;
  }
  return `${base} Inventory turned over ${formatTurnover(turnover)} times relative to average inventory. Higher turnover means goods moved more often; very high turnover can also signal stockout risk.`;
}

function formatPlain(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatEndingInventoryMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatTurnover(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}
