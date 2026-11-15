import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { CostOfGoodsSoldResult } from './types';

/**
 * COGS = Beginning Inventory + Purchases − Ending Inventory
 */
export function calculateCogs(
  beginningInventory: number,
  purchases: number,
  endingInventory: number
): number {
  return beginningInventory + purchases - endingInventory;
}

export function formatCogsAmount(amount: number, currency: SupportedCurrency): string {
  if (!Number.isFinite(amount)) return '';
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function buildCostOfGoodsSoldResult(
  beginningInventory: number,
  purchases: number,
  endingInventory: number,
  currency: SupportedCurrency
): CostOfGoodsSoldResult {
  const cogs = calculateCogs(beginningInventory, purchases, endingInventory);
  return {
    beginningInventory,
    purchases,
    endingInventory,
    cogs,
    currency,
    cogsDisplay: formatCogsAmount(cogs, currency),
  };
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(amount, currency);
}
