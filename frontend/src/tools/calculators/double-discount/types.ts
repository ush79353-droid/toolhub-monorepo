import type { SupportedCurrency } from '@/tools/shared/currency';

export interface DoubleDiscountInput {
  /** Original / list price before either discount. */
  originalPrice: string;
  originalPriceCurrency: SupportedCurrency;
  /** First sequential percent discount (0–100). Never FX-converted. */
  firstDiscountPercent: string;
  /** Second sequential percent discount (0–100). Never FX-converted. */
  secondDiscountPercent: string;
  /** Independent display currency for final price. */
  finalPriceCurrency: SupportedCurrency;
  /** Independent display currency for total savings. */
  totalSavingsCurrency: SupportedCurrency;
  /** Collapsible Effective discount section (collapsed by default). */
  effectiveOpen: boolean;
}

export interface DoubleDiscountResult {
  /** Full-precision final price in original-price currency. */
  finalPriceCanonical: number;
  /** Full-precision savings in original-price currency. */
  totalSavingsCanonical: number;
  /** Combined effective discount percent (full precision). */
  effectiveDiscountPercent: number;
  /** Final price after FX into finalPriceCurrency. */
  finalPrice: number;
  /** Savings after FX into totalSavingsCurrency. */
  totalSavings: number;
  originalPriceCurrency: SupportedCurrency;
  finalPriceCurrency: SupportedCurrency;
  totalSavingsCurrency: SupportedCurrency;
  formattedFinalPrice: string;
  formattedTotalSavings: string;
  formattedEffectiveDiscountPercent: string;
}

export type DoubleDiscountFieldErrors = {
  originalPrice?: string;
  firstDiscountPercent?: string;
  secondDiscountPercent?: string;
  form?: string;
};

export function createDefaultInput(): DoubleDiscountInput {
  return {
    originalPrice: '',
    originalPriceCurrency: 'PKR',
    firstDiscountPercent: '',
    secondDiscountPercent: '',
    finalPriceCurrency: 'PKR',
    totalSavingsCurrency: 'PKR',
    effectiveOpen: false,
  };
}
