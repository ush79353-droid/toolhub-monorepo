/**
 * Markdown Calculator — retail price reduction (ADR-018).
 *
 * Markdown = Original − Actual
 * Markdown% = Markdown / Original × 100
 * Not Markdown text formatting.
 */

import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  MarkdownInput,
  MarkdownResult,
  MarkdownVariable,
} from './types';

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

export function calculateMarkdownAmount(
  originalPrice: number,
  actualPrice: number,
): number | null {
  if (
    !Number.isFinite(originalPrice) ||
    !Number.isFinite(actualPrice) ||
    originalPrice < 0 ||
    actualPrice < 0 ||
    actualPrice > originalPrice
  ) {
    return null;
  }
  return originalPrice - actualPrice;
}

export function calculateMarkdownPercentage(
  originalPrice: number,
  actualPrice: number,
): number | null {
  const md = calculateMarkdownAmount(originalPrice, actualPrice);
  if (md == null) return null;
  if (originalPrice === 0) return md === 0 ? 0 : null;
  const pct = (md / originalPrice) * 100;
  return Number.isFinite(pct) ? pct : null;
}

export function calculateActualPrice(
  originalPrice: number,
  markdownAmount: number,
): number | null {
  if (
    !Number.isFinite(originalPrice) ||
    !Number.isFinite(markdownAmount) ||
    originalPrice < 0 ||
    markdownAmount < 0 ||
    markdownAmount > originalPrice
  ) {
    return null;
  }
  return originalPrice - markdownAmount;
}

export function calculateOriginalPrice(
  actualPrice: number,
  markdownAmount: number,
): number | null {
  if (
    !Number.isFinite(actualPrice) ||
    !Number.isFinite(markdownAmount) ||
    actualPrice < 0 ||
    markdownAmount < 0
  ) {
    return null;
  }
  const original = actualPrice + markdownAmount;
  return Number.isFinite(original) ? original : null;
}

export function calculateActualPriceFromPercentage(
  originalPrice: number,
  percentage: number,
): number | null {
  if (
    !Number.isFinite(originalPrice) ||
    !Number.isFinite(percentage) ||
    originalPrice < 0 ||
    percentage < 0 ||
    percentage > 100
  ) {
    return null;
  }
  return originalPrice * (1 - percentage / 100);
}

export function calculateOriginalPriceFromPercentage(
  actualPrice: number,
  percentage: number,
): number | null {
  if (
    !Number.isFinite(actualPrice) ||
    !Number.isFinite(percentage) ||
    actualPrice < 0 ||
    percentage < 0 ||
    percentage >= 100
  ) {
    return null;
  }
  const original = actualPrice / (1 - percentage / 100);
  return Number.isFinite(original) && original >= 0 ? original : null;
}

export function calculateMarkdownFromPercentage(
  originalPrice: number,
  percentage: number,
): number | null {
  if (
    !Number.isFinite(originalPrice) ||
    !Number.isFinite(percentage) ||
    originalPrice < 0 ||
    percentage < 0 ||
    percentage > 100
  ) {
    return null;
  }
  return (originalPrice * percentage) / 100;
}

type Solved = {
  originalPrice: number;
  actualPrice: number;
  markdownAmount: number;
  markdownPercentage: number;
};

function finalize(
  originalPrice: number,
  actualPrice: number,
  markdownAmount: number,
  markdownPercentage: number,
): Solved | null {
  if (
    ![originalPrice, actualPrice, markdownAmount, markdownPercentage].every(
      Number.isFinite,
    )
  ) {
    return null;
  }
  if (
    originalPrice < 0 ||
    actualPrice < 0 ||
    markdownAmount < 0 ||
    markdownPercentage < 0 ||
    markdownPercentage > 100
  ) {
    return null;
  }
  if (actualPrice > originalPrice + 1e-9) return null;
  if (markdownAmount > originalPrice + 1e-9) return null;
  return {
    originalPrice,
    actualPrice,
    markdownAmount,
    markdownPercentage,
  };
}

