import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateBondPriceFromYtm,
  calculateYTM,
  calculateYieldToMaturityFromInput,
  formatPercent,
} from './calculation';
import { createExampleInput, type YieldToMaturityInput } from './types';
import { validateYieldToMaturityInput } from './validation';

function base(
  patch: Partial<YieldToMaturityInput> = {},
): YieldToMaturityInput {
  return { ...createExampleInput(), ...patch };
}

describe('yield to maturity', () => {
  it('Test 1: discount bond ≈ 5.67%', () => {
    const calc = calculateYTM({
      faceValue: 1000,
      bondPrice: 950,
      annualCouponRate: 5,
      couponFrequency: 1,
      yearsToMaturity: 10,
    });
    assert.ok(calc);
    assert.ok(Math.abs(calc.yieldToMaturityPercent - 5.67) < 0.01);
    assert.equal(formatPercent(calc.yieldToMaturityPercent), '5.67%');
    const r = calculateYieldToMaturityFromInput(createExampleInput());
    assert.ok(r);
    assert.equal(r.relation, 'discount');
  });

  it('Test 2: par bond YTM = coupon', () => {
    const calc = calculateYTM({
      faceValue: 1000,
      bondPrice: 1000,
      annualCouponRate: 5,
      couponFrequency: 1,
      yearsToMaturity: 10,
    });
    assert.ok(calc);
    assert.ok(Math.abs(calc.yieldToMaturityPercent - 5) < 1e-8);
  });

  it('Test 3: premium bond YTM < coupon', () => {
    const calc = calculateYTM({
      faceValue: 1000,
      bondPrice: 1050,
      annualCouponRate: 5,
      couponFrequency: 1,
      yearsToMaturity: 10,
    });
    assert.ok(calc);
    assert.ok(calc.yieldToMaturityPercent < 5);
  });

  it('Test 4: zero-coupon ≈ 2.13%', () => {
    const calc = calculateYTM({
      faceValue: 1000,
      bondPrice: 900,
      annualCouponRate: 0,
      couponFrequency: 1,
      yearsToMaturity: 5,
    });
    assert.ok(calc);
    const expected = (Math.pow(1000 / 900, 1 / 5) - 1) * 100;
    assert.ok(Math.abs(calc.yieldToMaturityPercent - expected) < 1e-10);
    assert.ok(Math.abs(calc.yieldToMaturityPercent - 2.13) < 0.01);
  });

  it('Test 5: semiannual par → 6% nominal', () => {
    const calc = calculateYTM({
      faceValue: 1000,
      bondPrice: 1000,
      annualCouponRate: 6,
      couponFrequency: 2,
      yearsToMaturity: 10,
    });
    assert.ok(calc);
    assert.ok(Math.abs(calc.yieldToMaturityPercent - 6) < 1e-8);
  });

  it('Test 6: zero years rejected', () => {
    const v = validateYieldToMaturityInput(base({ yearsToMaturity: '0' }));
    assert.equal(v.isValid, false);
  });

  it('Test 7: zero bond price rejected', () => {
    const v = validateYieldToMaturityInput(base({ bondPrice: '0' }));
    assert.equal(v.isValid, false);
  });

  it('Test 8: negative bond price rejected', () => {
    const v = validateYieldToMaturityInput(base({ bondPrice: '-100' }));
    assert.equal(v.isValid, false);
  });

  it('Test 9: fractional periods rejected', () => {
    const v = validateYieldToMaturityInput(
      base({ yearsToMaturity: '10.5', couponFrequency: 1 }),
    );
    assert.equal(v.isValid, false);
    assert.match(v.errors.yearsToMaturity ?? '', /whole number/i);
  });

  it('Test 10: reverse bond price round-trip', () => {
    const ytm = 5.5;
    const price = calculateBondPriceFromYtm({
      faceValue: 1000,
      annualCouponRatePercent: 5,
      couponFrequency: 1,
      yearsToMaturity: 10,
      yieldToMaturityPercent: ytm,
    });
    assert.ok(price);
    const recovered = calculateYTM({
      faceValue: 1000,
      bondPrice: price,
      annualCouponRate: 5,
      couponFrequency: 1,
      yearsToMaturity: 10,
    });
    assert.ok(recovered);
    assert.ok(Math.abs(recovered.yieldToMaturityPercent - ytm) < 1e-6);
  });

  it('supports negative YTM for high premium', () => {
    const calc = calculateYTM({
      faceValue: 1000,
      bondPrice: 1200,
      annualCouponRate: 1,
      couponFrequency: 1,
      yearsToMaturity: 2,
    });
    assert.ok(calc);
    assert.ok(calc.yieldToMaturityPercent < 0);
  });
});
