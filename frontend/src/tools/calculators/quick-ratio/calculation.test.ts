import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAdjustedQuickRatio,
  calculateQuickRatio,
  calculateQuickRatioFromInput,
  calculateRequiredCash,
  calculateRequiredQuickAssets,
} from './calculation';
import { createExampleInput, type QuickRatioInput } from './types';
import { validateQuickRatioInput } from './validation';

function base(patch: Partial<QuickRatioInput> = {}): QuickRatioInput {
  return { ...createExampleInput(), ...patch };
}

describe('quick ratio forward', () => {
  it('Test 1: standard 1.50', () => {
    const calc = calculateQuickRatio({
      cashAndCashEquivalents: 150_000,
      marketableSecurities: 50_000,
      accountsReceivable: 100_000,
      currentLiabilities: 200_000,
    });
    assert.ok(calc);
    assert.equal(calc.quickAssets, 300_000);
    assert.equal(calc.quickRatio, 1.5);
    const r = calculateQuickRatioFromInput(createExampleInput());
    assert.ok(r);
    assert.equal(r.quickRatio, 1.5);
  });

  it('Test 2: exactly 1.00', () => {
    const calc = calculateQuickRatio({
      cashAndCashEquivalents: 50_000,
      marketableSecurities: 20_000,
      accountsReceivable: 30_000,
      currentLiabilities: 100_000,
    });
    assert.ok(calc);
    assert.equal(calc.quickRatio, 1);
  });

  it('Test 3: below 1 → 0.60', () => {
    const calc = calculateQuickRatio({
      cashAndCashEquivalents: 20_000,
      marketableSecurities: 10_000,
      accountsReceivable: 30_000,
      currentLiabilities: 100_000,
    });
    assert.ok(calc);
    assert.equal(calc.quickRatio, 0.6);
  });

  it('Test 4: above 2 ≈ 2.67', () => {
    const calc = calculateQuickRatio({
      cashAndCashEquivalents: 200_000,
      marketableSecurities: 100_000,
      accountsReceivable: 100_000,
      currentLiabilities: 150_000,
    });
    assert.ok(calc);
    assert.ok(Math.abs(calc.quickRatio - 400_000 / 150_000) < 1e-12);
  });

  it('Test 5: zero CL undefined', () => {
    assert.equal(
      calculateQuickRatio({
        cashAndCashEquivalents: 100_000,
        marketableSecurities: 0,
        accountsReceivable: 0,
        currentLiabilities: 0,
      }),
      null,
    );
    const v = validateQuickRatioInput(
      base({ currentLiabilities: '0' }),
    );
    assert.equal(v.isValid, false);
    assert.match(v.errors.currentLiabilities ?? '', /undefined/i);
  });

  it('Test 6: negative cash rejected', () => {
    const v = validateQuickRatioInput(
      base({ cashAndCashEquivalents: '-5000' }),
    );
    assert.equal(v.isValid, false);
  });

  it('Test 7: all quick assets zero → 0', () => {
    const calc = calculateQuickRatio({
      cashAndCashEquivalents: 0,
      marketableSecurities: 0,
      accountsReceivable: 0,
      currentLiabilities: 100_000,
    });
    assert.ok(calc);
    assert.equal(calc.quickRatio, 0);
  });

  it('Test 8: alternative formula 1.50', () => {
    const adj = calculateAdjustedQuickRatio({
      currentAssets: 500_000,
      inventory: 150_000,
      prepaidExpenses: 50_000,
      otherNonQuickAssets: 0,
      currentLiabilities: 200_000,
    });
    assert.ok(adj);
    assert.equal(adj.quickAssets, 300_000);
    assert.equal(adj.quickRatio, 1.5);
  });

  it('Test 9: required quick assets 300,000', () => {
    assert.equal(calculateRequiredQuickAssets(1.5, 200_000), 300_000);
  });

  it('Test 10: required cash 150,000', () => {
    assert.equal(
      calculateRequiredCash(1.5, 200_000, 50_000, 100_000),
      150_000,
    );
  });
});
