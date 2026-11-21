import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateApproximateRealRate,
  calculateExactRealRate,
  calculateExpectedInflation,
  calculateNominalRate,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateFisherEquationInput } from './validation';
// Shared path still used by Fisher Effect
import { calculateRealRate } from '@/tools/shared/fisher-equation';

describe('exact real rate (8% / 3%)', () => {
  it('→ ≈ 4.8543689%', () => {
    const r = calculateExactRealRate(8, 3);
    assert.ok(r != null);
    assert.ok(Math.abs(r - ((1.08 / 1.03 - 1) * 100)) < 1e-12);
  });

  it('approximate → 5%', () => {
    assert.equal(calculateApproximateRealRate(8, 3), 5);
  });
});

describe('edge cases', () => {
  it('zero inflation → real = nominal', () => {
    const r = calculateExactRealRate(6, 0);
    assert.ok(r != null);
    assert.ok(Math.abs(r - 6) < 1e-12);
  });

  it('negative real', () => {
    const r = calculateExactRealRate(4, 7);
    assert.ok(r != null && r < 0);
    assert.ok(Math.abs(r - ((1.04 / 1.07 - 1) * 100)) < 1e-12);
  });

  it('deflation', () => {
    const r = calculateExactRealRate(2, -1);
    assert.ok(r != null && r > 2);
  });

  it('inflation −100% → null', () => {
    assert.equal(calculateExactRealRate(5, -100), null);
  });

  it('nominal −120% → null', () => {
    assert.equal(calculateExactRealRate(-120, 3), null);
  });
});

describe('bidirectional', () => {
  it('nominal from r=3 π=2 → 5.06%', () => {
    const i = calculateNominalRate(3, 2);
    assert.ok(i != null);
    assert.ok(Math.abs(i - 5.06) < 1e-10);
  });

  it('inflation round-trip', () => {
    const i = calculateNominalRate(3, 2)!;
    const pi = calculateExpectedInflation(i, 3);
    assert.ok(pi != null);
    assert.ok(Math.abs(pi - 2) < 1e-10);
  });
});

describe('shared module alias', () => {
  it('calculateRealRate matches exact', () => {
    assert.equal(calculateRealRate(8, 3), calculateExactRealRate(8, 3));
  });
});

describe('validateFisherEquationInput', () => {
  it('defaults 8/3 → exact ≈4.85 approx 5', () => {
    const v = validateFisherEquationInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.ok(Math.abs(v.result.realRate - ((1.08 / 1.03 - 1) * 100)) < 1e-12);
    assert.equal(v.result.approximateValue, 5);
    assert.ok(v.result.stepByStep.length >= 4);
  });

  it('empty → invalid', () => {
    assert.equal(validateFisherEquationInput(createEmptyInput()).isValid, false);
  });

  it('πᵉ=-100 validation error', () => {
    const input = createDefaultInput();
    input.expectedInflation = '-100';
    const v = validateFisherEquationInput(input);
    assert.equal(v.isValid, false);
    assert.ok(v.errors.expectedInflation);
  });

  it('mode nominal', () => {
    const input = createDefaultInput();
    input.mode = 'nominal';
    input.realRate = '3';
    input.expectedInflation = '2';
    input.nominalRate = '';
    const v = validateFisherEquationInput(input);
    assert.equal(v.isValid, true);
    assert.ok(v.result && Math.abs(v.result.nominalRate - 5.06) < 1e-10);
  });
});
