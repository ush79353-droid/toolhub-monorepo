/**
 * Percent Off Calculator — pure engine (ADR-018).
 *
 * Discount = P × d/100
 * Final = P × (1 − d/100)
 * Sequential: P × Π(1 − d_i)
 * Effective% = 100 × (1 − Π(1 − d_i/100))
 * Tax on discounted price: Total = Discounted × (1 + t/100)
 */

import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  PercentOffInput,
  PercentOffResult,
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

export function calculateDiscountAmount(
  originalPrice: number,
  discountPercent: number,
): number | null {
  if (!Number.isFinite(originalPrice) || !Number.isFinite(discountPercent)) {
    return null;
  }
  if (originalPrice < 0 || discountPercent < 0 || discountPercent > 100) {
    return null;
  }
  const amount = (originalPrice * discountPercent) / 100;
  return Number.isFinite(amount) ? amount : null;
}

export function calculateFinalPrice(
  originalPrice: number,
  discountPercent: number,
): number | null {
  const disc = calculateDiscountAmount(originalPrice, discountPercent);
  if (disc == null) return null;
  const final = originalPrice - disc;
  return Number.isFinite(final) && final >= 0 ? final : null;
}

export function calculateOriginalPrice(
  finalPrice: number,
  discountPercent: number,
): number | null {
  if (!Number.isFinite(finalPrice) || !Number.isFinite(discountPercent)) {
    return null;
  }
  if (finalPrice < 0 || discountPercent < 0 || discountPercent >= 100) {
    return null;
  }
  const factor = 1 - discountPercent / 100;
  if (!(factor > 0)) return null;
  const original = finalPrice / factor;
  return Number.isFinite(original) && original >= 0 ? original : null;
}

export function calculateDiscountPercentage(
  originalPrice: number,
  finalPrice: number,
): number | null {
  if (!Number.isFinite(originalPrice) || !Number.isFinite(finalPrice)) {
    return null;
  }
  if (originalPrice <= 0 || finalPrice < 0 || finalPrice > originalPrice) {
    return null;
  }
  const pct = ((originalPrice - finalPrice) / originalPrice) * 100;
  return Number.isFinite(pct) ? pct : null;
}

export function calculateSequentialDiscounts(
  originalPrice: number,
  discounts: number[],
): {
  discountedPrice: number;
  firstDiscountAmount: number;
  secondDiscountAmount: number;
  totalSavings: number;
  effectiveDiscountPercent: number;
} | null {
  if (!Number.isFinite(originalPrice) || originalPrice < 0) return null;
  if (discounts.length === 0) return null;

  let price = originalPrice;
  let firstDiscountAmount = 0;
  let secondDiscountAmount = 0;

  for (let i = 0; i < discounts.length; i++) {
    const d = discounts[i]!;
    if (!Number.isFinite(d) || d < 0 || d > 100) return null;
    const stepAmount = (price * d) / 100;
    if (!Number.isFinite(stepAmount)) return null;
    if (i === 0) firstDiscountAmount = stepAmount;
    else if (i === 1) secondDiscountAmount = stepAmount;
    price = price - stepAmount;
    if (!(price >= 0) || !Number.isFinite(price)) return null;
  }

  const totalSavings = originalPrice - price;
  const effectiveDiscountPercent =
    originalPrice > 0 ? (totalSavings / originalPrice) * 100 : 0;

  return {
    discountedPrice: price,
    firstDiscountAmount,
    secondDiscountAmount,
    totalSavings,
    effectiveDiscountPercent,
  };
}

export interface PercentOffCoreInput {
  originalPrice: number;
  discountPercent: number;
  additionalDiscountPercent?: number;
  taxPercent?: number;
}

export interface PercentOffCoreResult {
  originalPrice: number;
  firstDiscountAmount: number;
  secondDiscountAmount: number;
  totalSavings: number;
  effectiveDiscountPercent: number;
  discountedPrice: number;
  taxAmount: number;
  finalPriceWithTax: number;
}