export function calculateMarkdown(
  values: {
    originalPrice?: number;
    actualPrice?: number;
    markdownAmount?: number;
    markdownPercentage?: number;
  },
  authoritativeFields: [MarkdownVariable, MarkdownVariable],
): Solved | null {
  const [a, b] = authoritativeFields;
  const pair = new Set([a, b]);

  const O = values.originalPrice;
  const A = values.actualPrice;
  const M = values.markdownAmount;
  const P = values.markdownPercentage;

  // Original + Actual
  if (pair.has('originalPrice') && pair.has('actualPrice')) {
    if (O == null || A == null) return null;
    const md = calculateMarkdownAmount(O, A);
    const pct = calculateMarkdownPercentage(O, A);
    if (md == null || pct == null) return null;
    return finalize(O, A, md, pct);
  }

  // Original + Markdown
  if (pair.has('originalPrice') && pair.has('markdownAmount')) {
    if (O == null || M == null) return null;
    const actual = calculateActualPrice(O, M);
    if (actual == null) return null;
    const pct = O === 0 ? (M === 0 ? 0 : null) : (M / O) * 100;
    if (pct == null || !Number.isFinite(pct)) return null;
    return finalize(O, actual, M, pct);
  }

  // Original + Percentage
  if (pair.has('originalPrice') && pair.has('markdownPercentage')) {
    if (O == null || P == null) return null;
    const md = calculateMarkdownFromPercentage(O, P);
    const actual = calculateActualPriceFromPercentage(O, P);
    if (md == null || actual == null) return null;
    return finalize(O, actual, md, P);
  }

  // Actual + Markdown
  if (pair.has('actualPrice') && pair.has('markdownAmount')) {
    if (A == null || M == null) return null;
    const original = calculateOriginalPrice(A, M);
    if (original == null || original === 0) {
      if (original === 0 && M === 0 && A === 0) {
        return finalize(0, 0, 0, 0);
      }
      if (original == null || original === 0) return null;
    }
    const pct = (M / original) * 100;
    if (!Number.isFinite(pct) || pct < 0 || pct > 100) return null;
    return finalize(original, A, M, pct);
  }

  // Actual + Percentage
  if (pair.has('actualPrice') && pair.has('markdownPercentage')) {
    if (A == null || P == null) return null;
    if (P >= 100) return null; // cannot uniquely recover original from 100%
    const original = calculateOriginalPriceFromPercentage(A, P);
    if (original == null) return null;
    const md = original - A;
    return finalize(original, A, md, P);
  }

  // Markdown + Percentage
  if (pair.has('markdownAmount') && pair.has('markdownPercentage')) {
    if (M == null || P == null) return null;
    if (P === 0) {
      if (M === 0) return null; // infinite originals
      return null; // inconsistent
    }
    const original = M / (P / 100);
    if (!Number.isFinite(original) || original < 0) return null;
    const actual = original - M;
    if (actual < 0) return null;
    return finalize(original, actual, M, P);
  }

  return null;
}

export function calculateMarkdownFromInput(
  input: MarkdownInput,
): MarkdownResult | null {
  if (!input.authoritativeFields) return null;
  const [a, b] = input.authoritativeFields;
  if (a === b) return null;

  const values = {
    originalPrice: num(input.originalPrice) ?? undefined,
    actualPrice: num(input.actualPrice) ?? undefined,
    markdownAmount: num(input.markdownAmount) ?? undefined,
    markdownPercentage: num(input.markdownPercentage) ?? undefined,
  };

  // Ensure both authoritative fields have numbers
  for (const field of input.authoritativeFields) {
    const key =
      field === 'originalPrice'
        ? values.originalPrice
        : field === 'actualPrice'
          ? values.actualPrice
          : field === 'markdownAmount'
            ? values.markdownAmount
            : values.markdownPercentage;
    if (key == null) return null;
  }

  const solved = calculateMarkdown(values, input.authoritativeFields);
  if (!solved) return null;

  const { currency } = input;
  const {
    originalPrice,
    actualPrice,
    markdownAmount,
    markdownPercentage,
  } = solved;

  const steps = [
    `Authoritative inputs: ${a} and ${b}.`,
    `Original selling price = ${money(originalPrice, currency)}`,
    `Markdown amount = ${money(markdownAmount, currency)}`,
    `Markdown percent = ${formatPercent(markdownPercentage)}`,
    `Actual selling price = ${money(actualPrice, currency)}`,
  ];

  const formulaBreakdown = [
    'Markdown = Original − Actual',
    `= ${money(originalPrice, currency)} − ${money(actualPrice, currency)} = ${money(markdownAmount, currency)}`,
    'Markdown% = Markdown ÷ Original × 100',
    `= ${money(markdownAmount, currency)} ÷ ${money(originalPrice, currency)} × 100 = ${formatPercent(markdownPercentage)}`,
  ].join('\n');

  const interpretation = `The selling price has been reduced by ${money(markdownAmount, currency)}, representing a ${formatPercent(markdownPercentage)} markdown from the original price.`;

  const explanation =
    'Markdown percentage uses the original selling price as the denominator. This is a retail price-reduction calculator; not a Markdown text formatter. Profitability still depends on product cost.';

  return {
    currency,
    originalPrice,
    actualPrice,
    markdownAmount,
    markdownPercentage,
    authoritativeFields: input.authoritativeFields,
    formattedOriginal: money(originalPrice, currency),
    formattedActual: money(actualPrice, currency),
    formattedMarkdown: money(markdownAmount, currency),
    formattedPercent: formatPercent(markdownPercentage),
    formulaBreakdown,
    steps,
    interpretation,
    explanation,
  };
}
