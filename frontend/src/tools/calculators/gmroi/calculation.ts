import { getCurrencyFractionDigits, type SupportedCurrency } from '@/tools/shared/currency';
import type { GmroiResult } from './types';

export function calculateAverageInventory(
  startingInventory: number,
  finalInventory: number
): number {
  if (!Number.isFinite(startingInventory) || !Number.isFinite(finalInventory)) {
    return Number.NaN;
  }
  const value = (startingInventory + finalInventory) / 2;
  return Number.isFinite(value) ? value : Number.NaN;
}

export function calculateGmroi(grossProfit: number, averageInventory: number): number {
  if (!Number.isFinite(grossProfit) || !Number.isFinite(averageInventory)) {
    return Number.NaN;
  }
  if (averageInventory <= 0) return Number.NaN;
  const value = grossProfit / averageInventory;
  return Number.isFinite(value) ? value : Number.NaN;
}

function formatMoney(amount: number, currency: SupportedCurrency): string {
  if (!Number.isFinite(amount)) return '';
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

function formatRatio(value: number): string {
  const rounded = Math.round(value * 10000) / 10000;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(rounded);
}

function formatPercent(value: number): string {
  const rounded = Math.round(value * 10000) / 10000;
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(rounded);
}

export function buildGmroiResult(input: {
  startingInventory: number | null;
  finalInventory: number | null;
  averageInventory: number;
  grossProfit: number;
  currency: SupportedCurrency;
}): GmroiResult | null {
  const gmroi = calculateGmroi(input.grossProfit, input.averageInventory);
  if (!Number.isFinite(gmroi)) return null;
  const gmroiPercent = gmroi * 100;
  if (!Number.isFinite(gmroiPercent)) return null;

  return {
    startingInventory: input.startingInventory,
    finalInventory: input.finalInventory,
    averageInventory: input.averageInventory,
    grossProfit: input.grossProfit,
    gmroi,
    gmroiPercent,
    currency: input.currency,
    averageDisplay: formatMoney(input.averageInventory, input.currency),
    gmroiDisplay: formatRatio(gmroi),
    gmroiPercentDisplay: formatPercent(gmroiPercent),
  };
}
