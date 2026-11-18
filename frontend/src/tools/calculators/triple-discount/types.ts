import type { SupportedCurrency } from '@/tools/shared/currency';

export interface TripleDiscountInput {
  /** Original / list price before any discount. */
  originalPrice: string;
  originalPriceCurrency: SupportedCurrency;
  /** First sequential percent discount (0–100). Never FX-converted. */
  firstDiscountPercent: string;
  /** Second sequential percent discount (0–100). Never FX-converted. */
  secondDiscountPercent: string;
  /** Third sequential percent discount (0–100). Never FX-converted. */
  thirdDiscountPercent: string;
  /** Independent display currency for final price. */
  finalPriceCurrency: SupportedCurrency;
  /** Independent display currency for price difference (savings). */
  priceDifferenceCurrency: SupportedCurrency;
  /** Collapsible Effective discount section (collapsed by default). */
  effectiveOpen: boolean;
}

export interface TripleDiscountResult {
  /** Full-precision final price in original-price currency. */
  finalPriceCanonical: number;
  /** Full-precision price difference in original-price currency. */
  priceDifferenceCanonical: number;
  /** Combined effective discount percent (full precision). */
  effectiveDiscountPercent: number;
  /** Final price after FX into finalPriceCurrency. */
  finalPrice: number;
  /** Price difference after FX into priceDifferenceCurrency. */
  priceDifference: number;
  originalPriceCurrency: SupportedCurrency;
  finalPriceCurrency: SupportedCurrency;
  priceDifferenceCurrency: SupportedCurrency;
  formattedFinalPrice: string;
  formattedPriceDifference: string;
  formattedEffectiveDiscountPercent: string;
}

export type TripleDiscountFieldErrors = {
  originalPrice?: string;
  firstDiscountPercent?: string;
  secondDiscountPercent?: string;
  thirdDiscountPercent?: string;
  form?: string;
};

export function createDefaultInput(): TripleDiscountInput {
  return {
    originalPrice: '',
    originalPriceCurrency: 'PKR',
    firstDiscountPercent: '',
    secondDiscountPercent: '0',
    thirdDiscountPercent: '0',
    finalPriceCurrency: 'PKR',
    priceDifferenceCurrency: 'PKR',
    effectiveOpen: false,
  };
}
