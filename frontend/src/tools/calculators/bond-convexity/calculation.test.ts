/**
 * Lightweight formula self-check for Bond Convexity Calculator.
 * Not run by the delivery prompt (no automated test suite requested).
 */
import assert from 'node:assert/strict';
import {
  calculateBondConvexity,
  calculateBondPrice,
  calculateCoupons,
  calculateFiniteDifferenceConvexity,
} from './calculation';

const coupons = calculateCoupons({
  faceValue: 1000,
  annualCouponRatePercent: 5,
  paymentsPerYear: 1,
});
assert.ok(coupons);
assert.equal(coupons.annualCoupon, 50);
assert.equal(coupons.couponPerPeriod, 50);

const zeroCoupons = calculateCoupons({
  faceValue: 1000,
  annualCouponRatePercent: 0,
  paymentsPerYear: 2,
});
assert.ok(zeroCoupons);
assert.equal(zeroCoupons.annualCoupon, 0);
assert.equal(zeroCoupons.couponPerPeriod, 0);

const par = calculateBondPrice({
  faceValue: 1000,
  couponPerPeriod: 50,
  yearsToMaturity: 10,
  annualYtmDecimal: 0.05,
  paymentsPerYear: 1,
});
assert.ok(par !== null);
assert.ok(Math.abs(par! - 1000) < 1e-9);

const zeroRatePrice = calculateBondPrice({
  faceValue: 1000,
  couponPerPeriod: 50,
  yearsToMaturity: 10,
  annualYtmDecimal: 0,
  paymentsPerYear: 1,
});
assert.equal(zeroRatePrice, 1500);

assert.equal(
  calculateBondPrice({
    faceValue: 1000,
    couponPerPeriod: 50,
    yearsToMaturity: 10,
    annualYtmDecimal: -1.5,
    paymentsPerYear: 1,
  }),
  null
);

assert.equal(
  calculateFiniteDifferenceConvexity({
    priceDown: 1001,
    priceUp: 999,
    priceBase: 1000,
    yieldDifferentialDecimal: 0,
  }),
  null
);

const full = calculateBondConvexity({
  faceValue: 1000,
  annualCouponRatePercent: 5,
  couponFrequency: 'annually',
  yearsToMaturity: 10,
  yieldToMaturityPercent: 5,
  yieldDifferentialPercent: 0.01,
});
assert.ok(full);
assert.equal(full.couponPerPeriod, 50);
assert.equal(full.annualCoupon, 50);
assert.ok(Math.abs(full.bondPrice - 1000) < 1e-8);
assert.ok(full.bondConvexity > 0);

const semi = calculateBondConvexity({
  faceValue: 1000,
  annualCouponRatePercent: 6,
  couponFrequency: 'semiannually',
  yearsToMaturity: 5,
  yieldToMaturityPercent: 6,
  yieldDifferentialPercent: 0.01,
});
assert.ok(semi);
assert.equal(semi.couponPerPeriod, 30);
assert.equal(semi.paymentsPerYear, 2);
assert.ok(Math.abs(semi.bondPrice - 1000) < 1e-8);

assert.equal(
  calculateBondConvexity({
    faceValue: 1000,
    annualCouponRatePercent: 5,
    couponFrequency: 'annually',
    yearsToMaturity: 10,
    yieldToMaturityPercent: 5,
    yieldDifferentialPercent: 0,
  }),
  null
);

console.log('bond-convexity calculation.self-check: ok');
