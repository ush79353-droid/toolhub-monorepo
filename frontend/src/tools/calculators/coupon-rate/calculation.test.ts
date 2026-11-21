import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateCouponRate } from './calculation';
import { collectFieldErrors, validateCouponRateInput } from './validation';
import {
  createEmptyInput,
  createExampleInput,
  type CouponRateInput,
} from './types';

function base(overrides: Partial<CouponRateInput> = {}): CouponRateInput {
  return { ...createExampleInput(), ...overrides };
}

describe('coupon rate', () => {
  it('Test 1: semi $25 on $1000 → 5%', () => {
    const r = calculateCouponRate(createExampleInput());
    assert.ok(r);
    assert.equal(r.paymentsPerYear, 2);
    assert.equal(r.annualCoupon, 50);
    assert.equal(r.couponRatePercent, 5);
  });

  it('Test 2: annual $60 on $1000 → 6%', () => {
    const r = calculateCouponRate(
      base({
        frequency: 'annually',
        couponPerPeriod: '60',
        faceValue: '1000',
      })
    );
    assert.ok(r);
    assert.equal(r.annualCoupon, 60);
    assert.equal(r.couponRatePercent, 6);
  });

  it('Test 3: quarterly $20 on $2000 → 4%', () => {
    const r = calculateCouponRate(
      base({
        faceValue: '2000',
        couponPerPeriod: '20',
        frequency: 'quarterly',
      })
    );
    assert.ok(r);
    assert.equal(r.annualCoupon, 80);
    assert.equal(r.couponRatePercent, 4);
  });

  it('Test 4: monthly $5 on $1000 → 6%', () => {
    const r = calculateCouponRate(
      base({
        faceValue: '1000',
        couponPerPeriod: '5',
        frequency: 'monthly',
      })
    );
    assert.ok(r);
    assert.equal(r.annualCoupon, 60);
    assert.equal(r.couponRatePercent, 6);
  });

  it('zero-coupon → 0%', () => {
    const r = calculateCouponRate(
      base({ couponPerPeriod: '0', faceValue: '1000' })
    );
    assert.ok(r);
    assert.equal(r.annualCoupon, 0);
    assert.equal(r.couponRatePercent, 0);
    assert.equal(r.isZeroCoupon, true);
  });

  it('rejects zero / negative face', () => {
    assert.ok(collectFieldErrors(base({ faceValue: '0' })).faceValue);
    assert.ok(collectFieldErrors(base({ faceValue: '-1' })).faceValue);
    assert.equal(calculateCouponRate(base({ faceValue: '0' })), null);
  });

  it('rejects negative coupon per period', () => {
    assert.ok(
      collectFieldErrors(base({ couponPerPeriod: '-5' })).couponPerPeriod
    );
  });

  it('reverse: coupon per period from rate', () => {
    const r = calculateCouponRate(
      base({
        solveTarget: 'couponPerPeriod',
        faceValue: '1000',
        couponRatePercent: '5',
        frequency: 'semiannually',
        couponPerPeriod: '',
      })
    );
    assert.ok(r);
    assert.equal(r.annualCoupon, 50);
    assert.equal(r.couponPerPeriod, 25);
  });

  it('reverse: face from annual and rate', () => {
    const r = calculateCouponRate(
      base({
        solveTarget: 'faceValue',
        annualCoupon: '50',
        couponRatePercent: '5',
        faceValue: '',
        couponPerPeriod: '',
      })
    );
    assert.ok(r);
    assert.equal(r.faceValue, 1000);
  });

  it('reverse: annual from face and rate', () => {
    const r = calculateCouponRate(
      base({
        solveTarget: 'annualCoupon',
        faceValue: '1000',
        couponRatePercent: '6',
        frequency: 'annually',
      })
    );
    assert.ok(r);
    assert.equal(r.annualCoupon, 60);
  });

  it('clear helpers + validation', () => {
    assert.equal(createEmptyInput().faceValue, '');
    const v = validateCouponRateInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
  });

  it('never Infinity on bad face', () => {
    assert.equal(
      calculateCouponRate(base({ faceValue: '0', couponPerPeriod: '10' })),
      null
    );
  });
});
