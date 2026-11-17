import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { MarginVatDriver, PricingPin } from './types';

export function formatMarginVatMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatMarginVatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(value);
}

export interface MarginVatSolveInput {
  vatPercent: number | null;
  netCost: number | null;
  grossCost: number | null;
  marginPercent: number | null;
  markupPercent: number | null;
  netPrice: number | null;
  grossPrice: number | null;
  profit: number | null;
  driver: MarginVatDriver;
  pricingPin: PricingPin;
}

export type MarginVatSolveError =
  | 'insufficient'
  | 'invalid_vat'
  | 'negative_cost'
  | 'negative_price'
  | 'margin_ge_100'
  | 'zero_denominator'
  | 'inconsistent';

/** Solved snapshot. Null means that field is not yet determined. */
export interface MarginVatSolved {
  vatPercent: number;
  netCost: number | null;
  grossCost: number | null;
  marginPercent: number | null;
  markupPercent: number | null;
  netPrice: number | null;
  grossPrice: number | null;
  profit: number | null;
}

function withVat(net: number, vat: number): number {
  return net * (1 + vat / 100);
}

function withoutVat(gross: number, vat: number): number | null {
  const denom = 1 + vat / 100;
  if (!(denom > 0) || !Number.isFinite(denom)) return null;
  return gross / denom;
}

function completePair(
  vat: number,
  netCost: number,
  netPrice: number
): MarginVatSolved | null {
  if (![vat, netCost, netPrice].every(Number.isFinite)) return null;
  if (netCost < 0 || netPrice < 0) return null;
  if (!(netPrice > 0) && netPrice !== 0) return null;
  if (!(netCost > 0) && netCost !== 0) return null;
  const profit = netPrice - netCost;
  if (!(netPrice > 0)) {
    // zero selling price → margin undefined
    if (!(netCost > 0)) {
      return {
        vatPercent: vat,
        netCost,
        grossCost: withVat(netCost, vat),
        marginPercent: null,
        markupPercent: null,
        netPrice,
        grossPrice: withVat(netPrice, vat),
        profit,
      };
    }
    return {
      vatPercent: vat,
      netCost,
      grossCost: withVat(netCost, vat),
      marginPercent: null,
      markupPercent: (profit / netCost) * 100,
      netPrice,
      grossPrice: withVat(netPrice, vat),
      profit,
    };
  }
  if (!(netCost > 0)) {
    return {
      vatPercent: vat,
      netCost,
      grossCost: withVat(netCost, vat),
      marginPercent: (profit / netPrice) * 100,
      markupPercent: null,
      netPrice,
      grossPrice: withVat(netPrice, vat),
      profit,
    };
  }
  return {
    vatPercent: vat,
    netCost,
    grossCost: withVat(netCost, vat),
    marginPercent: (profit / netPrice) * 100,
    markupPercent: (profit / netCost) * 100,
    netPrice,
    grossPrice: withVat(netPrice, vat),
    profit,
  };
}

function resolveVat(input: MarginVatSolveInput): number | null {
  if (input.vatPercent === null) return 0;
  if (!Number.isFinite(input.vatPercent) || input.vatPercent < 0) return null;
  return input.vatPercent;
}

function resolveNetCost(
  input: MarginVatSolveInput,
  vat: number
): number | null {
  if (input.driver === 'grossCost' && input.grossCost !== null) {
    return withoutVat(input.grossCost, vat);
  }
  if (input.netCost !== null) return input.netCost;
  if (input.grossCost !== null) return withoutVat(input.grossCost, vat);
  return null;
}

function resolveNetPrice(
  input: MarginVatSolveInput,
  vat: number
): number | null {
  if (input.driver === 'grossPrice' && input.grossPrice !== null) {
    return withoutVat(input.grossPrice, vat);
  }
  if (input.netPrice !== null) return input.netPrice;
  if (input.grossPrice !== null) return withoutVat(input.grossPrice, vat);
  return null;
}

function priceFromPin(
  netCost: number,
  marginPercent: number | null,
  markupPercent: number | null,
  pin: PricingPin
): { ok: true; netPrice: number } | { ok: false; error: MarginVatSolveError } | null {
  if (pin === 'margin') {
    if (marginPercent === null) return null;
    if (marginPercent >= 100) return { ok: false, error: 'margin_ge_100' };
    const denom = 1 - marginPercent / 100;
    if (!(denom > 0)) return { ok: false, error: 'zero_denominator' };
    return { ok: true, netPrice: netCost / denom };
  }
  if (markupPercent === null) return null;
  return { ok: true, netPrice: netCost * (1 + markupPercent / 100) };
}

/**
 * Resolve Margin & VAT fields in one currency from the last-edited driver.
 * Full precision; caller rounds only for display.
 */
