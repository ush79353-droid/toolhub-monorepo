import type { SupportedCurrency } from '@/tools/shared/currency';

export interface CouponPaymentInput {
  faceValue: string;
  /** Currency of face value / market price (calculation currency). */
  faceValueCurrency: SupportedCurrency;
  annualCouponRatePercent: string;
  paymentsPerAnnum: string;
  /** Independent display currency for coupon payment. */
  couponPaymentCurrency: SupportedCurrency;
  /** Optional current-yield section: bond market price in face-value currency. */
  marketPrice: string;
  currentYieldOpen: boolean;
}

export interface CouponPaymentResult {
  /** Full-precision annual coupon in face-value currency. */
  annualCoupon: number;
  /** Full-precision periodic coupon payment in face-value currency. */
  couponPaymentInFaceCurrency: number;
  /** Full-precision coupon payment in result currency. */
  couponPayment: number;
  faceValueCurrency: SupportedCurrency;
  couponPaymentCurrency: SupportedCurrency;
  formattedCouponPayment: string;
  /** Present only when market price is valid and positive. */
  currentYieldPercent: number | null;
  formattedCurrentYieldPercent: string | null;
}

export type CouponPaymentFieldErrors = {
  faceValue?: string;
  annualCouponRatePercent?: string;
  paymentsPerAnnum?: string;
  marketPrice?: string;
  form?: string;
};

export function createDefaultInput(): CouponPaymentInput {
  return {
    faceValue: '1000',
    faceValueCurrency: 'PKR',
    annualCouponRatePercent: '5',
    paymentsPerAnnum: '2',
    couponPaymentCurrency: 'PKR',
    marketPrice: '',
    currentYieldOpen: false,
  };
}
