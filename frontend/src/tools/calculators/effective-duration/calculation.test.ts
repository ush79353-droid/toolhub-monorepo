import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateBondPrice,
  calculateEffectiveDuration,
  calculateEffectiveDurationFromInput,
} from './calculation';
import { createExampleInput, type EffectiveDurationInput } from './types';
import { validateEffectiveDurationInput } from './validation';

function base(
  patch: Partial<EffectiveDurationInput> = {},
): EffectiveDurationInput {
  return { ...createExampleInput(), ...patch };
}

describe('effective duration coupons', () => {
  it('Test 1: annual coupon $800', () => {
    const r = calculateEffectiveDurationFromInput(createExampleInput());
    assert.ok(r);
    assert.equal(r.annualCoupon, 800);
    assert.equal(r.couponPerPeriod, 800);
  });

  it('Test 2: semiannual coupon $400/period', () => {
    const r = calculateEffectiveDurationFromInput(
      base({ frequency: 'semiannually', yearsToMaturity: '3' }),
    );
    assert.ok(r);
    assert.equal(r.couponPerPeriod, 400);
    assert.equal(r.annualCoupon, 800);
  });
});

describe('effective duration bond pricing', () => {
  it('Test 3: par bond at 8% / 8% / 3y = $10,000', () => {
    const p = calculateBondPrice(10_000, 0.08, 0.08, 3, 1);
    assert.ok(p);
    assert.ok(Math.abs(p - 10_000) < 1e-6);
  });

  it('Test 4: yield up to 9% ≈ $9,746.87', () => {
    const p = calculateBondPrice(10_000, 0.08, 0.09, 3, 1);
    assert.ok(p);
    assert.ok(Math.abs(p - 9746.869) < 0.02);
  });

  it('Test 5: yield down to 7% ≈ $10,262.43', () => {
    const p = calculateBondPrice(10_000, 0.08, 0.07, 3, 1);
    assert.ok(p);
    assert.ok(Math.abs(p - 10262.43) < 0.02);
  });

  it('Test 6: duration ≈ 2.58 years', () => {
    const r = calculateEffectiveDurationFromInput(createExampleInput());
    assert.ok(r);
    assert.ok(Math.abs(r.effectiveDuration - 2.578) < 0.02);
    assert.ok(Math.abs(r.basePrice - 10_000) < 1e-6);
  });

  it('Test 7: zero-coupon bond prices correctly', () => {
    const p = calculateBondPrice(10_000, 0, 0.08, 3, 1);
    assert.ok(p);
    const expected = 10_000 / Math.pow(1.08, 3);
    assert.ok(Math.abs(p - expected) < 1e-6);
  });
});

describe('effective duration validation & scenario', () => {
  it('Test 8: zero yield differential rejected', () => {
    const v = validateEffectiveDurationInput(
      base({ yieldDifferentialPercent: '0' }),
    );
    assert.equal(v.isValid, false);
    assert.match(v.errors.yieldDifferentialPercent ?? '', /greater than zero/i);
  });

  it('Test 9: negative face value rejected', () => {
    const v = validateEffectiveDurationInput(base({ faceValue: '-1000' }));
    assert.equal(v.isValid, false);
  });

  it('Test 10: scenario mode → 5 years', () => {
    assert.equal(calculateEffectiveDuration(1050, 950, 1000, 0.01), 5);
    const r = calculateEffectiveDurationFromInput(
      base({
        mode: 'scenario',
        basePrice: '1000',
        priceYieldDown: '1050',
        priceYieldUp: '950',
        yieldDifferentialPercent: '1',
      }),
    );
    assert.ok(r);
    assert.equal(r.effectiveDuration, 5);
  });

  it('rejects non-integer coupon periods without silent rounding', () => {
    const v = validateEffectiveDurationInput(
      base({ yearsToMaturity: '2.5', frequency: 'annually' }),
    );
    assert.equal(v.isValid, false);
    assert.match(v.errors.yearsToMaturity ?? '', /whole number/i);
  });
});
