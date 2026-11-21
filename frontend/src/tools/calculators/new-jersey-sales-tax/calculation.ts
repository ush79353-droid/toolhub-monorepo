import type { NewJerseySalesTaxResult } from './types';

/**
 * New Jersey Division of Taxation — Rates and Boundaries
 * https://www.state.nj.us/treasury/taxation/salestax.shtml
 * (last checked page update: 2025-04-30)
 *
 * - Single statewide general sales tax rate: 6.625% (from 2018-01-01)
 * - Official NJ ZIP range: 07001–08989
 *
 * UEZ reduced rates are intentionally NOT applied from ZIP alone.
 */
export const NJ_STANDARD_SALES_TAX_RATE_PERCENT = 6.625;

/** Inclusive official NJ ZIP numeric bounds (ZIP kept as string elsewhere). */
export const NJ_ZIP_MIN = 7001;
export const NJ_ZIP_MAX = 8989;

export function formatNjUsd(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  const rounded = roundMoney(amount);
  if (Object.is(rounded, -0) || rounded === 0) return '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rounded);
}

export function formatNjRatePercent(rate: number): string {
  if (!Number.isFinite(rate)) return '';
  // Keep meaningful digits (6.625) without trailing noise.
  const text = rate.toFixed(4).replace(/\.?0+$/, '');
  return text === '-0' ? '0' : text;
}

/** Round to USD cents once; reject non-finite. */
export function roundMoney(amount: number): number {
  if (!Number.isFinite(amount)) return Number.NaN;
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/**
 * Validate a five-digit NJ ZIP string against the Division of Taxation range.
 * Preserves leading zeros by accepting only digit strings of length 5.
 */
export function isValidNewJerseyZip(zipCode: string): boolean {
  if (!/^\d{5}$/.test(zipCode)) return false;
  const n = Number(zipCode);
  if (!Number.isInteger(n)) return false;
  return n >= NJ_ZIP_MIN && n <= NJ_ZIP_MAX;
}

/**
 * Sales Tax = Purchase Amount × Applicable Rate / 100
 * Total Amount = Purchase Amount + Sales Tax
 *
 * Always uses the standard statewide rate. Does not invent exemptions,
 * local surtaxes, or UEZ reduced rates from ZIP.
 */
export function calculateNewJerseySalesTax(
  purchaseAmount: number,
  zipCode: string,
): NewJerseySalesTaxResult | null {
  if (!Number.isFinite(purchaseAmount) || purchaseAmount < 0) return null;
  if (!isValidNewJerseyZip(zipCode)) return null;

  const taxRatePercent = NJ_STANDARD_SALES_TAX_RATE_PERCENT;
  const rawTax = (purchaseAmount * taxRatePercent) / 100;
  if (!Number.isFinite(rawTax)) return null;

  const salesTax = roundMoney(rawTax);
  const totalAmount = roundMoney(purchaseAmount + salesTax);
  if (!Number.isFinite(salesTax) || !Number.isFinite(totalAmount)) return null;
  if (!Number.isFinite(purchaseAmount + salesTax)) return null;

  const formattedPurchaseAmount = formatNjUsd(purchaseAmount);
  const formattedTaxRatePercent = formatNjRatePercent(taxRatePercent);
  const formattedSalesTax = formatNjUsd(salesTax);
  const formattedTotalAmount = formatNjUsd(totalAmount);

  const rateLabel = `Standard New Jersey statewide sales tax (${formattedTaxRatePercent}%). UEZ reduced rates are not applied from ZIP alone.`;

  const summaryText = [
    'Sales Tax Calculator New Jersey | Omega Calculators',
    `Purchase amount: $${formattedPurchaseAmount}`,
    `ZIP code: ${zipCode}`,
    `Applicable rate: ${formattedTaxRatePercent}% (standard taxable purchase)`,
    `Sales tax: $${formattedSalesTax}`,
    `Total with tax: $${formattedTotalAmount}`,
  ].join('\n');

  return {
    purchaseAmount,
    zipCode,
    taxRatePercent,
    salesTax,
    totalAmount,
    formattedPurchaseAmount,
    formattedTaxRatePercent,
    formattedSalesTax,
    formattedTotalAmount,
    rateLabel,
    summaryText,
  };
}

export function shareResultText(result: NewJerseySalesTaxResult): string {
  return result.summaryText;
}
