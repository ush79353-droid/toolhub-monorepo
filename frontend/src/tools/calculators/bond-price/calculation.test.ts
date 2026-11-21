/**
 * Runnable self-check (node:assert). Not a CI/Playwright suite.
 * Run: npx tsx src/tools/calculators/bond-price/calculation.test.ts
 */
import assert from 'node:assert/strict';
import { calculateBondPrice } from './calculation';
import { validateBondPriceInput } from './validation';
import { createDefaultInput } from './types';

function nearlyEqual(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

// Par bond: F=1000, r=5%, annual, 10y, y=5% → price = 1000
{
  const r = calculateBondPrice({
    faceValue: 1000,
    annualCouponRatePercent: 5,
    couponFrequency: 'annually',
    yearsToMaturity: 10,
    yieldToMaturityPercent: 5,
  });
  assert.ok(r);
  assert.ok(nearlyEqual(r.annualCoupon, 50));
  assert.ok(nearlyEqual(r.couponPerPeriod, 50));
  assert.ok(nearlyEqual(r.bondPrice, 1000, 1e-6));
  assert.equal(r.totalPeriods, 10);
}

// Semi-annual coupon: F=1000, r=6%, m=2, 5y, y=6% → par
{
  const r = calculateBondPrice({
    faceValue: 1000,
    annualCouponRatePercent: 6,
    couponFrequency: 'semiannually',
    yearsToMaturity: 5,
    yieldToMaturityPercent: 6,
  });
  assert.ok(r);
  assert.ok(nearlyEqual(r.annualCoupon, 60));
  assert.ok(nearlyEqual(r.couponPerPeriod, 30));
  assert.equal(r.totalPeriods, 10);
  assert.ok(nearlyEqual(r.bondPrice, 1000, 1e-6));
}

// Zero coupon rate: discount face only
{
  const r = calculateBondPrice({
    faceValue: 1000,
    annualCouponRatePercent: 0,
    couponFrequency: 'annually',
    yearsToMaturity: 2,
    yieldToMaturityPercent: 10,
  });
  assert.ok(r);
  assert.equal(r.annualCoupon, 0);
  assert.equal(r.couponPerPeriod, 0);
  assert.ok(nearlyEqual(r.bondPrice, 1000 / Math.pow(1.1, 2), 1e-9));
}

// Zero YTM: undiscounted cash flows
{
  const r = calculateBondPrice({
    faceValue: 1000,
    annualCouponRatePercent: 5,
    couponFrequency: 'annually',
    yearsToMaturity: 3,
    yieldToMaturityPercent: 0,
  });
  assert.ok(r);
  assert.ok(nearlyEqual(r.bondPrice, 50 * 3 + 1000));
}

// Premium: coupon > YTM
{
  const r = calculateBondPrice({
    faceValue: 1000,
    annualCouponRatePercent: 8,
    couponFrequency: 'annually',
    yearsToMaturity: 5,
    yieldToMaturityPercent: 5,
  });
  assert.ok(r);
  assert.ok(r.bondPrice > 1000);
}

// Discount: coupon < YTM
{
  const r = calculateBondPrice({
    faceValue: 1000,
    annualCouponRatePercent: 3,
    couponFrequency: 'annually',
    yearsToMaturity: 5,
    yieldToMaturityPercent: 5,
  });
  assert.ok(r);
  assert.ok(r.bondPrice < 1000);
}

// Fractional periods rejected
{
  const r = calculateBondPrice({
    faceValue: 1000,
    annualCouponRatePercent: 5,
    couponFrequency: 'semiannually',
    yearsToMaturity: 1.25,
    yieldToMaturityPercent: 5,
  });
  assert.equal(r, null);
}

// Invalid face / maturity
{
  assert.equal(
    calculateBondPrice({
      faceValue: 0,
      annualCouponRatePercent: 5,
      couponFrequency: 'annually',
      yearsToMaturity: 10,
      yieldToMaturityPercent: 5,
    }),
    null
  );
  assert.equal(
    calculateBondPrice({
      faceValue: 1000,
      annualCouponRatePercent: 5,
      couponFrequency: 'annually',
      yearsToMaturity: 0,
      yieldToMaturityPercent: 5,
    }),
    null
  );
}

// Default input validates
{
  const v = validateBondPriceInput(createDefaultInput(), null);
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  assert.ok(nearlyEqual(v.result.bondPrice, 1000, 1e-6));
}

console.log('bond-price calculation.test.ts: all assertions passed');
