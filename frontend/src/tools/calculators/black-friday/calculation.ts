/**
 * Black Friday Calculator — pure engine (ADR-018).
 *
 * Discounted = Original × (1 − d)  or  Original − fixed
 * Final = Discounted × (1 + tax) when tax enabled
 * Successive: P × Π(1 − d_i)
 */

import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  BlackFridayInput,
  BlackFridayResult,
  DiscountKind,
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

export function formatPercent(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  return `${n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

/** US Black Friday = day after 4th Thursday of November (UTC date parts). */
export function getBlackFridayDate(year: number): {
  year: number;
  month: number;
  day: number;
  isoDate: string;
} {
  const dayOfWeek = new Date(Date.UTC(year, 10, 1)).getUTCDay();
  const firstThursday = 1 + ((4 - dayOfWeek + 7) % 7);
  const thanksgivingDay = firstThursday + 21;
  const blackFridayDay = thanksgivingDay + 1;
  const month = 11;
  const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(blackFridayDay).padStart(2, '0')}`;
  return { year, month, day: blackFridayDay, isoDate };
}

export function calculateBlackFridayDiscount(inputs: {
  originalPrice: number;
  discountPercentage: number;
  applySalesTax: boolean;
  salesTaxRate: number;
}): {
  originalPrice: number;
  discountPercentage: number;
  discountAmount: number;
  discountedPrice: number;
  salesTaxAmount: number;
  finalPrice: number;
  savingsPercentage: number;
} | null {
  const {
    originalPrice,
    discountPercentage,
    applySalesTax,
    salesTaxRate,
  } = inputs;
  if (
    ![originalPrice, discountPercentage, salesTaxRate].every(Number.isFinite)
  ) {
    return null;
  }
  if (originalPrice < 0) return null;
  if (discountPercentage < 0 || discountPercentage > 100) return null;
  if (salesTaxRate < 0) return null;

  const discountAmount = (originalPrice * discountPercentage) / 100;
  const discountedPrice = originalPrice - discountAmount;
  if (!(discountedPrice >= 0) || !Number.isFinite(discountedPrice)) return null;

  const tax =
    applySalesTax && salesTaxRate > 0
      ? (discountedPrice * salesTaxRate) / 100
      : 0;
  if (!Number.isFinite(tax) || tax < 0) return null;
  const finalPrice = discountedPrice + tax;
  if (!Number.isFinite(finalPrice) || finalPrice < 0) return null;

  const savingsPercentage =
    originalPrice > 0 ? (discountAmount / originalPrice) * 100 : 0;

  return {
    originalPrice,
    discountPercentage,
    discountAmount,
    discountedPrice,
    salesTaxAmount: tax,
    finalPrice,
    savingsPercentage,
  };
}

export function applyPercentageDiscount(
  price: number,
  discountPercent: number,
): { discountAmount: number; discountedPrice: number } | null {
  if (!Number.isFinite(price) || !Number.isFinite(discountPercent)) return null;
  if (price < 0 || discountPercent < 0 || discountPercent > 100) return null;
  const discountAmount = (price * discountPercent) / 100;
  const discountedPrice = price - discountAmount;
  if (!Number.isFinite(discountedPrice) || discountedPrice < 0) return null;
  return { discountAmount, discountedPrice };
}

export function applyFixedDiscount(
  price: number,
  fixed: number,
): { discountAmount: number; discountedPrice: number } | null {
  if (!Number.isFinite(price) || !Number.isFinite(fixed)) return null;
  if (price < 0 || fixed < 0) return null;
  if (fixed > price) return null;
  const discountedPrice = price - fixed;
  return { discountAmount: fixed, discountedPrice };
}

export function applySuccessivePercentDiscounts(
  originalPrice: number,
  discounts: number[],
): {
  discountedPrice: number;
  totalDiscountAmount: number;
  effectiveDiscountPercentage: number;
} | null {
  if (!Number.isFinite(originalPrice) || originalPrice < 0) return null;
  let price = originalPrice;
  for (const d of discounts) {
    if (!Number.isFinite(d) || d < 0 || d > 100) return null;
    const step = applyPercentageDiscount(price, d);
    if (!step) return null;
    price = step.discountedPrice;
  }
  const totalDiscountAmount = originalPrice - price;
  const effectiveDiscountPercentage =
    originalPrice > 0 ? (totalDiscountAmount / originalPrice) * 100 : 0;
  return {
    discountedPrice: price,
    totalDiscountAmount,
    effectiveDiscountPercentage,
  };
}

