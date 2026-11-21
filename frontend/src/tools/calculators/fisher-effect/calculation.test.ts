import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  approximateRealRate,
  calculateExpectedInflation,
  calculateNominalRate,
  calculateRealRate,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateFisherEffectInput } from './validation';

describe('calculateRealRate', () => {
  it('5% / 2% → ≈ 2.941176%', () => {
    const r = calculateRealRate(5, 2);
    assert.ok(r != null);
    assert.ok(Math.abs(r - ((1.05 / 1.02 - 1) * 100)) < 1e-12);
    assert.ok(Math.abs(r - 2.941176470588235) < 1e-10);
  });

  it('no inflation → real = nominal', () => {
    const r = calculateRealRate(6, 0);
    assert.ok(r != null);
    assert.ok(Math.abs(r - 6) < 1e-12);
  });

  it('negative real when inflation > nominal', () => {
    const r = calculateRealRate(4, 7);
    assert.ok(r != null);
    assert.ok(Math.abs(r - ((1.04 / 1.07 - 1) * 100)) < 1e-12);
    assert.ok(r < 0);
  });

  it('deflation raises real above nominal', () => {
    const r = calculateRealRate(2, -1);
    assert.ok(r != null);
    assert.ok(Math.abs(r - ((1.02 / 0.99 - 1) * 100)) < 1e-12);
    assert.ok(r > 2);
  });

  it('inflation −100% → null', () => {
    assert.equal(calculateRealRate(5, -100), null);
  });

  it('nominal < −100% → null', () => {
    assert.equal(calculateRealRate(-120, 2), null);
  });

  it('decimal precision', () => {
    const r = calculateRealRate(7.5, 3.25);
    assert.ok(r != null);
    assert.ok(Math.abs(r - ((1.075 / 1.0325 - 1) * 100)) < 1e-12);
  });
});

describe('calculateNominalRate', () => {
  it('r=3%, π=2% → ≈ 5.06%', () => {
    const i = calculateNominalRate(3, 2);
    assert.ok(i != null);
    assert.ok(Math.abs(i - ((1.03 * 1.02 - 1) * 100)) < 1e-12);
    assert.ok(Math.abs(i - 5.06) < 1e-10);
  });
});

describe('calculateExpectedInflation', () => {
  it('round-trip with nominal from r=3 π=2', () => {
    const i = calculateNominalRate(3, 2)!;
    const pi = calculateExpectedInflation(i, 3);
    assert.ok(pi != null);
    assert.ok(Math.abs(pi - 2) < 1e-10);
  });

  it('real ≤ −100% → null', () => {
    assert.equal(calculateExpectedInflation(5, -100), null);
  });
});

describe('approximate', () => {
  it('5 − 2 = 3', () => {
    assert.equal(approximateRealRate(5, 2), 3);
  });
});

describe('validateFisherEffectInput', () => {
  it('defaults → exact ≈ 2.94, approx 3', () => {
    const v = validateFisherEffectInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.ok(Math.abs(v.result.realRate - 2.941176470588235) < 1e-10);
    assert.equal(v.result.approximateValue, 3);
    assert.ok(Math.abs(v.result.approximationDifference - (v.result.realRate - 3)) < 1e-12);
  });

  it('empty → invalid', () => {
    assert.equal(validateFisherEffectInput(createEmptyInput()).isValid, false);
  });

  it('inflation −100% errors in real mode', () => {
    const input = createDefaultInput();
    input.expectedInflation = '-100';
    const v = validateFisherEffectInput(input);
    assert.equal(v.isValid, false);
    assert.ok(v.errors.expectedInflation);
  });

  it('nominal −120% errors', () => {
    const input = createDefaultInput();
    input.nominalRate = '-120';
    const v = validateFisherEffectInput(input);
    assert.equal(v.isValid, false);
  });

  it('mode switch to nominal', () => {
    const input = createDefaultInput();
    input.mode = 'nominal';
    input.realRate = '3';
    input.expectedInflation = '2';
    input.nominalRate = '';
    const v = validateFisherEffectInput(input);
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.ok(Math.abs(v.result.nominalRate - 5.06) < 1e-10);
  });

  it('mode switch to inflation', () => {
    const input = createDefaultInput();
    input.mode = 'inflation';
    input.nominalRate = '5.06';
    input.realRate = '3';
    input.expectedInflation = '';
    const v = validateFisherEffectInput(input);
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.ok(Math.abs(v.result.expectedInflation - 2) < 1e-2);
  });
});
