/**
 * Ohio sales tax — ZIP validation and unavailable-rate gate.
 *
 * Ohio Department of Taxation publishes jurisdiction-specific combined rates
 * (state + county + transit) that cannot be derived from ZIP alone without a
 * verified rate table. This project has no authorized Ohio ZIP→rate dataset.
 *
 * USPS Ohio ZIP numeric range used for format/jurisdiction gating only:
 * 43001–45999. Never invent a single statewide combined rate.
 */

/** Inclusive Ohio ZIP numeric bounds (ZIP kept as string elsewhere). */
export const OH_ZIP_MIN = 43001;
export const OH_ZIP_MAX = 45999;

export const OHIO_RATE_UNAVAILABLE_MESSAGE =
  'A verified Ohio ZIP-to-tax-rate table is not available in this project. Combined state, county, and transit rates vary by jurisdiction and cannot be invented from ZIP alone. Taxable-product exemptions and special rules are also not determined by purchase amount and ZIP.';

export function formatOhUsd(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  const rounded = roundMoney(amount);
  if (Object.is(rounded, -0) || rounded === 0) return '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rounded);
}

/** Round to USD cents once; reject non-finite. */
export function roundMoney(amount: number): number {
  if (!Number.isFinite(amount)) return Number.NaN;
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/**
 * Validate a five-digit Ohio ZIP string against the USPS OH numeric range.
 * Preserves leading zeros by accepting only digit strings of length 5.
 */
export function isValidOhioZip(zipCode: string): boolean {
  if (!/^\d{5}$/.test(zipCode)) return false;
  const n = Number(zipCode);
  if (!Number.isInteger(n)) return false;
  return n >= OH_ZIP_MIN && n <= OH_ZIP_MAX;
}

export interface OhioSalesTaxLookup {
  rateUnavailable: true;
  unavailableMessage: string;
  purchaseAmount: number;
  zipCode: string;
  formattedPurchaseAmount: string;
  summaryText: string;
}

/**
 * Gates on purchase ≥ 0 and a valid Ohio ZIP. Never returns a fabricated rate
 * or tax amount — always an explicit unavailable-rate result when inputs are valid.
 */
export function lookupOhioSalesTax(
  purchaseAmount: number,
  zipCode: string
): OhioSalesTaxLookup | null {
  if (!Number.isFinite(purchaseAmount) || purchaseAmount < 0) return null;
  if (!isValidOhioZip(zipCode)) return null;

  const formattedPurchaseAmount = formatOhUsd(purchaseAmount);
  return {
    rateUnavailable: true,
    unavailableMessage: OHIO_RATE_UNAVAILABLE_MESSAGE,
    purchaseAmount,
    zipCode,
    formattedPurchaseAmount,
    summaryText: [
      'Ohio Sales Tax Calculator — Omega Calculators',
      `Purchase amount: $${formattedPurchaseAmount}`,
      `ZIP code: ${zipCode}`,
      'Combined sales tax rate: unavailable (no verified ZIP rate table)',
      OHIO_RATE_UNAVAILABLE_MESSAGE,
    ].join('\n'),
  };
}
