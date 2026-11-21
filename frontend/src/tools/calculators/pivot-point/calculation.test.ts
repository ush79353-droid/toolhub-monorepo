import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculatePivotPoints, formatPivotPrice } from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validatePivotPointInput } from './validation';

describe('calculatePivotPoints classic', () => {
  it('H110 L90 C100 → PP100 R1–R3 / S1–S3', () => {
    const r = calculatePivotPoints({
      method: 'classic',
      high: 110,
      low: 90,
      close: 100,
      open: null,
    });
    assert.ok(r);
    assert.equal(r!.pivot, 100);
    assert.equal(r!.r1, 110);
    assert.equal(r!.r2, 120);
    assert.equal(r!.r3, 130);
    assert.equal(r!.s1, 90);
    assert.equal(r!.s2, 80);
    assert.equal(r!.s3, 70);
    assert.equal(r!.r4, null);
    assert.equal(r!.s4, null);
  });
});

describe('calculatePivotPoints woodie', () => {
  it('H120 L90 C110 → PP 107.50', () => {
    const r = calculatePivotPoints({
      method: 'woodie',
      high: 120,
      low: 90,
      close: 110,
      open: null,
    });
    assert.ok(r);
    assert.equal(r!.pivot, 107.5);
    assert.equal(r!.r1, 2 * 107.5 - 90);
    assert.equal(r!.r2, 107.5 + 30);
    assert.equal(r!.s1, 2 * 107.5 - 120);
  });
});

describe('calculatePivotPoints fibonacci', () => {
  it('H110 L90 C100', () => {
    const r = calculatePivotPoints({
      method: 'fibonacci',
      high: 110,
      low: 90,
      close: 100,
      open: null,
    });
    assert.ok(r);
    assert.equal(r!.pivot, 100);
    assert.ok(Math.abs(r!.r1! - 107.64) < 0.001);
    assert.ok(Math.abs(r!.r2! - 112.36) < 0.001);
    assert.equal(r!.r3, 120);
    assert.ok(Math.abs(r!.s1! - 92.36) < 0.001);
    assert.ok(Math.abs(r!.s2! - 87.64) < 0.001);
    assert.equal(r!.s3, 80);
  });
});

describe('calculatePivotPoints camarilla', () => {
  it('H110 L90 C100', () => {
    const r = calculatePivotPoints({
      method: 'camarilla',
      high: 110,
      low: 90,
      close: 100,
      open: null,
    });
    assert.ok(r);
    assert.equal(r!.pivot, 100);
    assert.ok(Math.abs(r!.r1! - 101.8333333333) < 1e-6);
    assert.ok(Math.abs(r!.r2! - 103.6666666667) < 1e-6);
    assert.equal(r!.r3, 105.5);
    assert.equal(r!.r4, 111);
    assert.ok(Math.abs(r!.s1! - 98.1666666667) < 1e-6);
    assert.ok(Math.abs(r!.s2! - 96.3333333333) < 1e-6);
    assert.equal(r!.s3, 94.5);
    assert.equal(r!.s4, 89);
  });
});

describe('calculatePivotPoints demark', () => {
  it('close > open', () => {
    const r = calculatePivotPoints({
      method: 'demark',
      high: 110,
      low: 90,
      close: 100,
      open: 95,
    });
    assert.ok(r);
    assert.equal(r!.pivot, 102.5);
    assert.equal(r!.r1, 115);
    assert.equal(r!.s1, 95);
    assert.equal(r!.r2, null);
    assert.equal(r!.s2, null);
  });

  it('close < open', () => {
    const r = calculatePivotPoints({
      method: 'demark',
      high: 110,
      low: 90,
      close: 95,
      open: 100,
    });
    assert.ok(r);
    // X = H + 2L + C = 110 + 180 + 95 = 385; P = 96.25
    assert.equal(r!.pivot, 385 / 4);
    assert.equal(r!.r1, 385 / 2 - 90);
    assert.equal(r!.s1, 385 / 2 - 110);
  });

  it('close = open', () => {
    const r = calculatePivotPoints({
      method: 'demark',
      high: 110,
      low: 90,
      close: 100,
      open: 100,
    });
    assert.ok(r);
    // X = H + L + 2C = 110 + 90 + 200 = 400; P = 100
    assert.equal(r!.pivot, 100);
    assert.equal(r!.r1, 110);
    assert.equal(r!.s1, 90);
  });

  it('missing open → null', () => {
    assert.equal(
      calculatePivotPoints({
        method: 'demark',
        high: 110,
        low: 90,
        close: 100,
        open: null,
      }),
      null
    );
  });
});

describe('calculatePivotPoints validation guards', () => {
  it('high < low → null', () => {
    assert.equal(
      calculatePivotPoints({
        method: 'classic',
        high: 80,
        low: 90,
        close: 85,
        open: null,
      }),
      null
    );
  });

  it('close outside range → null', () => {
    assert.equal(
      calculatePivotPoints({
        method: 'classic',
        high: 110,
        low: 90,
        close: 120,
        open: null,
      }),
      null
    );
  });

  it('zero-range period', () => {
    const r = calculatePivotPoints({
      method: 'classic',
      high: 100,
      low: 100,
      close: 100,
      open: null,
    });
    assert.ok(r);
    assert.equal(r!.pivot, 100);
    assert.equal(r!.r1, 100);
    assert.equal(r!.r2, 100);
    assert.equal(r!.s1, 100);
  });

  it('negative price → null', () => {
    assert.equal(
      calculatePivotPoints({
        method: 'classic',
        high: 110,
        low: -1,
        close: 100,
        open: null,
      }),
      null
    );
  });
});

describe('formatting', () => {
  it('formats prices', () => {
    assert.equal(formatPivotPrice(100, 'PKR'), '100.00');
  });
});

describe('validatePivotPointInput', () => {
  it('defaults classic', () => {
    const v = validatePivotPointInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result!.pivot, 100);
    assert.equal(v.result!.r3, 130);
    assert.equal(v.result!.s3, 70);
  });

  it('empty → invalid', () => {
    const v = validatePivotPointInput(createEmptyInput());
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });

  it('method switch to fibonacci', () => {
    const v = validatePivotPointInput({
      ...createDefaultInput(),
      method: 'fibonacci',
    });
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result!.r3, 120);
    assert.equal(v.result!.r4, null);
  });

  it('demark requires open', () => {
    const v = validatePivotPointInput({
      ...createDefaultInput(),
      method: 'demark',
      open: '',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.open);
  });
});
