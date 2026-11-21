import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  applySuccessivePercentDiscounts,
  calculateBlackFridayDiscount,
  calculateBlackFridayFromInput,
  getBlackFridayDate,
  reverseOriginalFromDiscounted,
} from './calculation';
import { createExampleInput, type BlackFridayInput } from './types';
import { validateBlackFridayInput } from './validation';

function base(patch: Partial<BlackFridayInput> = {}): BlackFridayInput {
  return { ...createExampleInput(), ...patch };
}

describe('black friday calculator', () => {
  it('Test 1: basic 20% off $100 → $80', () => {
    const calc = calculateBlackFridayDiscount({
      originalPrice: 100,
      discountPercentage: 20,
      applySalesTax: false,
      salesTaxRate: 0,
    });
    assert.ok(calc);
    assert.equal(calc.finalPrice, 80);
    assert.equal(calc.discountAmount, 20);
  });

  it('Test 2: $200 · 35% · 8% tax → $140.40', () => {
    const calc = calculateBlackFridayDiscount({
      originalPrice: 200,
      discountPercentage: 35,
      applySalesTax: true,
      salesTaxRate: 8,
    });
    assert.ok(calc);
    assert.equal(calc.discountAmount, 70);
    assert.equal(calc.discountedPrice, 130);
    assert.equal(calc.salesTaxAmount, 10.4);
    assert.equal(calc.finalPrice, 140.4);
    const r = calculateBlackFridayFromInput(createExampleInput());
    assert.ok(r);
    assert.equal(r.finalPrice, 140.4);
  });

  it('Test 3: zero discount', () => {
    const calc = calculateBlackFridayDiscount({
      originalPrice: 100,
      discountPercentage: 0,
      applySalesTax: false,
      salesTaxRate: 0,
    });
    assert.ok(calc);
    assert.equal(calc.discountedPrice, 100);
  });

  it('Test 4: full discount → $0', () => {
    const calc = calculateBlackFridayDiscount({
      originalPrice: 100,
      discountPercentage: 100,
      applySalesTax: false,
      salesTaxRate: 0,
    });
    assert.ok(calc);
    assert.equal(calc.discountedPrice, 0);
  });

  it('Test 5: successive 30% then 20% on $500 → $280 (44%)', () => {
    const stack = applySuccessivePercentDiscounts(500, [30, 20]);
    assert.ok(stack);
    assert.equal(stack.discountedPrice, 280);
    assert.equal(stack.effectiveDiscountPercentage, 44);
  });

  it('Test 6: fixed $25 off $150 → $125', () => {
    const r = calculateBlackFridayFromInput(
      base({
        originalPrice: '150',
        discountKind: 'fixed',
        fixedDiscount: '25',
        applySalesTax: false,
        salesTaxRate: '',
        discountPercentage: '',
      }),
    );
    assert.ok(r);
    assert.equal(r.discountedPrice, 125);
  });

  it('Test 7: reverse original from $80 @ 20% → $100', () => {
    assert.equal(reverseOriginalFromDiscounted(80, 20), 100);
    const r = calculateBlackFridayFromInput(
      base({
        solveTarget: 'originalPrice',
        discountedPrice: '80',
        discountPercentage: '20',
        applySalesTax: false,
      }),
    );
    assert.ok(r);
    assert.equal(r.originalPrice, 100);
  });

  it('Test 8: negative price rejected', () => {
    const v = validateBlackFridayInput(base({ originalPrice: '-100' }));
    assert.equal(v.isValid, false);
  });

  it('Test 9: discount 120% rejected', () => {
    const v = validateBlackFridayInput(base({ discountPercentage: '120' }));
    assert.equal(v.isValid, false);
  });

  it('Test 10: tax disabled ignores rate', () => {
    const r = calculateBlackFridayFromInput(
      base({
        originalPrice: '100',
        discountPercentage: '20',
        applySalesTax: false,
        salesTaxRate: '8',
      }),
    );
    assert.ok(r);
    assert.equal(r.finalPrice, 80);
    assert.equal(r.salesTaxAmount, 0);
  });

  it('Black Friday 2026 is Nov 27', () => {
    const d = getBlackFridayDate(2026);
    assert.equal(d.isoDate, '2026-11-27');
  });
});
