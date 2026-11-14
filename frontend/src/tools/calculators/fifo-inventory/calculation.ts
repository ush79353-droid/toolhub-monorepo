import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { FifoInventoryInput, FifoInventoryResult } from './types';

export function calculateFifoCogs(
  unitsSold: number,
  batch1Qty: number,
  batch1Price: number,
  batch2Qty: number,
  batch2Price: number
): number {
  if (
    !Number.isFinite(unitsSold) ||
    !Number.isFinite(batch1Qty) ||
    !Number.isFinite(batch1Price) ||
    !Number.isFinite(batch2Qty) ||
    !Number.isFinite(batch2Price)
  ) {
    return Number.NaN;
  }
  if (unitsSold < 0 || batch1Qty < 0 || batch2Qty < 0 || batch1Price < 0 || batch2Price < 0) {
    return Number.NaN;
  }
  if (unitsSold > batch1Qty + batch2Qty) return Number.NaN;

  const fromBatch1 = Math.min(unitsSold, batch1Qty);
  const fromBatch2 = Math.max(0, unitsSold - batch1Qty);
  if (fromBatch2 > batch2Qty) return Number.NaN;

  const cogs = fromBatch1 * batch1Price + fromBatch2 * batch2Price;
  return Number.isFinite(cogs) ? cogs : Number.NaN;
}

function formatAmount(amount: number, currency: SupportedCurrency): string {
  if (!Number.isFinite(amount)) return '';
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

function formatPercent(rate: number): string {
  const rounded = Math.round(rate * 10000) / 10000;
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(rounded);
}

export function calculateFifoInventory(input: FifoInventoryInput): FifoInventoryResult | null {
  const {
    batch1Price,
    batch1Qty,
    batch2Price,
    batch2Qty,
    unitsSold,
    sellingPrice,
    currency,
  } = input;

  if (
    !Number.isFinite(batch1Price) ||
    !Number.isFinite(batch1Qty) ||
    !Number.isFinite(batch2Price) ||
    !Number.isFinite(batch2Qty) ||
    !Number.isFinite(unitsSold) ||
    !Number.isFinite(sellingPrice)
  ) {
    return null;
  }
  if (
    batch1Price < 0 ||
    batch1Qty < 0 ||
    batch2Price < 0 ||
    batch2Qty < 0 ||
    unitsSold < 0 ||
    sellingPrice < 0
  ) {
    return null;
  }
  if (unitsSold > batch1Qty + batch2Qty) return null;

  const revenue = unitsSold * sellingPrice;
  if (!Number.isFinite(revenue)) return null;

  const fifoCogs = calculateFifoCogs(
    unitsSold,
    batch1Qty,
    batch1Price,
    batch2Qty,
    batch2Price
  );
  if (!Number.isFinite(fifoCogs)) return null;

  const grossProfit = revenue - fifoCogs;
  if (!Number.isFinite(grossProfit)) return null;

  const grossMarginPercent =
    revenue > 0 && Number.isFinite((grossProfit / revenue) * 100)
      ? (grossProfit / revenue) * 100
      : null;

  return {
    batch1Price,
    batch1Qty,
    batch2Price,
    batch2Qty,
    unitsSold,
    sellingPrice,
    revenue,
    fifoCogs,
    grossProfit,
    grossMarginPercent,
    currency,
    revenueDisplay: formatAmount(revenue, currency),
    cogsDisplay: formatAmount(fifoCogs, currency),
    profitDisplay: formatAmount(grossProfit, currency),
    marginDisplay: grossMarginPercent === null ? '' : formatPercent(grossMarginPercent),
    shareRevenue: formatCurrencyValue(revenue, currency),
    shareCogs: formatCurrencyValue(fifoCogs, currency),
    shareProfit: formatCurrencyValue(grossProfit, currency),
  };
}
