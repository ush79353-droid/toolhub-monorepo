import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateBOGO,
  calculateBuyXGetYFree,
  calculateCyberMondayFromInput,
  calculateDoubleDiscount,
  calculateEffectiveDiscount,
  calculateFinalCheckout,
  calculateFixedDiscount,
  calculatePercentageDiscount,
  calculateSalesTax,
  calculateTripleDiscount,
  getCyberMondayDate,
} from './calculation';
import { createExampleInput, type CyberMondayInput } from './types';
import { validateCyberMondayInput } from './validation';

function base(patch: Partial<CyberMondayInput> = {}): CyberMondayInput {
  return { ...createExampleInput(), ...patch };
}

describe('cyber monday calculator', () => {
  it('Test 1: 25% of $200 → $150', () => {
    assert.equal(calculatePercentageDiscount(200, 25), 150);
    const r = calculateCyberMondayFromInput(
      base({
        applySalesTax: false,
        shippingCost: '0',
        discountPercentage: '25',
      }),
    );
    assert.ok(r);
    assert.equal(r.discountedSubtotal, 150);
    assert.equal(r.merchandiseSavings, 50);
  });

  it('Test 2: fixed $30 off $150 → $120', () => {
    assert.equal(calculateFixedDiscount(150, 30), 120);
  });

  it('Test 3: double 20% then 10% on $200 → $144', () => {
    assert.equal(calculateDoubleDiscount(200, 20, 10), 144);
  });

  it('Test 4: triple 20/10/5 on $300 → $205.20', () => {
    assert.ok(Math.abs((calculateTripleDiscount(300, 20, 10, 5) ?? 0) - 205.2) < 1e-9);
  });

  it('Test 5: BOGO $40 × 4 → $80', () => {
    assert.equal(calculateBOGO(40, 4), 80);
  });

  it('Test 6: Buy 2 Get 1 Free $30 × 6 → $120', () => {
    assert.equal(calculateBuyXGetYFree(30, 6, 2, 1), 120);
  });

  it('Test 7: tax 8% on $150 → $12', () => {
    assert.equal(calculateSalesTax(150, 8), 12);
  });

  it('Test 8: checkout $150 + $12 + $10 → $172', () => {
    assert.equal(calculateFinalCheckout(150, 12, 10), 172);
    const r = calculateCyberMondayFromInput(createExampleInput());
    assert.ok(r);
    assert.equal(r.discountedSubtotal, 150);
    assert.equal(r.taxAmount, 12);
    assert.equal(r.shippingCost, 10);
    assert.equal(r.finalCheckoutAmount, 172);
  });

  it('Test 9: effective discount 28%', () => {
    assert.ok(
      Math.abs((calculateEffectiveDiscount(200, 144) ?? 0) - 28) < 1e-9,
    );
  });

  it('Test 10: zero discount leaves price', () => {
    assert.equal(calculatePercentageDiscount(200, 0), 200);
  });

  it('Test 11: 120% discount rejected', () => {
    const v = validateCyberMondayInput(base({ discountPercentage: '120' }));
    assert.equal(v.isValid, false);
  });

  it('Test 12: negative price rejected', () => {
    const v = validateCyberMondayInput(base({ originalPrice: '-10' }));
    assert.equal(v.isValid, false);
  });

  it('Test 13: odd BOGO qty 3 → pay 2 → $80', () => {
    assert.equal(calculateBOGO(40, 3), 80);
  });

  it('Test 14: coupon clamps to zero merchandise', () => {
    const r = calculateCyberMondayFromInput(
      base({
        dealType: 'percentage-plus-coupon',
        originalPrice: '50',
        discountPercentage: '10',
        couponAmount: '100',
        applySalesTax: false,
        shippingCost: '0',
      }),
    );
    assert.ok(r);
    assert.equal(r.discountedSubtotal, 0);
  });

  it('Test 15: tax included does not double-add tax', () => {
    const r = calculateCyberMondayFromInput(
      base({
        originalPrice: '108',
        discountPercentage: '0',
        taxIncluded: true,
        applySalesTax: true,
        salesTaxRate: '8',
        shippingCost: '0',
      }),
    );
    assert.ok(r);
    assert.ok(Math.abs(r.taxAmount - 8) < 0.01);
    assert.equal(r.finalCheckoutAmount, 108);
  });

  it('Cyber Monday 2026 is Nov 30', () => {
    const cm = getCyberMondayDate(2026);
    assert.equal(cm.isoDate, '2026-11-30');
  });
});