export function calculatePercentOff(
  input: PercentOffCoreInput,
): PercentOffCoreResult | null {
  const {
    originalPrice,
    discountPercent,
    additionalDiscountPercent,
    taxPercent = 0,
  } = input;

  const discounts =
    additionalDiscountPercent != null &&
    Number.isFinite(additionalDiscountPercent)
      ? [discountPercent, additionalDiscountPercent]
      : [discountPercent];

  const seq = calculateSequentialDiscounts(originalPrice, discounts);
  if (!seq) return null;

  if (!Number.isFinite(taxPercent) || taxPercent < 0) return null;
  const taxAmount =
    taxPercent > 0 ? (seq.discountedPrice * taxPercent) / 100 : 0;
  if (!Number.isFinite(taxAmount) || taxAmount < 0) return null;
  const finalPriceWithTax = seq.discountedPrice + taxAmount;
  if (!Number.isFinite(finalPriceWithTax) || finalPriceWithTax < 0) return null;

  return {
    originalPrice,
    firstDiscountAmount: seq.firstDiscountAmount,
    secondDiscountAmount: seq.secondDiscountAmount,
    totalSavings: seq.totalSavings,
    effectiveDiscountPercent: seq.effectiveDiscountPercent,
    discountedPrice: seq.discountedPrice,
    taxAmount,
    finalPriceWithTax,
  };
}

