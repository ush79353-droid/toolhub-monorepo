/**
 * California sales tax — pure math helpers.
 *
 * Official rates come from the CDTFA Tax Rate API (`GetRateByAddress`).
 * API `rate` is a decimal fraction (e.g. 0.0875 = 8.75%).
 * This module never invents a rate; callers must supply a verified fraction.
 */

import {
  CA_ZIP_MAX,
  CA_ZIP_MIN,
  isValidCaliforniaZip,
} from './validation';
import type {
  CaliforniaRateMatch,
  CaliforniaSalesTaxSuccessResult,
  CaliforniaSalesTaxUnavailableResult,
} from './types';

export { CA_ZIP_MAX, CA_ZIP_MIN, isValidCaliforniaZip };

export const CA_AMBIGUOUS_RATE_MESSAGE =
  'Multiple California tax jurisdictions match this address. A more precise location may be required; a single rate was not selected automatically.';

export const CA_NO_MATCH_MESSAGE =
  'A reliable California sales tax rate could not be determined for this address. Verify the street, city, and ZIP, or try a nearby address recognized by CDTFA.';

export function formatCaUsd(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  const rounded = roundMoney(amount);
  if (Object.is(rounded, -0) || rounded === 0) return '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rounded);
}

export function formatCaRatePercent(ratePercent: number): string {
  if (!Number.isFinite(ratePercent)) return '';
  const text = ratePercent.toFixed(4).replace(/\.?0+$/, '');
  return text === '-0' ? '0' : text;
}

/** Round to USD cents once; reject non-finite. */
export function roundMoney(amount: number): number {
  if (!Number.isFinite(amount)) return Number.NaN;
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/**
 * Tax Amount = Purchase × Combined Rate (decimal fraction)
 * Total = Purchase + Tax
 */
export function applyCaliforniaSalesTaxRate(
  purchaseAmount: number,
  rateFraction: number,
  meta: {
    streetAddress: string;
    city: string;
    zipCode: string;
    jurisdiction: string;
    county: string;
    tac: string;
    formattedAddress: string | null;
    lookedUpAt: string;
  }
): CaliforniaSalesTaxSuccessResult | null {
  if (!Number.isFinite(purchaseAmount) || purchaseAmount < 0) return null;
  if (!Number.isFinite(rateFraction) || rateFraction < 0) return null;
  if (!isValidCaliforniaZip(meta.zipCode)) return null;

  const rawTax = purchaseAmount * rateFraction;
  if (!Number.isFinite(rawTax)) return null;

  const salesTax = roundMoney(rawTax);
  const totalAmount = roundMoney(purchaseAmount + salesTax);
  if (!Number.isFinite(salesTax) || !Number.isFinite(totalAmount)) return null;

  const taxRatePercent = rateFraction * 100;
  const formattedPurchaseAmount = formatCaUsd(purchaseAmount);
  const formattedTaxRatePercent = formatCaRatePercent(taxRatePercent);
  const formattedSalesTax = formatCaUsd(salesTax);
  const formattedTotalAmount = formatCaUsd(totalAmount);

  return {
    kind: 'success',
    purchaseAmount,
    streetAddress: meta.streetAddress,
    city: meta.city,
    zipCode: meta.zipCode,
    taxRate: rateFraction,
    taxRatePercent,
    salesTax,
    totalAmount,
    jurisdiction: meta.jurisdiction,
    county: meta.county,
    tac: meta.tac,
    formattedAddress: meta.formattedAddress,
    lookedUpAt: meta.lookedUpAt,
    formattedPurchaseAmount,
    formattedTaxRatePercent,
    formattedSalesTax,
    formattedTotalAmount,
    summaryText: [
      'California Sales Tax Calculator — Omega Calculators',
      `Purchase amount: $${formattedPurchaseAmount}`,
      `Location: ${meta.streetAddress}, ${meta.city}, CA ${meta.zipCode}`,
      `Jurisdiction: ${meta.jurisdiction}${meta.county ? ` (${meta.county} County)` : ''}`,
      `Combined rate: ${formattedTaxRatePercent}% (CDTFA)`,
      `Estimated sales tax: $${formattedSalesTax}`,
      `Estimated total: $${formattedTotalAmount}`,
      'Estimate for a generally taxable purchase. Exemptions not applied.',
    ].join('\n'),
  };
}

export function buildCaliforniaUnavailableResult(
  purchaseAmount: number,
  streetAddress: string,
  city: string,
  zipCode: string,
  unavailableMessage: string,
  candidates: CaliforniaRateMatch[] = []
): CaliforniaSalesTaxUnavailableResult | null {
  if (!Number.isFinite(purchaseAmount) || purchaseAmount < 0) return null;
  const formattedPurchaseAmount = formatCaUsd(purchaseAmount);
  return {
    kind: 'unavailable',
    purchaseAmount,
    streetAddress,
    city,
    zipCode,
    unavailableMessage,
    candidates,
    formattedPurchaseAmount,
    summaryText: [
      'California Sales Tax Calculator — Omega Calculators',
      `Purchase amount: $${formattedPurchaseAmount}`,
      `Location: ${streetAddress}, ${city}, CA ${zipCode}`,
      'Combined sales tax rate: unavailable',
      unavailableMessage,
    ].join('\n'),
  };
}
