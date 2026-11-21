import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateLinearDwl,
  calculateLinearEquilibrium,
  calculateTaxDwl,
  calculateTriangleDwl,
  formatMoney,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateDeadweightLossInput } from './validation';

describe('calculateTriangleDwl', () => {
  it('standard example → 400', () => {
    const r = calculateTriangleDwl(10, 14, 1000, 800);
    assert.ok(r);
    assert.equal(r.priceDifference, 4);
    assert.equal(r.quantityDifference, 200);
    assert.equal(r.deadweightLoss, 400);
  });

  it('zero price difference → 0', () => {
    const r = calculateTriangleDwl(10, 10, 1000, 800);
    assert.ok(r);
    assert.equal(r.deadweightLoss, 0);
  });

  it('zero quantity difference → 0', () => {
    const r = calculateTriangleDwl(10, 14, 1000, 1000);
    assert.ok(r);
    assert.equal(r.deadweightLoss, 0);
  });

  it('zero inputs → 0', () => {
    const r = calculateTriangleDwl(0, 0, 0, 0);
    assert.ok(r);
    assert.equal(r.deadweightLoss, 0);
  });

  it('rejects negative price', () => {
    assert.equal(calculateTriangleDwl(-1, 14, 1000, 800), null);
  });

  it('rejects negative quantity', () => {
    assert.equal(calculateTriangleDwl(10, 14, -1, 800), null);
  });

  it('decimal values', () => {
    const r = calculateTriangleDwl(10.5, 12.5, 100.5, 80.25);
    assert.ok(r);
    assert.ok(Math.abs(r.deadweightLoss - 0.5 * 2 * 20.25) < 1e-12);
  });

  it('large values remain finite', () => {
    const r = calculateTriangleDwl(1e6, 2e6, 1e7, 5e6);
    assert.ok(r);
    assert.ok(Number.isFinite(r.deadweightLoss));
    assert.equal(r.deadweightLoss, 0.5 * 1e6 * 5e6);
  });
});

describe('calculateTaxDwl', () => {
  it('tax wedge and revenue', () => {
    const r = calculateTaxDwl(1000, 800, 4);
    assert.ok(r);
    assert.equal(r.quantityDifference, 200);
    assert.equal(r.deadweightLoss, 400);
    assert.equal(r.taxRevenue, 3200);
  });

  it('rejects negative wedge', () => {
    assert.equal(calculateTaxDwl(1000, 800, -1), null);
  });
});

describe('linear S&D', () => {
  it('equilibrium for a=20,b=0.01,c=0,d=0.01', () => {
    const eq = calculateLinearEquilibrium(20, 0.01, 0, 0.01);
    assert.ok(eq);
    assert.ok(Math.abs(eq.qe - 1000) < 1e-9);
    assert.ok(Math.abs(eq.pe - 10) < 1e-9);
  });

  it('welfare integral matches closed form', () => {
    const r = calculateLinearDwl(20, 0.01, 0, 0.01, 800);
    assert.ok(r);
    // ½(0.02)(200)² = 400
    assert.ok(Math.abs(r.deadweightLoss - 400) < 1e-9);
    assert.ok(Math.abs(r.qe - 1000) < 1e-9);
  });

  it('rejects non-positive slopes', () => {
    assert.equal(calculateLinearEquilibrium(20, 0, 0, 0.01), null);
    assert.equal(calculateLinearDwl(20, 0.01, 0, -0.01, 800), null);
  });
});

describe('formatting', () => {
  it('currency formatting', () => {
    assert.match(formatMoney(400, 'USD'), /400\.00/);
  });
});

describe('validateDeadweightLossInput', () => {
  it('defaults → 400', () => {
    const v = validateDeadweightLossInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result.deadweightLoss, 400);
    assert.equal(v.result.priceDifference, 4);
    assert.equal(v.result.quantityDifference, 200);
    assert.equal(v.result.graph.dwlPolygon.length, 3);
  });

  it('empty → invalid', () => {
    const v = validateDeadweightLossInput(createEmptyInput());
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });

  it('invalid string', () => {
    const input = createDefaultInput();
    input.originalPrice = 'abc';
    const v = validateDeadweightLossInput(input);
    assert.equal(v.isValid, false);
  });

  it('tax mode', () => {
    const input = createDefaultInput();
    input.mode = 'tax';
    const v = validateDeadweightLossInput(input);
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result.deadweightLoss, 400);
    assert.equal(v.result.taxRevenue, 3200);
  });

  it('linear mode chart has demand/supply', () => {
    const input = createDefaultInput();
    input.mode = 'linear';
    const v = validateDeadweightLossInput(input);
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result.graph.kind, 'linear');
    assert.ok((v.result.graph.demandPoints?.length ?? 0) > 2);
    assert.ok((v.result.graph.supplyPoints?.length ?? 0) > 2);
    assert.ok(Math.abs(v.result.deadweightLoss - 400) < 1e-6);
  });
});
