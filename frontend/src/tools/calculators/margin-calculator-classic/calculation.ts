import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { MarginClassicDriver } from './types';

export function formatMoneyAmount(
  amount: number,
  currency: SupportedCurrency
): string {
  if (!Number.isFinite(amount)) return '';
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatPercentValue(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 1e10) / 1e10;
  const text = rounded.toFixed(10).replace(/\.?0+$/, '');
  return text === '-0' ? '0' : text;
}

export interface MarginClassicSolveInput {
  cost: number | null;
  marginPercent: number | null;
  revenue: number | null;
  profit: number | null;
  driver: MarginClassicDriver;
  marginPinned: boolean;
}

export interface MarginClassicSolveResult {
  cost: number;
  marginPercent: number;
  revenue: number;
  profit: number;
}

/**
 * Bidirectional margin solve in one currency.
 * Profit = Revenue − Cost
 * Margin (%) = (Profit / Revenue) × 100
 * Revenue = Cost / (1 − Margin/100)
 * Revenue = Cost + Profit
 *
 * Margin 100% cannot solve for revenue from cost. Zero revenue is rejected.
 */
export function solveMarginClassic(
  input: MarginClassicSolveInput
): MarginClassicSolveResult | null {
  const { marginPinned } = input;
  let driver = input.driver;

  if (marginPinned && driver === 'cost' && input.marginPercent !== null) {
    driver = 'margin';
  }

  if (driver === 'margin') {
    if (input.cost === null || input.marginPercent === null) return null;
    if (!(input.marginPercent < 100)) return null;
    const denom = 1 - input.marginPercent / 100;
    if (!(denom > 0)) return null;
    const revenue = input.cost / denom;
    if (!Number.isFinite(revenue) || revenue === 0) return null;
    const profit = revenue - input.cost;
    if (!Number.isFinite(profit)) return null;
    return {
      cost: input.cost,
      marginPercent: input.marginPercent,
      revenue,
      profit,
    };
  }

  if (driver === 'revenue') {
    if (input.revenue === null || !(input.revenue !== 0)) return null;

    if (marginPinned && input.marginPercent !== null) {
      if (!(input.marginPercent < 100)) return null;
      const factor = 1 - input.marginPercent / 100;
      if (!(factor > 0)) return null;
      const cost = input.revenue * factor;
      if (!Number.isFinite(cost)) return null;
      const profit = input.revenue - cost;
      if (!Number.isFinite(profit)) return null;
      return {
        cost,
        marginPercent: input.marginPercent,
        revenue: input.revenue,
        profit,
      };
    }

    if (input.cost === null) return null;
    const profit = input.revenue - input.cost;
    const marginPercent = (profit / input.revenue) * 100;
    if (!Number.isFinite(profit) || !Number.isFinite(marginPercent)) return null;
    return {
      cost: input.cost,
      marginPercent,
      revenue: input.revenue,
      profit,
    };
  }

  if (driver === 'profit') {
    if (input.profit === null) return null;

    if (marginPinned && input.marginPercent !== null) {
      if (!(input.marginPercent !== 0) || !(input.marginPercent < 100)) return null;
      const revenue = input.profit / (input.marginPercent / 100);
      if (!Number.isFinite(revenue) || revenue === 0) return null;
      const cost = revenue - input.profit;
      if (!Number.isFinite(cost)) return null;
      return {
        cost,
        marginPercent: input.marginPercent,
        revenue,
        profit: input.profit,
      };
    }

    if (input.cost === null) return null;
    const revenue = input.cost + input.profit;
    if (!Number.isFinite(revenue) || revenue === 0) return null;
    const marginPercent = (input.profit / revenue) * 100;
    if (!Number.isFinite(marginPercent)) return null;
    return {
      cost: input.cost,
      marginPercent,
      revenue,
      profit: input.profit,
    };
  }

  // driver === 'cost' and margin not usable as pin hold
  if (input.cost === null) return null;
  if (input.marginPercent !== null) {
    return solveMarginClassic({
      ...input,
      driver: 'margin',
      marginPinned: false,
    });
  }
  if (input.revenue !== null) {
    return solveMarginClassic({
      ...input,
      driver: 'revenue',
      marginPinned: false,
    });
  }
  if (input.profit !== null) {
    return solveMarginClassic({
      ...input,
      driver: 'profit',
      marginPinned: false,
    });
  }
  return null;
}
