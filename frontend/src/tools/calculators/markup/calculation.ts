/**
 * Markup Calculator — unit pricing (ADR-018).
 *
 * Markup% = Profit / Cost × 100 = (Revenue − Cost) / Cost × 100
 * Margin% = Profit / Revenue × 100
 * Distinct from MarkdownCalculator (price reduction) and MarginAndMarkupCalculator.
 */

import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { MarkupInput, MarkupResult, MarkupVariable } from './types';

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const f = 10 ** digits;
  return Math.round(amount * f) / f;
}

function money(n: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(roundMoney(n, currency), currency);
}

export function formatPercent(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  return `${n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

export function calculateMarkupPercentage(
  cost: number,
  revenue: number,
): number | null {
  if (!Number.isFinite(cost) || !Number.isFinite(revenue)) return null;
  if (cost <= 0) return null;
  if (revenue < 0) return null;
  const pct = ((revenue - cost) / cost) * 100;
  return Number.isFinite(pct) ? pct : null;
}

export function calculateRevenue(
  cost: number,
  markupPercentage: number,
): number | null {
  if (!Number.isFinite(cost) || !Number.isFinite(markupPercentage)) return null;
  if (cost < 0) return null;
  if (markupPercentage < -100) return null;
  const revenue = cost * (1 + markupPercentage / 100);
  return Number.isFinite(revenue) && revenue >= 0 ? revenue : null;
}

export function calculateProfit(cost: number, revenue: number): number | null {
  if (!Number.isFinite(cost) || !Number.isFinite(revenue)) return null;
  if (cost < 0 || revenue < 0) return null;
  return revenue - cost;
}

export function calculateCostFromRevenue(
  revenue: number,
  markupPercentage: number,
): number | null {
  if (!Number.isFinite(revenue) || !Number.isFinite(markupPercentage)) {
    return null;
  }
  if (revenue < 0 || markupPercentage <= -100) return null;
  const cost = revenue / (1 + markupPercentage / 100);
  return Number.isFinite(cost) && cost >= 0 ? cost : null;
}

export function calculateCostFromProfit(
  profit: number,
  markupPercentage: number,
): number | null {
  if (!Number.isFinite(profit) || !Number.isFinite(markupPercentage)) {
    return null;
  }
  if (markupPercentage === 0) {
    return profit === 0 ? null : null; // not unique / inconsistent
  }
  const cost = profit / (markupPercentage / 100);
  return Number.isFinite(cost) && cost >= 0 ? cost : null;
}

export function calculateProfitMargin(
  cost: number,
  revenue: number,
): number | null {
  if (!Number.isFinite(cost) || !Number.isFinite(revenue)) return null;
  if (revenue <= 0) return revenue === 0 && cost === 0 ? null : null;
  if (revenue === 0) return null;
  const margin = ((revenue - cost) / revenue) * 100;
  return Number.isFinite(margin) ? margin : null;
}

export function markupToMargin(markupPercentage: number): number | null {
  if (!Number.isFinite(markupPercentage) || markupPercentage <= -100) {
    return null;
  }
  const margin = (markupPercentage / (100 + markupPercentage)) * 100;
  return Number.isFinite(margin) ? margin : null;
}

export function marginToMarkup(marginPercentage: number): number | null {
  if (!Number.isFinite(marginPercentage) || marginPercentage >= 100) {
    return null;
  }
  const markup = (marginPercentage / (100 - marginPercentage)) * 100;
  return Number.isFinite(markup) ? markup : null;
}

type Solved = {
  cost: number;
  markupPercentage: number;
  revenue: number;
  profit: number;
};

function finalize(
  cost: number,
  markupPercentage: number,
  revenue: number,
  profit: number,
): Solved | null {
  if (![cost, markupPercentage, revenue, profit].every(Number.isFinite)) {
    return null;
  }
  if (cost < 0 || revenue < 0) return null;
  if (markupPercentage < -100) return null;
  // Consistency check
  if (Math.abs(revenue - cost - profit) > 1e-6) return null;
  return { cost, markupPercentage, revenue, profit };
}

export function calculateMarkup(
  values: {
    cost?: number;
    markupPercentage?: number;
    revenue?: number;
    profit?: number;
  },
  authoritativeFields: [MarkupVariable, MarkupVariable],
): Solved | null {
  const pair = new Set(authoritativeFields);
  const C = values.cost;
  const M = values.markupPercentage;
  const R = values.revenue;
  const P = values.profit;

  // Cost + Markup
  if (pair.has('cost') && pair.has('markupPercentage')) {
    if (C == null || M == null) return null;
    const revenue = calculateRevenue(C, M);
    if (revenue == null) return null;
    const profit = revenue - C;
    return finalize(C, M, revenue, profit);
  }

  // Cost + Revenue
  if (pair.has('cost') && pair.has('revenue')) {
    if (C == null || R == null) return null;
    if (C <= 0) return null;
    const markup = calculateMarkupPercentage(C, R);
    const profit = calculateProfit(C, R);
    if (markup == null || profit == null) return null;
    return finalize(C, markup, R, profit);
  }

  // Cost + Profit
  if (pair.has('cost') && pair.has('profit')) {
    if (C == null || P == null) return null;
    if (C <= 0 && P !== 0) {
      // cost 0 with nonzero profit → undefined markup %
      if (C === 0) return null;
    }
    if (C < 0) return null;
    const revenue = C + P;
    if (revenue < 0) return null;
    if (C === 0) return null; // markup % undefined
    const markup = (P / C) * 100;
    if (!Number.isFinite(markup) || markup < -100) return null;
    return finalize(C, markup, revenue, P);
  }

  // Revenue + Markup
  if (pair.has('revenue') && pair.has('markupPercentage')) {
    if (R == null || M == null) return null;
    const cost = calculateCostFromRevenue(R, M);
    if (cost == null) return null;
    const profit = R - cost;
    return finalize(cost, M, R, profit);
  }

  // Revenue + Profit
  if (pair.has('revenue') && pair.has('profit')) {
    if (R == null || P == null) return null;
    const cost = R - P;
    if (cost < 0) return null;
    if (cost === 0) {
      // markup undefined unless profit is 0 and we still can't define %
      return null;
    }
    const markup = (P / cost) * 100;
    if (!Number.isFinite(markup) || markup < -100) return null;
    return finalize(cost, markup, R, P);
  }

  // Profit + Markup
  if (pair.has('profit') && pair.has('markupPercentage')) {
    if (P == null || M == null) return null;
    const cost = calculateCostFromProfit(P, M);
    if (cost == null) return null;
    const revenue = cost + P;
    if (revenue < 0) return null;
    return finalize(cost, M, revenue, P);
  }

  return null;
}

export function calculateMarkupFromInput(
  input: MarkupInput,
): MarkupResult | null {
  if (!input.authoritativeFields) return null;
  const [a, b] = input.authoritativeFields;
  if (a === b) return null;

  const values = {
    cost: num(input.cost) ?? undefined,
    markupPercentage: num(input.markupPercentage) ?? undefined,
    revenue: num(input.revenue) ?? undefined,
    profit: num(input.profit) ?? undefined,
  };

  for (const field of input.authoritativeFields) {
    const v =
      field === 'cost'
        ? values.cost
        : field === 'markupPercentage'
          ? values.markupPercentage
          : field === 'revenue'
            ? values.revenue
            : values.profit;
    if (v == null) return null;
  }

  const solved = calculateMarkup(values, input.authoritativeFields);
  if (!solved) return null;

  const { currency } = input;
  const { cost, markupPercentage, revenue, profit } = solved;
  const marginPercentage = calculateProfitMargin(cost, revenue);

  const steps = [
    `Authoritative inputs: ${a} and ${b}.`,
    `Cost = ${money(cost, currency)}`,
    `Markup = ${formatPercent(markupPercentage)}`,
    `Revenue (selling price) = ${money(revenue, currency)}`,
    `Profit = ${money(profit, currency)}`,
    marginPercentage == null
      ? 'Margin = N/A'
      : `Margin = ${formatPercent(marginPercentage)}`,
  ];

  const formulaBreakdown = [
    'Markup% = (Revenue − Cost) ÷ Cost × 100',
    `= (${money(revenue, currency)} − ${money(cost, currency)}) ÷ ${money(cost, currency)} × 100 = ${formatPercent(markupPercentage)}`,
    'Profit = Revenue − Cost',
    `= ${money(revenue, currency)} − ${money(cost, currency)} = ${money(profit, currency)}`,
    marginPercentage == null
      ? 'Margin% = N/A'
      : `Margin% = Profit ÷ Revenue × 100 = ${formatPercent(marginPercentage)}`,
  ].join('\n');

  const interpretation = `Adding a ${formatPercent(markupPercentage)} markup to a unit cost of ${money(cost, currency)} results in a selling price of ${money(revenue, currency)} and a unit profit of ${money(profit, currency)} before other expenses.`;

  const explanation =
    'Markup % uses cost as the denominator; margin % uses revenue. Unit profit here is revenue − cost and is not net profit after overhead, fees, or taxes.';

  return {
    currency,
    cost,
    markupPercentage,
    revenue,
    profit,
    marginPercentage,
    authoritativeFields: input.authoritativeFields,
    formattedCost: money(cost, currency),
    formattedMarkup: formatPercent(markupPercentage),
    formattedRevenue: money(revenue, currency),
    formattedProfit: money(profit, currency),
    formattedMargin:
      marginPercentage == null ? 'N/A' : formatPercent(marginPercentage),
    formulaBreakdown,
    steps,
    interpretation,
    explanation,
  };
}
