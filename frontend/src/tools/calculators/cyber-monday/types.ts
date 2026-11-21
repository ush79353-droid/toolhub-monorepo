import type { SupportedCurrency } from '@/tools/shared/currency';

export type CyberMondayDealType =
  | 'percentage'
  | 'fixed'
  | 'double'
  | 'triple'
  | 'bogo-free'
  | 'bogo-discounted'
  | 'buy-x-get-y-free'
  | 'buy-x-pay-y'
  | 'percentage-plus-coupon';

export type CouponOrder = 'percent-then-fixed' | 'fixed-then-percent';

export interface CyberMondayInput {
  currency: SupportedCurrency;
  dealType: CyberMondayDealType;
  originalPrice: string;
  quantity: string;
  discountPercentage: string;
  fixedDiscount: string;
  secondDiscountPercentage: string;
  thirdDiscountPercentage: string;
  couponAmount: string;
  couponOrder: CouponOrder;
  secondItemDiscountPercentage: string;
  buyQuantity: string;
  freeQuantity: string;
  payQuantity: string;
  taxIncluded: boolean;
  applySalesTax: boolean;
  salesTaxRate: string;
  shippingCost: string;
  useFreeShippingThreshold: boolean;
  freeShippingThreshold: string;
  /** Optional Black Friday checkout total for comparison */
  compareBlackFriday: boolean;
  blackFridayCheckoutTotal: string;
}

export interface CyberMondayResult {
  currency: SupportedCurrency;
  dealType: CyberMondayDealType;
  unitPrice: number;
  quantity: number;
  originalSubtotal: number;
  merchandiseDiscount: number;
  discountedSubtotal: number;
  effectiveDiscountPercentage: number | null;
  taxAmount: number;
  taxIncluded: boolean;
  shippingCost: number;
  shippingWaived: boolean;
  finalCheckoutAmount: number;
  merchandiseSavings: number;
  originalCheckoutEstimate: number;
  checkoutSavings: number;
  blackFridayComparison: string | null;
  formattedOriginal: string;
  formattedDiscount: string;
  formattedDiscounted: string;
  formattedTax: string;
  formattedShipping: string;
  formattedFinal: string;
  formattedSavings: string;
  formattedEffectivePct: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
}

export type CyberMondayFieldErrors = {
  form?: string;
  originalPrice?: string;
  quantity?: string;
  discountPercentage?: string;
  fixedDiscount?: string;
  secondDiscountPercentage?: string;
  thirdDiscountPercentage?: string;
  couponAmount?: string;
  secondItemDiscountPercentage?: string;
  buyQuantity?: string;
  freeQuantity?: string;
  payQuantity?: string;
  salesTaxRate?: string;
  shippingCost?: string;
  freeShippingThreshold?: string;
  blackFridayCheckoutTotal?: string;
};

export const DEAL_TYPE_LABELS: Record<CyberMondayDealType, string> = {
  percentage: 'Percentage discount',
  fixed: 'Fixed amount off',
  double: 'Double discount',
  triple: 'Triple discount',
  'bogo-free': 'Buy One Get One Free',
  'bogo-discounted': 'Buy One Get One at a discount',
  'buy-x-get-y-free': 'Buy X Get Y Free',
  'buy-x-pay-y': 'Buy X Pay for Y',
  'percentage-plus-coupon': 'Percentage + fixed coupon',
};

export function createDefaultInput(): CyberMondayInput {
  return {
    currency: 'USD',
    dealType: 'percentage',
    originalPrice: '',
    quantity: '1',
    discountPercentage: '',
    fixedDiscount: '',
    secondDiscountPercentage: '',
    thirdDiscountPercentage: '',
    couponAmount: '',
    couponOrder: 'percent-then-fixed',
    secondItemDiscountPercentage: '50',
    buyQuantity: '2',
    freeQuantity: '1',
    payQuantity: '2',
    taxIncluded: false,
    applySalesTax: false,
    salesTaxRate: '',
    shippingCost: '0',
    useFreeShippingThreshold: false,
    freeShippingThreshold: '',
    compareBlackFriday: false,
    blackFridayCheckoutTotal: '',
  };
}

export function createEmptyInput(): CyberMondayInput {
  return createDefaultInput();
}

/** Reference: $200 · 25% · qty 1 · ship $10 · tax 8% → merchandise $150 · final $172 */
export function createExampleInput(): CyberMondayInput {
  return {
    currency: 'USD',
    dealType: 'percentage',
    originalPrice: '200',
    quantity: '1',
    discountPercentage: '25',
    fixedDiscount: '',
    secondDiscountPercentage: '',
    thirdDiscountPercentage: '',
    couponAmount: '',
    couponOrder: 'percent-then-fixed',
    secondItemDiscountPercentage: '50',
    buyQuantity: '2',
    freeQuantity: '1',
    payQuantity: '2',
    taxIncluded: false,
    applySalesTax: true,
    salesTaxRate: '8',
    shippingCost: '10',
    useFreeShippingThreshold: false,
    freeShippingThreshold: '75',
    compareBlackFriday: false,
    blackFridayCheckoutTotal: '',
  };
}
