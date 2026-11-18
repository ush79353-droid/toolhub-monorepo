import type { SupportedCurrency } from '@/tools/shared/currency';

/** Only verified screenshot mode: percent off. Do not invent BOGO / fixed-$ modes. */
export type DiscountType = 'percent_off';

/** Labels whether the entered original price already includes tax; no tax rate is applied. */
export type TaxIncluded = 'yes' | 'no';

export interface DiscountInput {
  discountType: DiscountType;
  /** Original / list price before the discount. */
  originalPrice: string;
  originalPriceCurrency: SupportedCurrency;
  /** Discount percent for % off mode (0–100). Never FX-converted. */
  discountPercent: string;
  taxIncluded: TaxIncluded;
  /** Independent display currency for the amount you pay. */
  youPayCurrency: SupportedCurrency;
  /** Independent display currency for savings. */
  youSaveCurrency: SupportedCurrency;
}

export interface DiscountResult {
  /** Full-precision final price in original-price currency. */
  youPayCanonical: number;
  /** Full-precision discount amount in original-price currency. */
  youSaveCanonical: number;
  /** Final price after FX into youPayCurrency. */
  youPay: number;
  /** Savings after FX into youSaveCurrency. */
  youSave: number;
  originalPriceCurrency: SupportedCurrency;
  youPayCurrency: SupportedCurrency;
  youSaveCurrency: SupportedCurrency;
  formattedYouPay: string;
  formattedYouSave: string;
  taxIncluded: TaxIncluded;
}

export type DiscountFieldErrors = {
  originalPrice?: string;
  discountPercent?: string;
  form?: string;
};

export const DISCOUNT_TYPE_OPTIONS: readonly {
  value: DiscountType;
  label: string;
}[] = [{ value: 'percent_off', label: '% off' }];

export function createDefaultInput(): DiscountInput {
  return {
    discountType: 'percent_off',
    originalPrice: '',
    originalPriceCurrency: 'PKR',
    discountPercent: '',
    taxIncluded: 'yes',
    youPayCurrency: 'PKR',
    youSaveCurrency: 'PKR',
  };
}