export function reverseOriginalFromDiscounted(
  discountedPrice: number,
  discountPercent: number,
): number | null {
  if (
    !Number.isFinite(discountedPrice) ||
    !Number.isFinite(discountPercent) ||
    discountedPrice < 0 ||
    discountPercent < 0 ||
    discountPercent >= 100
  ) {
    return null;
  }
  const factor = 1 - discountPercent / 100;
  if (factor <= 0) return null;
  const original = discountedPrice / factor;
  return Number.isFinite(original) && original >= 0 ? original : null;
}

export function reverseDiscountPercent(
  originalPrice: number,
  discountedPrice: number,
): number | null {
  if (
    !Number.isFinite(originalPrice) ||
    !Number.isFinite(discountedPrice) ||
    originalPrice <= 0 ||
    discountedPrice < 0 ||
    discountedPrice > originalPrice
  ) {
    return null;
  }
  const pct = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Number.isFinite(pct) ? pct : null;
}

function money(n: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(roundMoney(n, currency), currency);
}

export function calculateBlackFridayFromInput(
  input: BlackFridayInput,
): BlackFridayResult | null {
  const { solveTarget, currency, discountKind, applySalesTax } = input;

  if (solveTarget === 'originalPrice') {
    const disc = num(input.discountedPrice);
    const pct = num(input.discountPercentage);
    if (disc == null || pct == null) return null;
    const original = reverseOriginalFromDiscounted(disc, pct);
    if (original === null) return null;
    return buildFromParts({
      solveTarget,
      currency,
      originalPrice: original,
      discountKind: 'percentage',
      discountPercentage: pct,
      fixedDiscount: 0,
      secondPct: null,
      applySalesTax: false,
      salesTaxRate: 0,
    });
  }

  if (solveTarget === 'discountPercent' || solveTarget === 'savings') {
    const original = num(input.originalPrice);
    const disc = num(input.discountedPrice);
    if (original == null || disc == null) return null;
    const pct = reverseDiscountPercent(original, disc);
    if (pct === null) return null;
    return buildFromParts({
      solveTarget,
      currency,
      originalPrice: original,
      discountKind: 'percentage',
      discountPercentage: pct,
      fixedDiscount: 0,
      secondPct: null,
      applySalesTax: false,
      salesTaxRate: 0,
    });
  }

  // finalPrice (default forward)
  const original = num(input.originalPrice);
  if (original == null) return null;

  let discountPercentage = 0;
  let fixedDiscount = 0;
  let secondPct: number | null = null;

  if (discountKind === 'percentage') {
    const pct = num(input.discountPercentage);
    if (pct == null) return null;
    discountPercentage = pct;
    if (input.enableSecondDiscount) {
      const s = num(input.secondDiscountPercentage);
      if (s == null) return null;
      secondPct = s;
    }
  } else {
    const fixed = num(input.fixedDiscount);
    if (fixed == null) return null;
    fixedDiscount = fixed;
  }

  let salesTaxRate = 0;
  if (applySalesTax) {
    const t = num(input.salesTaxRate);
    if (t == null) return null;
    salesTaxRate = t;
  }

  return buildFromParts({
    solveTarget,
    currency,
    originalPrice: original,
    discountKind,
    discountPercentage,
    fixedDiscount,
    secondPct,
    applySalesTax,
    salesTaxRate,
  });
}

