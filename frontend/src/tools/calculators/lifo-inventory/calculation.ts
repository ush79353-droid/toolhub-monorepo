import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { LifoLayerAllocation } from './types';

export function calculateBatchCost(
  quantity: number,
  unitCost: number
): number | null {
  if (
    !Number.isFinite(quantity) ||
    quantity < 0 ||
    !Number.isFinite(unitCost) ||
    unitCost < 0
  ) {
    return null;
  }
  const cost = quantity * unitCost;
  return Number.isFinite(cost) ? cost : null;
}

/**
 * LIFO allocation: deplete newest batch (batch 2) first, then batch 1.
 */
export function allocateLifoInventory(
  batch1Qty: number,
  batch1Price: number,
  batch2Qty: number,
  batch2Price: number,
  unitsSold: number
): {
  sold1: number;
  sold2: number;
  remain1: number;
  remain2: number;
  cogs: number;
  endingInventory: number;
  layers: LifoLayerAllocation[];
} | null {
  if (
    !Number.isSafeInteger(batch1Qty) ||
    batch1Qty < 0 ||
    !Number.isSafeInteger(batch2Qty) ||
    batch2Qty < 0 ||
    !Number.isSafeInteger(unitsSold) ||
    unitsSold < 0 ||
    !Number.isFinite(batch1Price) ||
    batch1Price < 0 ||
    !Number.isFinite(batch2Price) ||
    batch2Price < 0
  ) {
    return null;
  }

  const available = batch1Qty + batch2Qty;
  if (unitsSold > available) return null;

  const sold2 = Math.min(unitsSold, batch2Qty);
  const sold1 = unitsSold - sold2;
  const remain1 = batch1Qty - sold1;
  const remain2 = batch2Qty - sold2;

  const cogs = sold2 * batch2Price + sold1 * batch1Price;
  const endingInventory = remain1 * batch1Price + remain2 * batch2Price;

  if (!Number.isFinite(cogs) || !Number.isFinite(endingInventory)) return null;

  const layers: LifoLayerAllocation[] = [
    {
      label: 'First batch (older)',
      purchased: batch1Qty,
      sold: sold1,
      remaining: remain1,
      unitCost: batch1Price,
      cogs: sold1 * batch1Price,
      endingValue: remain1 * batch1Price,
    },
    {
      label: 'Second batch (newest)',
      purchased: batch2Qty,
      sold: sold2,
      remaining: remain2,
      unitCost: batch2Price,
      cogs: sold2 * batch2Price,
      endingValue: remain2 * batch2Price,
    },
  ];

  return { sold1, sold2, remain1, remain2, cogs, endingInventory, layers };
}

export function calculateRevenue(
  unitsSold: number,
  sellingPrice: number
): number | null {
  if (
    !Number.isSafeInteger(unitsSold) ||
    unitsSold < 0 ||
    !Number.isFinite(sellingPrice) ||
    sellingPrice < 0
  ) {
    return null;
  }
  const revenue = unitsSold * sellingPrice;
  return Number.isFinite(revenue) ? revenue : null;
}

export function calculateGrossProfit(
  revenue: number,
  cogs: number
): number | null {
  if (!Number.isFinite(revenue) || !Number.isFinite(cogs)) return null;
  const profit = revenue - cogs;
  return Number.isFinite(profit) ? profit : null;
}

/** Gross margin % — null when revenue is 0. */
export function calculateGrossProfitMargin(
  grossProfit: number,
  revenue: number
): number | null {
  if (!Number.isFinite(grossProfit) || !Number.isFinite(revenue) || revenue === 0) {
    return null;
  }
  const margin = (grossProfit / revenue) * 100;
  return Number.isFinite(margin) ? margin : null;
}

export function interpretLifo(
  cogs: number,
  endingInventory: number,
  unitsSold: number,
  revenue: number,
  grossProfit: number
): string {
  if (unitsSold === 0) {
    return 'No units sold; LIFO COGS is $0 and ending inventory equals total purchase cost. Gross margin is unavailable because revenue is zero.';
  }
  if (endingInventory === 0) {
    return `All purchased units were sold under LIFO. COGS equals total purchase cost. Revenue ${formatLifoMoneyPlain(revenue)}; gross profit ${formatLifoMoneyPlain(grossProfit)}.`;
  }
  return `Under LIFO, the newest purchase costs enter COGS first. COGS ${formatLifoMoneyPlain(cogs)}; ending inventory ${formatLifoMoneyPlain(endingInventory)} retains older cost layers. Gross profit ${formatLifoMoneyPlain(grossProfit)}. LIFO is a cost-flow assumption; not a requirement that the newest physical units ship first.`;
}

export function formatLifoMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

function formatLifoMoneyPlain(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatLifoPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
