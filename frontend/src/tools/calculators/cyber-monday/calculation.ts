/**
 * Cyber Monday Calculator — pure engine (ADR-018).
 *
 * Merchandise discounts by deal type, then tax on discounted subtotal (default),
 * then shipping (with optional free-shipping threshold on after-discount subtotal).
 */

import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { getBlackFridayDate } from '../black-friday/calculation';
import type {
  CyberMondayDealType,
  CyberMondayInput,
  CyberMondayResult,
} from './types';
import { DEAL_TYPE_LABELS } from './types';

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

/** Cyber Monday = Monday after US Thanksgiving (Black Friday + 3 days). */
export function getCyberMondayDate(year: number): {
  year: number;
  month: number;
  day: number;
  isoDate: string;
} {
  const bf = getBlackFridayDate(year);
  const d = new Date(Date.UTC(bf.year, bf.month - 1, bf.day + 3));
  const y = d.getUTCFullYear();
  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  return {
    year: y,
    month,
    day,
    isoDate: `${y}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  };
}

export function calculatePercentageDiscount(
  price: number,
  percentage: number,
): number | null {
  if (!Number.isFinite(price) || !Number.isFinite(percentage)) return null;
  if (price < 0 || percentage < 0 || percentage > 100) return null;
  const discounted = price * (1 - percentage / 100);
  return Number.isFinite(discounted) && discounted >= 0 ? discounted : null;
}

export function calculateFixedDiscount(
  price: number,
  discount: number,
): number | null {
  if (!Number.isFinite(price) || !Number.isFinite(discount)) return null;
  if (price < 0 || discount < 0) return null;
  return Math.max(0, price - discount);
}

export function calculateDoubleDiscount(
  price: number,
  first: number,
  second: number,
): number | null {
  const afterFirst = calculatePercentageDiscount(price, first);
  if (afterFirst == null) return null;
  return calculatePercentageDiscount(afterFirst, second);
}

export function calculateTripleDiscount(
  price: number,
  first: number,
  second: number,
  third: number,
): number | null {
  const afterDouble = calculateDoubleDiscount(price, first, second);
  if (afterDouble == null) return null;
  return calculatePercentageDiscount(afterDouble, third);
}

/** BOGO free: pay ceil(Q/2) items. */
export function calculateBOGO(
  unitPrice: number,
  quantity: number,
): number | null {
  if (
    !Number.isFinite(unitPrice) ||
    !Number.isFinite(quantity) ||
    unitPrice < 0 ||
    quantity <= 0 ||
    !Number.isInteger(quantity)
  ) {
    return null;
  }
  const paid = Math.ceil(quantity / 2);
  return paid * unitPrice;
}

/** Second of each pair at discount%; unpaired at full price. */
export function calculateBogoDiscounted(
  unitPrice: number,
  quantity: number,
  secondItemDiscountPercent: number,
): number | null {
  if (
    !Number.isFinite(unitPrice) ||
    !Number.isFinite(quantity) ||
    !Number.isFinite(secondItemDiscountPercent) ||
    unitPrice < 0 ||
    quantity <= 0 ||
    !Number.isInteger(quantity) ||
    secondItemDiscountPercent < 0 ||
    secondItemDiscountPercent > 100
  ) {
    return null;
  }
  const pairs = Math.floor(quantity / 2);
  const leftover = quantity % 2;
  const secondPrice = unitPrice * (1 - secondItemDiscountPercent / 100);
  return pairs * (unitPrice + secondPrice) + leftover * unitPrice;
}

export function calculateBuyXGetYFree(
  unitPrice: number,
  quantity: number,
  buyQuantity: number,
  freeQuantity: number,
): number | null {
  if (
    ![unitPrice, quantity, buyQuantity, freeQuantity].every(Number.isFinite) ||
    unitPrice < 0 ||
    quantity <= 0 ||
    !Number.isInteger(quantity) ||
    !Number.isInteger(buyQuantity) ||
    !Number.isInteger(freeQuantity) ||
    buyQuantity <= 0 ||
    freeQuantity < 0
  ) {
    return null;
  }
  const groupSize = buyQuantity + freeQuantity;
  if (groupSize <= 0) return null;
  const completeGroups = Math.floor(quantity / groupSize);
  const freeItems = completeGroups * freeQuantity;
  const paidItems = quantity - freeItems;
  return paidItems * unitPrice;
}

export function calculateBuyXPayY(
  unitPrice: number,
  quantity: number,
  buyX: number,
  payY: number,
): number | null {
  if (
    ![unitPrice, quantity, buyX, payY].every(Number.isFinite) ||
    unitPrice < 0 ||
    quantity <= 0 ||
    !Number.isInteger(quantity) ||
    !Number.isInteger(buyX) ||
    !Number.isInteger(payY) ||
    buyX <= 0 ||
    payY < 0 ||
    payY > buyX
  ) {
    return null;
  }
  const groups = Math.floor(quantity / buyX);
  const remainder = quantity % buyX;
  return (groups * payY + remainder) * unitPrice;
}

export function calculateSalesTax(
  taxableAmount: number,
  taxRate: number,
): number | null {
  if (
    !Number.isFinite(taxableAmount) ||
    !Number.isFinite(taxRate) ||
    taxableAmount < 0 ||
    taxRate < 0
  ) {
    return null;
  }
  const tax = (taxableAmount * taxRate) / 100;
  return Number.isFinite(tax) ? tax : null;
}

export function extractPreTaxFromInclusive(
  inclusive: number,
  taxRatePercent: number,
): { preTax: number; includedTax: number } | null {
  if (
    !Number.isFinite(inclusive) ||
    !Number.isFinite(taxRatePercent) ||
    inclusive < 0 ||
    taxRatePercent < 0
  ) {
    return null;
  }
  const t = taxRatePercent / 100;
  const preTax = inclusive / (1 + t);
  if (!Number.isFinite(preTax) || preTax < 0) return null;
  return { preTax, includedTax: inclusive - preTax };
}

export function calculateEffectiveDiscount(
  originalSubtotal: number,
  discountedSubtotal: number,
): number | null {
  if (
    !Number.isFinite(originalSubtotal) ||
    !Number.isFinite(discountedSubtotal) ||
    originalSubtotal < 0 ||
    discountedSubtotal < 0
  ) {
    return null;
  }
  if (originalSubtotal === 0) return null;
  return ((originalSubtotal - discountedSubtotal) / originalSubtotal) * 100;
}

export function calculateFinalCheckout(
  discountedSubtotal: number,
  taxAmount: number,
  shippingAmount: number,
): number | null {
  if (
    ![discountedSubtotal, taxAmount, shippingAmount].every(Number.isFinite) ||
    discountedSubtotal < 0 ||
    taxAmount < 0 ||
    shippingAmount < 0
  ) {
    return null;
  }
  const total = discountedSubtotal + taxAmount + shippingAmount;
  return Number.isFinite(total) ? total : null;
}

function merchandiseAfterDeal(
  input: CyberMondayInput,
  unitPrice: number,
  quantity: number,
): { discountedSubtotal: number; note: string } | null {
  const originalSubtotal = unitPrice * quantity;
  const type = input.dealType;

  switch (type) {
    case 'percentage': {
      const pct = num(input.discountPercentage);
      if (pct == null) return null;
      const d = calculatePercentageDiscount(originalSubtotal, pct);
      if (d == null) return null;
      return { discountedSubtotal: d, note: `${pct}% off merchandise` };
    }
    case 'fixed': {
      const f = num(input.fixedDiscount);
      if (f == null) return null;
      const d = calculateFixedDiscount(originalSubtotal, f);
      if (d == null) return null;
      return { discountedSubtotal: d, note: `Fixed ${f} off` };
    }
    case 'double': {
      const d1 = num(input.discountPercentage);
      const d2 = num(input.secondDiscountPercentage);
      if (d1 == null || d2 == null) return null;
      const d = calculateDoubleDiscount(originalSubtotal, d1, d2);
      if (d == null) return null;
      return {
        discountedSubtotal: d,
        note: `Sequential ${d1}% then ${d2}%`,
      };
    }
    case 'triple': {
      const d1 = num(input.discountPercentage);
      const d2 = num(input.secondDiscountPercentage);
      const d3 = num(input.thirdDiscountPercentage);
      if (d1 == null || d2 == null || d3 == null) return null;
      const d = calculateTripleDiscount(originalSubtotal, d1, d2, d3);
      if (d == null) return null;
      return {
        discountedSubtotal: d,
        note: `Sequential ${d1}% · ${d2}% · ${d3}%`,
      };
    }
    case 'bogo-free': {
      const d = calculateBOGO(unitPrice, quantity);
      if (d == null) return null;
      return { discountedSubtotal: d, note: 'BOGO free (pay ceil(Q/2))' };
    }
    case 'bogo-discounted': {
      const pct = num(input.secondItemDiscountPercentage);
      if (pct == null) return null;
      const d = calculateBogoDiscounted(unitPrice, quantity, pct);
      if (d == null) return null;
      return {
        discountedSubtotal: d,
        note: `Second item ${pct}% off per pair`,
      };
    }
    case 'buy-x-get-y-free': {
      const x = num(input.buyQuantity);
      const y = num(input.freeQuantity);
      if (x == null || y == null) return null;
      const d = calculateBuyXGetYFree(unitPrice, quantity, x, y);
      if (d == null) return null;
      return { discountedSubtotal: d, note: `Buy ${x} Get ${y} Free` };
    }
    case 'buy-x-pay-y': {
      const x = num(input.buyQuantity);
      const y = num(input.payQuantity);
      if (x == null || y == null) return null;
      const d = calculateBuyXPayY(unitPrice, quantity, x, y);
      if (d == null) return null;
      return { discountedSubtotal: d, note: `Buy ${x} Pay for ${y}` };
    }
    case 'percentage-plus-coupon': {
      const pct = num(input.discountPercentage);
      const coupon = num(input.couponAmount);
      if (pct == null || coupon == null) return null;
      let after = originalSubtotal;
      if (input.couponOrder === 'percent-then-fixed') {
        const p = calculatePercentageDiscount(after, pct);
        if (p == null) return null;
        after = calculateFixedDiscount(p, coupon)!;
      } else {
        const f = calculateFixedDiscount(after, coupon);
        if (f == null) return null;
        after = calculatePercentageDiscount(f, pct)!;
      }
      if (after == null || after < 0) return null;
      return {
        discountedSubtotal: after,
        note:
          input.couponOrder === 'percent-then-fixed'
            ? `${pct}% then coupon`
            : `Coupon then ${pct}%`,
      };
    }
    default:
      return null;
  }
}

export function calculateCyberMondayFromInput(
  input: CyberMondayInput,
): CyberMondayResult | null {
  const { currency, dealType } = input;
  const unitPrice = num(input.originalPrice);
  const quantity = num(input.quantity);
  if (unitPrice == null || quantity == null) return null;
  if (unitPrice < 0 || quantity <= 0 || !Number.isInteger(quantity)) return null;

  const originalSubtotal = unitPrice * quantity;
  const deal = merchandiseAfterDeal(input, unitPrice, quantity);
  if (!deal) return null;

  const discountedSubtotal = deal.discountedSubtotal;
  if (!Number.isFinite(discountedSubtotal) || discountedSubtotal < 0) {
    return null;
  }

  const merchandiseDiscount = originalSubtotal - discountedSubtotal;
  const effective = calculateEffectiveDiscount(
    originalSubtotal,
    discountedSubtotal,
  );

  let taxAmount = 0;
  let preTaxMerchandise: number | null = null;
  const taxRate = input.applySalesTax ? num(input.salesTaxRate) : 0;
  if (input.applySalesTax) {
    if (taxRate == null || taxRate < 0) return null;
    if (input.taxIncluded) {
      const extracted = extractPreTaxFromInclusive(
        discountedSubtotal,
        taxRate,
      );
      if (!extracted) return null;
      // Tax already in sticker price: report included tax; do not add again
      taxAmount = extracted.includedTax;
      preTaxMerchandise = extracted.preTax;
    } else {
      const tax = calculateSalesTax(discountedSubtotal, taxRate);
      if (tax == null) return null;
      taxAmount = tax;
    }
  }

  let shippingRaw = num(input.shippingCost);
  if (shippingRaw == null) shippingRaw = 0;
  if (shippingRaw < 0) return null;

  let shippingCost = shippingRaw;
  let shippingWaived = false;
  if (input.useFreeShippingThreshold) {
    const threshold = num(input.freeShippingThreshold);
    if (threshold == null || threshold < 0) return null;
    // Default: threshold on after-discount merchandise subtotal
    if (deal.discountedSubtotal >= threshold) {
      shippingCost = 0;
      shippingWaived = true;
    }
  }

  // Tax-exclusive: merchandise + tax + ship. Tax-inclusive: sticker merchandise + ship.
  const finalCheckout = calculateFinalCheckout(
    discountedSubtotal,
    input.taxIncluded ? 0 : taxAmount,
    shippingCost,
  );
  if (finalCheckout == null) return null;

  // Original checkout estimate: full price + same tax treatment + shipping (before waive on discounted)
  let originalTax = 0;
  if (input.applySalesTax && taxRate != null && taxRate > 0 && !input.taxIncluded) {
    originalTax = calculateSalesTax(originalSubtotal, taxRate) ?? 0;
  }
  const originalCheckout =
    originalSubtotal +
    (input.taxIncluded ? 0 : originalTax) +
    shippingRaw;
  const checkoutSavings = originalCheckout - finalCheckout;

  let blackFridayComparison: string | null = null;
  if (input.compareBlackFriday) {
    const bf = num(input.blackFridayCheckoutTotal);
    if (bf == null || bf < 0) return null;
    const diff = bf - finalCheckout;
    if (Math.abs(diff) < 1e-9) {
      blackFridayComparison =
        'Black Friday and Cyber Monday checkout totals match for the amounts entered.';
    } else if (diff > 0) {
      blackFridayComparison = `Cyber Monday is ${money(diff, currency)} cheaper than the entered Black Friday total.`;
    } else {
      blackFridayComparison = `Black Friday is ${money(-diff, currency)} cheaper than this Cyber Monday total.`;
    }
  }

  const steps: string[] = [
    `Unit price ${money(unitPrice, currency)} × qty ${quantity} → original ${money(originalSubtotal, currency)}`,
    `Deal (${DEAL_TYPE_LABELS[dealType]}): ${deal.note}`,
    `Discounted merchandise = ${money(deal.discountedSubtotal, currency)} (savings ${money(merchandiseDiscount, currency)})`,
  ];
  if (input.applySalesTax && taxRate != null) {
    steps.push(
      input.taxIncluded && preTaxMerchandise != null
        ? `Tax included at ${taxRate}% → pre-tax ${money(preTaxMerchandise, currency)}, included tax ${money(taxAmount, currency)} (not added again)`
        : `Tax ${taxRate}% on discounted merchandise = ${money(taxAmount, currency)}`,
    );
  }
  steps.push(
    shippingWaived
      ? `Shipping waived (threshold met) → ${money(0, currency)}`
      : `Shipping = ${money(shippingCost, currency)}`,
    `Final checkout = ${money(finalCheckout, currency)}`,
  );

  const formulaBreakdown = [
    `Original subtotal = ${money(originalSubtotal, currency)}`,
    `Discounted merchandise = ${money(deal.discountedSubtotal, currency)}`,
    effective == null
      ? 'Effective discount = N/A'
      : `Effective discount = ${formatPercent(effective)}`,
    input.taxIncluded
      ? `Final checkout = tax-inclusive merchandise + shipping = ${money(finalCheckout, currency)}`
      : `Final checkout = merchandise + tax + shipping = ${money(finalCheckout, currency)}`,
  ].join('\n');

  const interpretation = `Your Cyber Monday deal reduces merchandise by ${
    effective == null ? '—' : formatPercent(effective)
  }. After shipping${input.applySalesTax ? ' and tax' : ''}, the final checkout amount is ${money(finalCheckout, currency)}.`;

  const explanation =
    'Tax and shipping rules vary by location and retailer. Default model: tax on after-discount merchandise (unless tax-included), free-shipping threshold on after-discount merchandise. Stacking policies are not universal.';

  return {
    currency,
    dealType,
    unitPrice,
    quantity,
    originalSubtotal,
    merchandiseDiscount,
    discountedSubtotal: deal.discountedSubtotal,
    effectiveDiscountPercentage: effective,
    taxAmount,
    taxIncluded: input.taxIncluded,
    shippingCost,
    shippingWaived,
    finalCheckoutAmount: finalCheckout,
    merchandiseSavings: merchandiseDiscount,
    originalCheckoutEstimate: originalCheckout,
    checkoutSavings,
    blackFridayComparison,
    formattedOriginal: money(originalSubtotal, currency),
    formattedDiscount: money(merchandiseDiscount, currency),
    formattedDiscounted: money(deal.discountedSubtotal, currency),
    formattedTax: money(taxAmount, currency),
    formattedShipping: money(shippingCost, currency),
    formattedFinal: money(finalCheckout, currency),
    formattedSavings: money(merchandiseDiscount, currency),
    formattedEffectivePct: effective == null ? 'N/A' : formatPercent(effective),
    formulaBreakdown,
    steps,
    interpretation,
    explanation,
  };
}