function buildFromParts(args: {
  solveTarget: BlackFridayResult['solveTarget'];
  currency: SupportedCurrency;
  originalPrice: number;
  discountKind: DiscountKind;
  discountPercentage: number;
  fixedDiscount: number;
  secondPct: number | null;
  applySalesTax: boolean;
  salesTaxRate: number;
}): BlackFridayResult | null {
  const {
    solveTarget,
    currency,
    originalPrice,
    discountKind,
    discountPercentage,
    fixedDiscount,
    secondPct,
    applySalesTax,
    salesTaxRate,
  } = args;

  if (!(originalPrice >= 0) || !Number.isFinite(originalPrice)) return null;
  if (applySalesTax && salesTaxRate < 0) return null;

  let discountedPrice: number;
  let discountAmount: number;
  let effectiveDiscountPercentage: number;

  if (discountKind === 'fixed') {
    const step = applyFixedDiscount(originalPrice, fixedDiscount);
    if (!step) return null;
    discountedPrice = step.discountedPrice;
    discountAmount = step.discountAmount;
    effectiveDiscountPercentage =
      originalPrice > 0 ? (discountAmount / originalPrice) * 100 : 0;
  } else if (secondPct != null) {
    const stack = applySuccessivePercentDiscounts(originalPrice, [
      discountPercentage,
      secondPct,
    ]);
    if (!stack) return null;
    discountedPrice = stack.discountedPrice;
    discountAmount = stack.totalDiscountAmount;
    effectiveDiscountPercentage = stack.effectiveDiscountPercentage;
  } else {
    const step = applyPercentageDiscount(originalPrice, discountPercentage);
    if (!step) return null;
    discountedPrice = step.discountedPrice;
    discountAmount = step.discountAmount;
    effectiveDiscountPercentage =
      originalPrice > 0 ? (discountAmount / originalPrice) * 100 : 0;
  }

  const taxRateUsed = applySalesTax ? salesTaxRate : 0;
  const salesTaxAmount =
    applySalesTax && taxRateUsed > 0
      ? (discountedPrice * taxRateUsed) / 100
      : 0;
  if (!Number.isFinite(salesTaxAmount) || salesTaxAmount < 0) return null;
  const finalPrice = discountedPrice + salesTaxAmount;
  if (!Number.isFinite(finalPrice) || finalPrice < 0) return null;

  const savingsBeforeTax = discountAmount;
  const savingsPercentage = effectiveDiscountPercentage;

  const steps: string[] = [
    `Original price = ${money(originalPrice, currency)}`,
  ];
  if (discountKind === 'fixed') {
    steps.push(
      `Fixed discount = ${money(fixedDiscount, currency)}`,
      `Discounted price = ${money(originalPrice, currency)} − ${money(fixedDiscount, currency)} = ${money(discountedPrice, currency)}`,
    );
  } else if (secondPct != null) {
    const first = applyPercentageDiscount(originalPrice, discountPercentage);
    steps.push(
      `First discount ${formatPercent(discountPercentage)} → ${money(first!.discountedPrice, currency)}`,
      `Second discount ${formatPercent(secondPct)} → ${money(discountedPrice, currency)}`,
      `Effective discount = ${formatPercent(effectiveDiscountPercentage)} (not ${formatPercent(discountPercentage + secondPct)})`,
    );
  } else {
    steps.push(
      `Discount amount = ${money(originalPrice, currency)} × ${discountPercentage}/100 = ${money(discountAmount, currency)}`,
      `Discounted price = ${money(originalPrice, currency)} − ${money(discountAmount, currency)} = ${money(discountedPrice, currency)}`,
    );
  }
  if (applySalesTax) {
    steps.push(
      `Sales tax = ${money(discountedPrice, currency)} × ${taxRateUsed}/100 = ${money(salesTaxAmount, currency)}`,
      `Final price = ${money(discountedPrice, currency)} + ${money(salesTaxAmount, currency)} = ${money(finalPrice, currency)}`,
    );
  } else {
    steps.push(`Tax disabled → final price = ${money(discountedPrice, currency)}`);
  }

  const formulaBreakdown = [
    discountKind === 'fixed'
      ? `Discounted = Original − Fixed = ${money(discountedPrice, currency)}`
      : secondPct != null
        ? `Discounted = Original × (1−d1) × (1−d2) = ${money(discountedPrice, currency)}`
        : `Discounted = Original × (1 − ${discountPercentage}/100) = ${money(discountedPrice, currency)}`,
    applySalesTax
      ? `Final = Discounted × (1 + ${taxRateUsed}/100) = ${money(finalPrice, currency)}`
      : `Final = Discounted = ${money(finalPrice, currency)}`,
  ].join('\n');

  const interpretation = applySalesTax
    ? `After a Black Friday discount, the pre-tax price is ${money(discountedPrice, currency)}. With ${formatPercent(taxRateUsed)} sales tax on the discounted price, you pay ${money(finalPrice, currency)}. You save ${money(savingsBeforeTax, currency)} before tax (${formatPercent(savingsPercentage)} off the original).`
    : `After the discount, you pay ${money(finalPrice, currency)} and save ${money(savingsBeforeTax, currency)} (${formatPercent(savingsPercentage)} off). Sales tax is not applied.`;

  const explanation =
    'Discounts are applied before sales tax in this standard model. Tax rules vary by jurisdiction. A percentage off does not prove a deal is historically cheap. Compare final prices, shipping, and return terms.';

  return {
    solveTarget,
    currency,
    originalPrice,
    discountKind,
    discountPercentage,
    fixedDiscount,
    secondDiscountPercentage: secondPct,
    discountAmount,
    discountedPrice,
    applySalesTax,
    salesTaxRate: taxRateUsed,
    salesTaxAmount,
    finalPrice,
    savingsBeforeTax,
    savingsPercentage,
    effectiveDiscountPercentage,
    formattedOriginal: money(originalPrice, currency),
    formattedDiscountAmount: money(discountAmount, currency),
    formattedDiscounted: money(discountedPrice, currency),
    formattedTax: money(salesTaxAmount, currency),
    formattedFinal: money(finalPrice, currency),
    formattedSavings: money(savingsBeforeTax, currency),
    formattedSavingsPct: formatPercent(savingsPercentage),
    formattedEffectivePct: formatPercent(effectiveDiscountPercentage),
    formulaBreakdown,
    steps,
    interpretation,
    explanation,
  };
}
