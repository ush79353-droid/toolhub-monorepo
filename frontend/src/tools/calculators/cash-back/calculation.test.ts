import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateBreakEvenSpend,
  calculateCashBack,
  calculateCashBackFromInput,
} from './calculation';
import { createExampleInput, type CashBackInput } from './types';
import { validateCashBackInput } from './validation';

function base(patch: Partial<CashBackInput> = {}): CashBackInput {
  return { ...createExampleInput(), ...patch };
}

describe('cash back calculator', () => {
  it('Test 1: $500 · 5% → $25', () => {
    const calc = calculateCashBack({
      purchaseAmount: 500,
      cashbackPercentage: 5,
      hasCashbackLimit: false,
    });
    assert.ok(calc);
    assert.equal(calc.actualCashback, 25);
    assert.equal(calc.effectivePurchaseCost, 475);
    const r = calculateCashBackFromInput(createExampleInput());
    assert.ok(r);
    assert.equal(r.actualCashback, 25);
  });

  it('Test 2: capped $1,500 · 5% · limit $50 → $50', () => {
    const calc = calculateCashBack({
      purchaseAmount: 1500,
      cashbackPercentage: 5,
      hasCashbackLimit: true,
      cashbackLimit: 50,
    });
    assert.ok(calc);
    assert.equal(calc.calculatedCashback, 75);
    assert.equal(calc.actualCashback, 50);
    assert.equal(calc.cashbackLimitApplied, true);
    assert.equal(calc.effectivePurchaseCost, 1450);
  });

  it('Test 3: uncapped $2,000 · 4% → $80', () => {
    const calc = calculateCashBack({
      purchaseAmount: 2000,
      cashbackPercentage: 4,
      hasCashbackLimit: false,
    });
    assert.ok(calc);
    assert.equal(calc.actualCashback, 80);
  });

  it('Test 4: zero rate → $0', () => {
    const calc = calculateCashBack({
      purchaseAmount: 500,
      cashbackPercentage: 0,
      hasCashbackLimit: false,
    });
    assert.ok(calc);
    assert.equal(calc.actualCashback, 0);
  });

  it('Test 5: 100% on $100 → $100', () => {
    const calc = calculateCashBack({
      purchaseAmount: 100,
      cashbackPercentage: 100,
      hasCashbackLimit: false,
    });
    assert.ok(calc);
    assert.equal(calc.actualCashback, 100);
  });

  it('Test 6: effective rate 2.5% with cap', () => {
    const calc = calculateCashBack({
      purchaseAmount: 2000,
      cashbackPercentage: 5,
      hasCashbackLimit: true,
      cashbackLimit: 50,
    });
    assert.ok(calc);
    assert.equal(calc.effectiveCashbackRate, 2.5);
  });

  it('Test 7: effective cost $475', () => {
    const calc = calculateCashBack({
      purchaseAmount: 500,
      cashbackPercentage: 5,
      hasCashbackLimit: false,
    });
    assert.ok(calc);
    assert.equal(calc.effectivePurchaseCost, 475);
  });

  it('Test 8: negative purchase rejected', () => {
    const v = validateCashBackInput(base({ purchaseAmount: '-100' }));
    assert.equal(v.isValid, false);
  });

  it('Test 9: rate 150% rejected', () => {
    const v = validateCashBackInput(base({ cashbackPercentage: '150' }));
    assert.equal(v.isValid, false);
  });

  it('Test 10: disabled limit ignores stored limit', () => {
    const r = calculateCashBackFromInput(
      base({
        purchaseAmount: '1000',
        cashbackPercentage: '5',
        hasCashbackLimit: false,
        cashbackLimit: '10',
      }),
    );
    assert.ok(r);
    assert.equal(r.actualCashback, 50);
    assert.equal(r.cashbackLimitApplied, false);
  });

  it('break-even spend: $50 at 5% → $1,000', () => {
    assert.equal(calculateBreakEvenSpend(50, 5), 1000);
  });

  it('zero purchase → rate N/A', () => {
    const calc = calculateCashBack({
      purchaseAmount: 0,
      cashbackPercentage: 5,
      hasCashbackLimit: false,
    });
    assert.ok(calc);
    assert.equal(calc.actualCashback, 0);
    assert.equal(calc.effectiveCashbackRate, null);
  });
});
