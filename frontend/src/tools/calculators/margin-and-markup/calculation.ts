import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { MarginMarkupDriver } from './types';

export function formatMoneyAmount(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatPercentValue(value: number): string {
  if (!Number.isFinite(value)) return '—';
  const rounded = Math.round(value * 1e8) / 1e8;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(rounded);
}

/** markup% from margin%: markup = 1/(1 − m) − 1 */
export function markupFromMarginPercent(marginPercent: number): number | null {
  if (!Number.isFinite(marginPercent)) return null;
  const m = marginPercent / 100;
  if (!(1 - m > 0)) return null;
  const markup = (1 / (1 - m) - 1) * 100;
  return Number.isFinite(markup) ? markup : null;
}

/** margin% from markup%: margin = mu / (1 + mu) */
export function marginFromMarkupPercent(markupPercent: number): number | null {
  if (!Number.isFinite(markupPercent)) return null;
  const mu = markupPercent / 100;
  if (!(1 + mu > 0)) return null;
  const margin = (mu / (1 + mu)) * 100;
  return Number.isFinite(margin) ? margin : null;
}

export interface ScenarioSolveInput {
  cost: number;
  marginPercent: number | null;
  markupPercent: number | null;
  revenue: number | null;
  profit: number | null;
  driver: MarginMarkupDriver;
}

export interface ScenarioSolveResult {
  marginPercent: number;
  markupPercent: number;
  revenue: number;
  profit: number;
}

function markupFromProfitCost(profit: number, cost: number): number | null {
  if (cost === 0) return profit === 0 ? 0 : null;
  const markup = (profit / cost) * 100;
  return Number.isFinite(markup) ? markup : null;
}

/**
 * Bidirectional solve in one currency (canonical = cost currency).
 * Profit = Revenue − Cost
 * Margin (%) = Profit / Revenue × 100
 * Markup (%) = Profit / Cost × 100
 * Revenue = Cost / (1 − Margin/100) | Cost × (1 + Markup/100)
 */
export function solveScenario(
  input: ScenarioSolveInput
): ScenarioSolveResult | null {
  const { cost, driver } = input;
  if (!Number.isFinite(cost)) return null;

  if (driver === 'cost') {
    if (input.marginPercent !== null && Number.isFinite(input.marginPercent)) {
      return solveScenario({ ...input, driver: 'margin' });
    }
    if (input.markupPercent !== null && Number.isFinite(input.markupPercent)) {
      return solveScenario({ ...input, driver: 'markup' });
    }
    if (input.revenue !== null && Number.isFinite(input.revenue)) {
      return solveScenario({ ...input, driver: 'revenue' });
    }
    if (input.profit !== null && Number.isFinite(input.profit)) {
      return solveScenario({ ...input, driver: 'profit' });
    }
    return null;
  }

  if (driver === 'margin') {
    if (input.marginPercent === null || !Number.isFinite(input.marginPercent)) {
      return null;
    }
    if (!(input.marginPercent < 100)) return null;
    const denom = 1 - input.marginPercent / 100;
    if (!(denom > 0)) return null;
    const revenue = cost / denom;
    if (!Number.isFinite(revenue)) return null;
    const profit = revenue - cost;
    const markup = markupFromProfitCost(profit, cost);
    if (markup === null) return null;
    return {
      marginPercent: input.marginPercent,
      markupPercent: markup,
      revenue,
      profit,
    };
  }

  if (driver === 'markup') {
    if (input.markupPercent === null || !Number.isFinite(input.markupPercent)) {
      return null;
    }
    const revenue = cost * (1 + input.markupPercent / 100);
    if (!Number.isFinite(revenue) || !(revenue !== 0)) return null;
    const profit = revenue - cost;
    const margin = (profit / revenue) * 100;
    if (!Number.isFinite(margin)) return null;
    return {
      marginPercent: margin,
      markupPercent: input.markupPercent,
      revenue,
      profit,
    };
  }

  if (driver === 'revenue') {
    if (input.revenue === null || !Number.isFinite(input.revenue)) return null;
    if (!(input.revenue !== 0)) return null;
    const profit = input.revenue - cost;
    const margin = (profit / input.revenue) * 100;
    const markup = markupFromProfitCost(profit, cost);
    if (markup === null || !Number.isFinite(margin)) return null;
    return {
      marginPercent: margin,
      markupPercent: markup,
      revenue: input.revenue,
      profit,
    };
  }

  if (driver === 'profit') {
    if (input.profit === null || !Number.isFinite(input.profit)) return null;
    const revenue = cost + input.profit;
    if (!Number.isFinite(revenue) || !(revenue !== 0)) return null;
    const margin = (input.profit / revenue) * 100;
    const markup = markupFromProfitCost(input.profit, cost);
    if (markup === null || !Number.isFinite(margin)) return null;
    return {
      marginPercent: margin,
      markupPercent: markup,
      revenue,
      profit: input.profit,
    };
  }

  return null;
}

/** Sync margin ↔ markup without cost (full precision). */
export function syncPercentsOnly(
  driver: 'margin' | 'markup',
  marginPercent: number | null,
  markupPercent: number | null
): { marginPercent: number; markupPercent: number } | null {
  if (driver === 'margin') {
    if (marginPercent === null || !Number.isFinite(marginPercent)) return null;
    const markup = markupFromMarginPercent(marginPercent);
    if (markup === null) return null;
    return { marginPercent, markupPercent: markup };
  }
  if (markupPercent === null || !Number.isFinite(markupPercent)) return null;
  const margin = marginFromMarkupPercent(markupPercent);
  if (margin === null) return null;
  return { marginPercent: margin, markupPercent };
}
