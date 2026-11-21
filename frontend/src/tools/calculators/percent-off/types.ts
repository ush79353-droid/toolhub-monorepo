import type { SupportedCurrency } from '@/tools/shared/currency';

export type PercentOffSolveMode =
  | 'finalPrice'
  | 'originalPrice'
  | 'discountPercent';

export interface PercentOffInput {
  solveMode: PercentOffSolveMode;
  currency: SupportedCurrency;
  originalPrice: string;
  discountPercent: string;
  enableAdditionalDiscount: boolean;
  additionalDiscountPercent: string;
  /** Sale / final price before tax — used in reverse modes */
  salePrice: string;
  showSalesTaxSection: boolean;
  applySalesTax: boolean;
  salesTaxRate: string;
}

export interface PercentOffResult {
  currency: SupportedCurrency;
  solveMode: PercentOffSolveMode;
  originalPrice: number;
  discountPercent: number;
  additionalDiscountPercent: number | null;
  firstDiscountAmount: number;
  secondDiscountAmount: number;
  totalSavings: number;
  effectiveDiscountPercent: number;
  discountedPrice: number;
  applySalesTax: boolean;
  salesTaxRate: number;
  taxAmount: number;
  finalPriceWithTax: number;
  formattedOriginal: string;
  formattedFirstDiscount: string;
  formattedSecondDiscount: string;
  formattedSavings: string;
  formattedDiscounted: string;
  formattedEffectivePct: string;
  formattedTax: string;
  formattedTotalWithTax: string;
  /** 0–100 for savings bar */
  savingsBarPct: number;
  remainingBarPct: number;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
}

export type PercentOffFieldErrors = {
  form?: string;
  originalPrice?: string;
  discountPercent?: string;
  additionalDiscountPercent?: string;
  salePrice?: string;
  salesTaxRate?: string;
};

export function createDefaultInput(): PercentOffInput {
  return {
    solveMode: 'finalPrice',
    currency: 'USD',
    originalPrice: '',
    discountPercent: '',
    enableAdditionalDiscount: false,
    additionalDiscountPercent: '',
    salePrice: '',
    showSalesTaxSection: false,
    applySalesTax: false,
    salesTaxRate: '',
  };
}

export function createEmptyInput(): PercentOffInput {
  return createDefaultInput();
}

/** Reference: $200 · 25% → save $50 · final $150 (no tax). */
export function createExampleInput(): PercentOffInput {
  return {
    solveMode: 'finalPrice',
    currency: 'USD',
    originalPrice: '200',
    discountPercent: '25',
    enableAdditionalDiscount: false,
    additionalDiscountPercent: '',
    salePrice: '',
    showSalesTaxSection: false,
    applySalesTax: false,
    salesTaxRate: '',
  };
}