export function calculatePercentOffFromInput(
  input: PercentOffInput,
): PercentOffResult | null {
  const { currency } = input;
  const applyTax = input.applySalesTax && input.showSalesTaxSection;
  const taxRate = applyTax ? (num(input.salesTaxRate) ?? 0) : 0;
  if (applyTax && (num(input.salesTaxRate) == null || taxRate < 0)) {
    return null;
  }

  let originalPrice: number;
  let discountPercent: number;
  let additional: number | undefined;
  let core: PercentOffCoreResult | null = null;

  if (input.solveMode === 'finalPrice') {
    const orig = num(input.originalPrice);
    const d1 = num(input.discountPercent);
    if (orig == null || d1 == null) return null;
    if (input.enableAdditionalDiscount) {
      const d2 = num(input.additionalDiscountPercent);
      if (d2 == null) return null;
      additional = d2;
    }
    core = calculatePercentOff({
      originalPrice: orig,
      discountPercent: d1,
      additionalDiscountPercent: additional,
      taxPercent: taxRate,
    });
    if (!core) return null;
    originalPrice = core.originalPrice;
    discountPercent = d1;
  } else if (input.solveMode === 'originalPrice') {
    const sale = num(input.salePrice);
    const d1 = num(input.discountPercent);
    if (sale == null || d1 == null) return null;
    if (d1 >= 100) return null;
    // Reverse uses first discount only (screenshot modes don't stack reverse)
    const orig = calculateOriginalPrice(sale, d1);
    if (orig == null) return null;
    core = calculatePercentOff({
      originalPrice: orig,
      discountPercent: d1,
      taxPercent: taxRate,
    });
    if (!core) return null;
    originalPrice = core.originalPrice;
    discountPercent = d1;
  } else {
    const orig = num(input.originalPrice);
    const sale = num(input.salePrice);
    if (orig == null || sale == null) return null;
    const pct = calculateDiscountPercentage(orig, sale);
    if (pct == null) return null;
    core = calculatePercentOff({
      originalPrice: orig,
      discountPercent: pct,
      taxPercent: taxRate,
    });
    if (!core) return null;
    originalPrice = orig;
    discountPercent = pct;
  }

  const rounded = {
    originalPrice: roundMoney(core.originalPrice, currency),
    firstDiscountAmount: roundMoney(core.firstDiscountAmount, currency),
    secondDiscountAmount: roundMoney(core.secondDiscountAmount, currency),
    totalSavings: roundMoney(core.totalSavings, currency),
    discountedPrice: roundMoney(core.discountedPrice, currency),
    taxAmount: roundMoney(core.taxAmount, currency),
    finalPriceWithTax: roundMoney(core.finalPriceWithTax, currency),
    effectiveDiscountPercent: core.effectiveDiscountPercent,
  };

  const savingsBarPct =
    rounded.originalPrice > 0
      ? Math.min(
          100,
          Math.max(0, (rounded.totalSavings / rounded.originalPrice) * 100),
        )
      : 0;
  const remainingBarPct = 100 - savingsBarPct;

  const steps: string[] = [];
  if (input.solveMode === 'originalPrice') {
    steps.push(
      `Sale price = ${money(num(input.salePrice) ?? rounded.discountedPrice, currency)}`,
      `Discount = ${formatPercent(discountPercent)}`,
      `Original = Sale ÷ (1 − discount%) = ${money(rounded.originalPrice, currency)}`,
    );
  } else if (input.solveMode === 'discountPercent') {
    steps.push(
      `Original = ${money(rounded.originalPrice, currency)}`,
      `Sale price = ${money(rounded.discountedPrice, currency)}`,
      `Percent off = (Original − Sale) ÷ Original × 100 = ${formatPercent(discountPercent)}`,
    );
  } else {
    steps.push(
      `Original = ${money(rounded.originalPrice, currency)}`,
      `First discount ${formatPercent(discountPercent)} = ${money(rounded.firstDiscountAmount, currency)}`,
    );
    if (additional != null) {
      steps.push(
        `Price after first discount = ${money(rounded.originalPrice - rounded.firstDiscountAmount, currency)}`,
        `Second discount ${formatPercent(additional)} = ${money(rounded.secondDiscountAmount, currency)}`,
        `Effective discount = ${formatPercent(rounded.effectiveDiscountPercent)} (not the sum of percentages)`,
      );
    }
    steps.push(
      `Discounted price = ${money(rounded.discountedPrice, currency)}`,
      `Total savings = ${money(rounded.totalSavings, currency)}`,
    );
  }
  if (applyTax && taxRate > 0) {
    steps.push(
      `Sales tax ${formatPercent(taxRate)} on discounted price = ${money(rounded.taxAmount, currency)}`,
      `Total including tax = ${money(rounded.finalPriceWithTax, currency)}`,
    );
  }

  const formulaBreakdown = [
    'Final = Original × (1 − D₁/100)' +
      (additional != null ? ' × (1 − D₂/100)' : ''),
    `Savings = Original − Discounted = ${money(rounded.totalSavings, currency)}`,
    `Effective% = Savings ÷ Original × 100 = ${formatPercent(rounded.effectiveDiscountPercent)}`,
    applyTax && taxRate > 0
      ? `Tax = Discounted × tax%/100; Total = Discounted + Tax`
      : 'Tax not applied',
  ].join('\n');

  const interpretation =
    additional != null
      ? `With ${formatPercent(discountPercent)} then ${formatPercent(additional)} off ${money(rounded.originalPrice, currency)}, the effective discount is ${formatPercent(rounded.effectiveDiscountPercent)}. You save ${money(rounded.totalSavings, currency)} and pay ${money(rounded.discountedPrice, currency)} before tax.`
      : `With a ${formatPercent(discountPercent)} discount on an original price of ${money(rounded.originalPrice, currency)}, you save ${money(rounded.totalSavings, currency)} and pay ${money(rounded.discountedPrice, currency)} before any applicable tax.`;

  const explanation =
    'Sequential percent-off discounts multiply remaining factors — they do not add. Optional sales tax is applied to the discounted price by default; tax rules vary by jurisdiction.';

  return {
    currency,
    solveMode: input.solveMode,
    originalPrice: rounded.originalPrice,
    discountPercent,
    additionalDiscountPercent: additional ?? null,
    firstDiscountAmount: rounded.firstDiscountAmount,
    secondDiscountAmount: rounded.secondDiscountAmount,
    totalSavings: rounded.totalSavings,
    effectiveDiscountPercent: rounded.effectiveDiscountPercent,
    discountedPrice: rounded.discountedPrice,
    applySalesTax: applyTax && taxRate > 0,
    salesTaxRate: taxRate,
    taxAmount: rounded.taxAmount,
    finalPriceWithTax: rounded.finalPriceWithTax,
    formattedOriginal: money(rounded.originalPrice, currency),
    formattedFirstDiscount: money(rounded.firstDiscountAmount, currency),
    formattedSecondDiscount: money(rounded.secondDiscountAmount, currency),
    formattedSavings: money(rounded.totalSavings, currency),
    formattedDiscounted: money(rounded.discountedPrice, currency),
    formattedEffectivePct: formatPercent(rounded.effectiveDiscountPercent),
    formattedTax: money(rounded.taxAmount, currency),
    formattedTotalWithTax: money(rounded.finalPriceWithTax, currency),
    savingsBarPct,
    remainingBarPct,
    formulaBreakdown,
    steps,
    interpretation,
    explanation,
  };
}