export function calculateMarginVatCanonical(
  input: MarginVatSolveInput
): { ok: true; value: MarginVatSolved } | { ok: false; error: MarginVatSolveError } {
  const vat = resolveVat(input);
  if (vat === null) return { ok: false, error: 'invalid_vat' };

  const { driver, pricingPin } = input;

  if (driver === 'vat') {
    const netCost = resolveNetCost(input, vat);
    const netPrice = resolveNetPrice(input, vat);
    if (netCost === null && netPrice === null) {
      return { ok: false, error: 'insufficient' };
    }
    if (netCost !== null && netCost < 0) return { ok: false, error: 'negative_cost' };
    if (netPrice !== null && netPrice < 0) return { ok: false, error: 'negative_price' };
    if (netCost !== null && netPrice !== null) {
      const value = completePair(vat, netCost, netPrice);
      if (!value) return { ok: false, error: 'inconsistent' };
      return { ok: true, value };
    }
    if (netCost !== null) {
      return {
        ok: true,
        value: {
          vatPercent: vat,
          netCost,
          grossCost: withVat(netCost, vat),
          marginPercent: null,
          markupPercent: null,
          netPrice: null,
          grossPrice: null,
          profit: null,
        },
      };
    }
    return {
      ok: true,
      value: {
        vatPercent: vat,
        netCost: null,
        grossCost: null,
        marginPercent: null,
        markupPercent: null,
        netPrice: netPrice!,
        grossPrice: withVat(netPrice!, vat),
        profit: null,
      },
    };
  }

  if (driver === 'netCost' || driver === 'grossCost') {
    const netCost = resolveNetCost(input, vat);
    if (netCost === null) return { ok: false, error: 'insufficient' };
    if (netCost < 0) return { ok: false, error: 'negative_cost' };

    const pinned = priceFromPin(
      netCost,
      input.marginPercent,
      input.markupPercent,
      pricingPin
    );
    let netPrice: number | null = null;
    if (pinned?.ok === false) {
      return { ok: false, error: pinned.error };
    }
    if (pinned?.ok === true) {
      netPrice = pinned.netPrice;
    } else if (input.netPrice !== null || input.grossPrice !== null) {
      netPrice = resolveNetPrice(input, vat);
    } else if (input.profit !== null) {
      netPrice = netCost + input.profit;
    } else {
      const fallbackPin: PricingPin =
        input.marginPercent !== null
          ? 'margin'
          : input.markupPercent !== null
            ? 'markup'
            : pricingPin;
      const alt = priceFromPin(
        netCost,
        input.marginPercent,
        input.markupPercent,
        fallbackPin
      );
      if (alt && alt.ok === false) return { ok: false, error: alt.error };
      if (alt && alt.ok) netPrice = alt.netPrice;
    }

    if (netPrice === null) {
      return {
        ok: true,
        value: {
          vatPercent: vat,
          netCost,
          grossCost: withVat(netCost, vat),
          marginPercent: null,
          markupPercent: null,
          netPrice: null,
          grossPrice: null,
          profit: null,
        },
      };
    }
    if (netPrice < 0) return { ok: false, error: 'negative_price' };
    const value = completePair(vat, netCost, netPrice);
    if (!value) return { ok: false, error: 'zero_denominator' };
    return { ok: true, value };
  }

  if (driver === 'margin') {
    const netCost = resolveNetCost(input, vat);
    if (netCost === null || input.marginPercent === null) {
      return { ok: false, error: 'insufficient' };
    }
    if (netCost < 0) return { ok: false, error: 'negative_cost' };
    const pinned = priceFromPin(netCost, input.marginPercent, null, 'margin');
    if (!pinned || pinned.ok === false) {
      return { ok: false, error: pinned?.error ?? 'insufficient' };
    }
    const value = completePair(vat, netCost, pinned.netPrice);
    if (!value) return { ok: false, error: 'inconsistent' };
    return { ok: true, value };
  }

  if (driver === 'markup') {
    const netCost = resolveNetCost(input, vat);
    if (netCost === null || input.markupPercent === null) {
      return { ok: false, error: 'insufficient' };
    }
    if (netCost < 0) return { ok: false, error: 'negative_cost' };
    const pinned = priceFromPin(netCost, null, input.markupPercent, 'markup');
    if (!pinned || pinned.ok === false) {
      return { ok: false, error: pinned?.error ?? 'insufficient' };
    }
    const value = completePair(vat, netCost, pinned.netPrice);
    if (!value) return { ok: false, error: 'zero_denominator' };
    return { ok: true, value };
  }

  if (driver === 'netPrice' || driver === 'grossPrice') {
    const netPrice = resolveNetPrice(input, vat);
    if (netPrice === null) return { ok: false, error: 'insufficient' };
    if (netPrice < 0) return { ok: false, error: 'negative_price' };
    const netCost = resolveNetCost(input, vat);
    if (netCost === null) {
      return {
        ok: true,
        value: {
          vatPercent: vat,
          netCost: null,
          grossCost: null,
          marginPercent: null,
          markupPercent: null,
          netPrice,
          grossPrice: withVat(netPrice, vat),
          profit: null,
        },
      };
    }
    if (netCost < 0) return { ok: false, error: 'negative_cost' };
    const value = completePair(vat, netCost, netPrice);
    if (!value) return { ok: false, error: 'zero_denominator' };
    return { ok: true, value };
  }

  // profit
  const netCost = resolveNetCost(input, vat);
  if (netCost === null || input.profit === null) {
    return { ok: false, error: 'insufficient' };
  }
  if (netCost < 0) return { ok: false, error: 'negative_cost' };
  const netPrice = netCost + input.profit;
  if (netPrice < 0) return { ok: false, error: 'negative_price' };
  const value = completePair(vat, netCost, netPrice);
  if (!value) return { ok: false, error: 'zero_denominator' };
  return { ok: true, value };
}
