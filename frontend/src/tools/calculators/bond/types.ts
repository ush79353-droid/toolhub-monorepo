export type CouponFrequency = 'annually' | 'semiannually' | 'quarterly' | 'monthly';

export type CouponMode = 'percent' | 'amount';

/** Blankable fields that can be solved for. Frequency is always provided. */
export type BondSolveTarget =
  | 'price'
  | 'faceValue'
  | 'yield'
  | 'timeToMaturity'
  | 'annualCoupon';

export interface BondInput {
  price: string;
  faceValue: string;
  yieldPercent: string;
  timeToMaturityYears: string;
  annualCoupon: string;
  couponMode: CouponMode;
  couponFrequency: CouponFrequency;
}

export interface BondResult {
  solvedField: BondSolveTarget;
  price: number;
  faceValue: number;
  yieldPercent: number;
  timeToMaturityYears: number;
  /** Annual coupon as entered mode: percent of face or dollar amount. */
  annualCoupon: number;
  couponMode: CouponMode;
  couponFrequency: CouponFrequency;
  periodsPerYear: number;
  totalPeriods: number;
  couponPerPeriod: number;
  formattedPrice: string;
  formattedFaceValue: string;
  formattedYieldPercent: string;
  formattedTimeToMaturityYears: string;
  formattedAnnualCoupon: string;
  /** e.g. "Given the face value, yield, time to maturity, and annual coupon, the price is:" */
  summaryLead: string;
  /** Bolded answer fragment, e.g. "$97.3270" */
  summaryValue: string;
  summaryText: string;
}

export type BondFieldErrors = {
  price?: string;
  faceValue?: string;
  yieldPercent?: string;
  timeToMaturityYears?: string;
  annualCoupon?: string;
  form?: string;
};

/**
 * Screenshot defaults: blank price (solve for price), face $100, yield 6%,
 * maturity 3 years, annual coupon 5%, annually.
 */
export function createDefaultInput(): BondInput {
  return {
    price: '',
    faceValue: '100',
    yieldPercent: '6',
    timeToMaturityYears: '3',
    annualCoupon: '5',
    couponMode: 'percent',
    couponFrequency: 'annually',
  };
}
