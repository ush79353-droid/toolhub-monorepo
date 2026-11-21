import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  calculateDiscountAmount,
  calculateDiscountPercentage,
  calculateFinalPrice,
  calculateOriginalPrice,
  calculatePercentOff,
  calculatePercentOffFromInput,
  calculateSequentialDiscounts,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
  type PercentOffInput,
} from './types';
import { validatePercentOffInput } from './validation';

function approx(actual: number | null | undefined, expected: number, tol = 1e-6) {
  assert.ok(actual != null, `expected ${expected}, got null`);
  assert.ok(
    Math.abs(actual! - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Percent Off Calculator engine', () => {
  it('basic discount: $100, 20% → $80 final', () => {
    approx(calculateFinalPrice(100, 20), 80);
    approx(calculateDiscountAmount(100, 20), 20);
  });

  it('discount savings: $200, 25% → $50 savings', () => {
    const r = calculatePercentOff({
      originalPrice: 200,
      discountPercent: 25,
    });
    assert.ok(r);
    approx(r!.totalSavings, 50);
    approx(r!.discountedPrice, 150);
  });

  it('no discount: $100, 0% → $100', () => {
    approx(calculateFinalPrice(100, 0), 100);
  });

  it('full discount: $100, 100% → $0', () => {
    approx(calculateFinalPrice(100, 100), 0);
  });

  it('decimal discount: $100, 12.5% → $87.50', () => {
    approx(calculateFinalPrice(100, 12.5), 87.5);
  });

  it('two discounts: $100, 20% then 10% → $72', () => {
    const seq = calculateSequentialDiscounts(100, [20, 10]);
    assert.ok(seq);
    approx(seq!.discountedPrice, 72);
    approx(seq!.totalSavings, 28);
    approx(seq!.effectiveDiscountPercent, 28);
  });

  it('effective discount formula 20% then 10% → 28%', () => {
    const r = calculatePercentOff({
      originalPrice: 100,
      discountPercent: 20,
      additionalDiscountPercent: 10,
    });
    assert.ok(r);
    approx(r!.effectiveDiscountPercent, 28);
  });

  it('reverse original: $75 final, 25% off → $100', () => {
    approx(calculateOriginalPrice(75, 25), 100);
  });

  it('find discount: $200 → $150 = 25%', () => {
    approx(calculateDiscountPercentage(200, 150), 25);
  });

  it('tax after discount: $200, 25%, 8% tax → $162', () => {
    const r = calculatePercentOff({
      originalPrice: 200,
      discountPercent: 25,
      taxPercent: 8,
    });
    assert.ok(r);
    approx(r!.discountedPrice, 150);
    approx(r!.taxAmount, 12);
    approx(r!.finalPriceWithTax, 162);
  });

  it('negative price fails validation', () => {
    const input: PercentOffInput = {
      ...createExampleInput(),
      originalPrice: '-100',
    };
    const v = validatePercentOffInput(input);
    assert.ok(v.errors.originalPrice);
    assert.equal(v.result, null);
  });

  it('negative discount fails validation', () => {
    const input: PercentOffInput = {
      ...createExampleInput(),
      discountPercent: '-10',
    };
    const v = validatePercentOffInput(input);
    assert.ok(v.errors.discountPercent);
  });

  it('discount above 100% fails', () => {
    const input: PercentOffInput = {
      ...createExampleInput(),
      discountPercent: '120',
    };
    const v = validatePercentOffInput(input);
    assert.ok(v.errors.discountPercent);
  });

  it('reverse 100% discount is indeterminate', () => {
    assert.equal(calculateOriginalPrice(0, 100), null);
    const input: PercentOffInput = {
      ...createDefaultInput(),
      solveMode: 'originalPrice',
      salePrice: '0',
      discountPercent: '100',
    };
    const v = validatePercentOffInput(input);
    assert.equal(v.result, null);
    assert.ok(v.errors.discountPercent || v.errors.form);
  });

  it('original price zero for find-discount fails', () => {
    const input: PercentOffInput = {
      ...createDefaultInput(),
      solveMode: 'discountPercent',
      originalPrice: '0',
      salePrice: '0',
    };
    const v = validatePercentOffInput(input);
    assert.ok(v.errors.originalPrice);
  });

  it('empty input yields no result', () => {
    assert.equal(validatePercentOffInput(createDefaultInput()).result, null);
  });

  it('example input: $200 · 25% → $150', () => {
    const r = calculatePercentOffFromInput(createExampleInput());
    assert.ok(r);
    approx(r!.discountedPrice, 150);
    approx(r!.totalSavings, 50);
  });

  it('clear/reload helpers', () => {
    assert.equal(createEmptyInput().originalPrice, '');
    assert.equal(createExampleInput().discountPercent, '25');
  });
});
