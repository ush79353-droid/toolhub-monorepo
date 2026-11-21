import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  COUPON_FREQUENCY_OPTIONS,
  type CouponFrequency,
} from './types';

export function formatBondMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Display convexity with up to 8 decimals; trim trailing zeros. */
export function formatConvexity(value: number): string {
  if (!Number.isFinite(value)) return '—';
  const rounded = Math.round(value * 1e8) / 1e8;
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  const text = rounded.toFixed(8);
  return text.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
}

export function paymentsPerYear(frequency: CouponFrequency): number {
  return (
    COUPON_FREQUENCY_OPTIONS.find((o) => o.value === frequency)?.paymentsPerYear ??
    1
  );
}

/**
 * Coupon per period = Face × Annual Coupon Rate / Payments Per Year.
 * Annual coupon = Face × Annual Coupon Rate.
 * Rate is a percent (5 → 0.05).
 */
export function calculateCoupons(input: {
  faceValue: number;
  annualCouponRatePercent: number;
  paymentsPerYear: number;
}): { couponPerPeriod: number; annualCoupon: number } | null {
  const { faceValue, annualCouponRatePercent, paymentsPerYear: m } = input;
  if (![faceValue, annualCouponRatePercent, m].every(Number.isFinite)) return null;
  if (!(faceValue > 0) || !(m > 0)) return null;
  if (annualCouponRatePercent < 0) return null;

  const annualCoupon = faceValue * (annualCouponRatePercent / 100);
  const couponPerPeriod = annualCoupon / m;
  if (![annualCoupon, couponPerPeriod].every(Number.isFinite)) return null;
  return { couponPerPeriod, annualCoupon };
}

/**
 * Flat bond price = PV of coupons + PV of face.
 * Periodic yield r = annualYtm / m (nominal, coupon-frequency compounded).
 * n = years × m (may be fractional).
 * When r = 0: P = C × n + F.
 * Requires 1 + r > 0 so discounting is defined.
 */
export function calculateBondPrice(input: {
  faceValue: number;
  couponPerPeriod: number;
  yearsToMaturity: number;
  annualYtmDecimal: number;
  paymentsPerYear: number;
}): number | null {
  const {
    faceValue,
    couponPerPeriod,
    yearsToMaturity,
    annualYtmDecimal,
    paymentsPerYear: m,
  } = input;

  if (
    ![faceValue, couponPerPeriod, yearsToMaturity, annualYtmDecimal, m].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (!(faceValue > 0) || !(m > 0) || !(yearsToMaturity > 0)) return null;
  if (couponPerPeriod < 0) return null;

  const n = yearsToMaturity * m;
  if (!(n > 0) || !Number.isFinite(n)) return null;

  const r = annualYtmDecimal / m;
  if (!Number.isFinite(r) || !(1 + r > 0)) return null;

  let price: number;
  if (r === 0) {
    price = couponPerPeriod * n + faceValue;
  } else {
    const discount = Math.pow(1 + r, -n);
    if (!Number.isFinite(discount)) return null;
    const annuity = (1 - discount) / r;
    price = couponPerPeriod * annuity + faceValue * discount;
  }

  return Number.isFinite(price) ? price : null;
}

/**
 * Finite-difference (effective) convexity in annual-yield units:
 * Conv = (P₋ + P₊ − 2P₀) / (P₀ (Δy)²)
 * where annual yields are shifted by ±Δy (decimal). Not analytic Macaulay convexity.
 */
export function calculateFiniteDifferenceConvexity(input: {
  priceDown: number;
  priceUp: number;
  priceBase: number;
  yieldDifferentialDecimal: number;
}): number | null {
  const { priceDown, priceUp, priceBase, yieldDifferentialDecimal: dy } = input;
  if (![priceDown, priceUp, priceBase, dy].every(Number.isFinite)) return null;
  if (!(priceBase > 0) || !(dy > 0)) return null;

  const numerator = priceDown + priceUp - 2 * priceBase;
  const denominator = priceBase * dy * dy;
  if (!(denominator > 0) || !Number.isFinite(denominator)) return null;

  const convexity = numerator / denominator;
  return Number.isFinite(convexity) ? convexity : null;
}

/**
 * Full bond convexity pipeline in face-value currency at full precision.
 * FX belongs in validation.
 */
export function calculateBondConvexity(input: {
  faceValue: number;
  annualCouponRatePercent: number;
  couponFrequency: CouponFrequency;
  yearsToMaturity: number;
  yieldToMaturityPercent: number;
  yieldDifferentialPercent: number;
}): {
  paymentsPerYear: number;
  couponPerPeriod: number;
  annualCoupon: number;
  bondPrice: number;
  bondConvexity: number;
} | null {
  const m = paymentsPerYear(input.couponFrequency);
  const coupons = calculateCoupons({
    faceValue: input.faceValue,
    annualCouponRatePercent: input.annualCouponRatePercent,
    paymentsPerYear: m,
  });
  if (!coupons) return null;

  const ytm = input.yieldToMaturityPercent / 100;
  const dy = input.yieldDifferentialPercent / 100;
  if (!(dy > 0)) return null;

  const priceAt = (annualYtmDecimal: number) =>
    calculateBondPrice({
      faceValue: input.faceValue,
      couponPerPeriod: coupons.couponPerPeriod,
      yearsToMaturity: input.yearsToMaturity,
      annualYtmDecimal,
      paymentsPerYear: m,
    });

  const p0 = priceAt(ytm);
  const pDown = priceAt(ytm - dy);
  const pUp = priceAt(ytm + dy);
  if (p0 === null || pDown === null || pUp === null) return null;

  const convexity = calculateFiniteDifferenceConvexity({
    priceDown: pDown,
    priceUp: pUp,
    priceBase: p0,
    yieldDifferentialDecimal: dy,
  });
  if (convexity === null) return null;

  return {
    paymentsPerYear: m,
    couponPerPeriod: coupons.couponPerPeriod,
    annualCoupon: coupons.annualCoupon,
    bondPrice: p0,
    bondConvexity: convexity,
  };
}
