import type { SupportedCurrency } from '@/tools/shared/currency';

export type DiscountKind = 'percentage' | 'fixed';

export type BlackFridaySolveTarget =
  | 'finalPrice'
  | 'originalPrice'
  | 'discountPercent'
  | 'savings';

export interface BlackFridayInput {
  solveTarget: BlackFridaySolveTarget;
  currency: SupportedCurrency;
  originalPrice: string;
  discountKind: DiscountKind;
  discountPercentage: string;
  fixedDiscount: string;
  /** Optional second successive percentage discount */
  enableSecondDiscount: boolean;
  secondDiscountPercentage: string;
  applySalesTax: boolean;
  salesTaxRate: string;
  /** Used in reverse modes */
  discountedPrice: string;
}

export interface BlackFridayResult {
  solveTarget: BlackFridaySolveTarget;
  currency: SupportedCurrency;
  originalPrice: number;
  discountKind: DiscountKind;
  discountPercentage: number;
  fixedDiscount: number;
  secondDiscountPercentage: number | null;
  discountAmount: number;
  discountedPrice: number;
  applySalesTax: boolean;
  salesTaxRate: number;
  salesTaxAmount: number;
  finalPrice: number;
  savingsBeforeTax: number;
  savingsPercentage: number;
  effectiveDiscountPercentage: number;
  formattedOriginal: string;
  formattedDiscountAmount: string;
  formattedDiscounted: string;
  formattedTax: string;
  formattedFinal: string;
  formattedSavings: string;
  formattedSavingsPct: string;
  formattedEffectivePct: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
}

export type BlackFridayFieldErrors = {
  form?: string;
  originalPrice?: string;
  discountPercentage?: string;
  fixedDiscount?: string;
  secondDiscountPercentage?: string;
  salesTaxRate?: string;
  discountedPrice?: string;
};

export function createDefaultInput(): BlackFridayInput {
  return {
    solveTarget: 'finalPrice',
    currency: 'USD',
    originalPrice: '',
    discountKind: 'percentage',
    discountPercentage: '',
    fixedDiscount: '',
    enableSecondDiscount: false,
    secondDiscountPercentage: '',
    applySalesTax: false,
    salesTaxRate: '',
    discountedPrice: '',
  };
}

export function createEmptyInput(): BlackFridayInput {
  return createDefaultInput();
}

/** Reference: $200 · 35% off · 8% tax → final $140.40. */
export function createExampleInput(): BlackFridayInput {
  return {
    solveTarget: 'finalPrice',
    currency: 'USD',
    originalPrice: '200',
    discountKind: 'percentage',
    discountPercentage: '35',
    fixedDiscount: '',
    enableSecondDiscount: false,
    secondDiscountPercentage: '',
    applySalesTax: true,
    salesTaxRate: '8',
    discountedPrice: '',
  };
}
