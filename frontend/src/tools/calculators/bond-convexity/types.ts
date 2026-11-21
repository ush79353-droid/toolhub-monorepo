import type { SupportedCurrency } from '@/tools/shared/currency';

export type CouponFrequency = 'annually' | 'semiannually' | 'quarterly' | 'monthly';

export const COUPON_FREQUENCY_OPTIONS: readonly {
  value: CouponFrequency;
  label: string;
  paymentsPerYear: number;
}[] = [
  { value: 'annually', label: 'Annually', paymentsPerYear: 1 },
  { value: 'semiannually', label: 'Semiannually', paymentsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', paymentsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', paymentsPerYear: 12 },
] as const;

export interface BondConvexityInput {
  faceValue: string;
  /** Currency of face value (canonical calculation currency). */
  faceValueCurrency: SupportedCurrency;
  annualCouponRatePercent: string;
  couponFrequency: CouponFrequency;
  /** Independent display currency for coupon per period. */
  couponPerPeriodCurrency: SupportedCurrency;
  /** Independent display currency for annual coupon. */
  annualCouponCurrency: SupportedCurrency;
  yearsToMaturity: string;
  yieldToMaturityPercent: string;
  /** Independent display currency for bond price. */
  bondPriceCurrency: SupportedCurrency;
  yieldDifferentialPercent: string;
  couponSectionOpen: boolean;
  priceSectionOpen: boolean;
  convexitySectionOpen: boolean;
}

export interface BondConvexityResult {
  paymentsPerYear: number;
  /** Full-precision coupon per period in face-value currency. */
  couponPerPeriodInFace: number;
  /** Full-precision coupon per period in display currency. */
  couponPerPeriod: number;
  /** Full-precision annual coupon in face-value currency. */
  annualCouponInFace: number;
  /** Full-precision annual coupon in display currency. */
  annualCoupon: number;
  /** Full-precision dirty/clean flat price at YTM in face-value currency. */
  bondPriceInFace: number;
  /** Full-precision bond price in display currency. */
  bondPrice: number;
  /**
   * Finite-difference (effective) convexity in annual-yield units:
   * (P₋ + P₊ − 2P₀) / (P₀ (Δy)²). Not analytic Macaulay convexity.
   */
  bondConvexity: number;
  faceValueCurrency: SupportedCurrency;
  couponPerPeriodCurrency: SupportedCurrency;
  annualCouponCurrency: SupportedCurrency;
  bondPriceCurrency: SupportedCurrency;
  formattedCouponPerPeriod: string;
  formattedAnnualCoupon: string;
  formattedBondPrice: string;
  formattedBondConvexity: string;
}

export type BondConvexityFieldErrors = {
  faceValue?: string;
  annualCouponRatePercent?: string;
  couponFrequency?: string;
  yearsToMaturity?: string;
  yieldToMaturityPercent?: string;
  yieldDifferentialPercent?: string;
  form?: string;
};

export function createDefaultInput(): BondConvexityInput {
  return {
    faceValue: '1000',
    faceValueCurrency: 'PKR',
    annualCouponRatePercent: '5',
    couponFrequency: 'annually',
    couponPerPeriodCurrency: 'PKR',
    annualCouponCurrency: 'PKR',
    yearsToMaturity: '10',
    yieldToMaturityPercent: '5',
    bondPriceCurrency: 'PKR',
    yieldDifferentialPercent: '0.01',
    couponSectionOpen: true,
    priceSectionOpen: true,
    convexitySectionOpen: true,
  };
}
