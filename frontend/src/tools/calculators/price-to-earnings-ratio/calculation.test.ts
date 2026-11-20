import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateEps,
  calculatePeRatio,
  formatRatio,
  interpretPeRatio,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validatePriceToEarningsInput } from './validation';

describe('calculatePeRatio', () => {
  it('120 / 10 → 12', () => {
    const r = calculatePeRatio(120, 10);
    assert.equal(r.status, 'valid');
    assert.equal(r.peRatio, 12);
  });

  it('decimal values', () => {
    const r = calculatePeRatio(137.5, 7.25);
    assert.equal(r.status, 'valid');
    assert.ok(Math.abs(r.peRatio! - 137.5 / 7.25) < 1e-12);
  });

  it('zero EPS → undefined', () => {
    const r = calculatePeRatio(100, 0);
    assert.equal(r.status, 'undefined');
    assert.equal(r.peRatio, null);
  });

  it('negative EPS → not-meaningful', () => {
    const r = calculatePeRatio(100, -5);
    assert.equal(r.status, 'not-meaningful');
    assert.equal(r.peRatio, null);
  });

  it('zero price → 0', () => {
    const r = calculatePeRatio(0, 5);
    assert.equal(r.status, 'valid');
    assert.equal(r.peRatio, 0);
  });

  it('negative price → invalid', () => {
    const r = calculatePeRatio(-1, 5);
    assert.equal(r.status, 'invalid');
  });
});

describe('calculateEps', () => {
  it('(1,000,000 − 100,000) / 100,000 → 9', () => {
    assert.equal(calculateEps(1_000_000, 100_000, 100_000), 9);
  });

  it('zero shares → null', () => {
    assert.equal(calculateEps(100, 0, 0), null);
  });

  it('negative preferred → null', () => {
    assert.equal(calculateEps(100, -1, 10), null);
  });
});

describe('interpretPeRatio', () => {
  it('bands', () => {
    assert.match(interpretPeRatio(8), /relatively low/i);
    assert.match(interpretPeRatio(15), /paying about/i);
    assert.match(interpretPeRatio(30), /higher multiple/i);
  });
});

describe('formatting', () => {
  it('formats ratio', () => {
    assert.equal(formatRatio(12), '12.00');
    assert.equal(formatRatio(137.5 / 7.25), '18.97');
  });
});

describe('validatePriceToEarningsInput', () => {
  it('defaults → 12×', () => {
    const v = validatePriceToEarningsInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result!.peRatio, 12);
  });

  it('EPS calculator path → 15×', () => {
    const v = validatePriceToEarningsInput({
      ...createDefaultInput(),
      showEpsCalculator: true,
      pricePerShare: '135',
    });
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result!.earningsPerShare, 9);
    assert.equal(v.result!.peRatio, 15);
  });

  it('empty → invalid', () => {
    const v = validatePriceToEarningsInput(createEmptyInput());
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });

  it('zero EPS message', () => {
    const v = validatePriceToEarningsInput({
      ...createDefaultInput(),
      earningsPerShare: '0',
    });
    assert.ok(v.result);
    assert.equal(v.result!.status, 'undefined');
    assert.ok(v.result!.peUnavailableReason);
  });
});
