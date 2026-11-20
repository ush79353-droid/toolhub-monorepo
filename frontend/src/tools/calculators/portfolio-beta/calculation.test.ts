import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculatePortfolioBeta,
  formatBeta,
  interpretPortfolioBeta,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validatePortfolioBetaInput } from './validation';

describe('calculatePortfolioBeta', () => {
  it('three-stock example → 1.14', () => {
    const r = calculatePortfolioBeta([
      { id: 'a', label: 'Stock 1', beta: 1.2, weightPercent: 50 },
      { id: 'b', label: 'Stock 2', beta: 0.8, weightPercent: 30 },
      { id: 'c', label: 'Stock 3', beta: 1.5, weightPercent: 20 },
    ]);
    assert.ok(r);
    assert.equal(r!.isFullyAllocated, true);
    assert.ok(Math.abs(r!.portfolioBeta! - 1.14) < 1e-12);
    assert.ok(Math.abs(r!.contributions[0].weightedBeta - 0.6) < 1e-12);
    assert.ok(Math.abs(r!.contributions[1].weightedBeta - 0.24) < 1e-12);
    assert.ok(Math.abs(r!.contributions[2].weightedBeta - 0.3) < 1e-12);
  });

  it('single stock 100%', () => {
    const r = calculatePortfolioBeta([
      { id: 'a', label: 'Stock 1', beta: 1.25, weightPercent: 100 },
    ]);
    assert.ok(r);
    assert.equal(r!.portfolioBeta, 1.25);
  });

  it('equal weight', () => {
    const r = calculatePortfolioBeta([
      { id: 'a', label: 'Stock 1', beta: 1, weightPercent: 50 },
      { id: 'b', label: 'Stock 2', beta: 1.5, weightPercent: 50 },
    ]);
    assert.ok(r);
    assert.equal(r!.portfolioBeta, 1.25);
  });

  it('negative beta contribution', () => {
    const r = calculatePortfolioBeta([
      { id: 'a', label: 'Stock 1', beta: 1, weightPercent: 50 },
      { id: 'b', label: 'Stock 2', beta: -0.5, weightPercent: 50 },
    ]);
    assert.ok(r);
    assert.equal(r!.portfolioBeta, 0.25);
  });

  it('zero beta', () => {
    const r = calculatePortfolioBeta([
      { id: 'a', label: 'Stock 1', beta: 0, weightPercent: 100 },
    ]);
    assert.ok(r);
    assert.equal(r!.portfolioBeta, 0);
  });

  it('weights below 100 → no portfolio beta', () => {
    const r = calculatePortfolioBeta([
      { id: 'a', label: 'Stock 1', beta: 1.2, weightPercent: 40 },
      { id: 'b', label: 'Stock 2', beta: 0.8, weightPercent: 45 },
    ]);
    assert.ok(r);
    assert.equal(r!.isFullyAllocated, false);
    assert.equal(r!.portfolioBeta, null);
    assert.equal(r!.totalWeightPercent, 85);
  });

  it('weights above 100 → no portfolio beta', () => {
    const r = calculatePortfolioBeta([
      { id: 'a', label: 'Stock 1', beta: 1, weightPercent: 60 },
      { id: 'b', label: 'Stock 2', beta: 1, weightPercent: 60 },
    ]);
    assert.ok(r);
    assert.equal(r!.isFullyAllocated, false);
    assert.equal(r!.portfolioBeta, null);
  });

  it('weight > 100 per stock → null', () => {
    assert.equal(
      calculatePortfolioBeta([
        { id: 'a', label: 'Stock 1', beta: 1, weightPercent: 120 },
      ]),
      null
    );
  });
});

describe('interpretPortfolioBeta', () => {
  it('covers bands', () => {
    assert.match(interpretPortfolioBeta(1.25), /above 1/i);
    assert.match(interpretPortfolioBeta(1), /approximately 1/i);
    assert.match(interpretPortfolioBeta(0.65), /between 0 and 1/i);
    assert.match(interpretPortfolioBeta(0), /approximately 0/i);
    assert.match(interpretPortfolioBeta(-0.4), /negative/i);
  });
});

describe('formatting', () => {
  it('formats beta', () => {
    assert.equal(formatBeta(1.14), '1.14');
  });
});

describe('validatePortfolioBetaInput', () => {
  it('defaults → 1.14', () => {
    const v = validatePortfolioBetaInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.ok(Math.abs(v.result!.portfolioBeta! - 1.14) < 1e-12);
  });

  it('empty → invalid', () => {
    const v = validatePortfolioBetaInput(createEmptyInput());
    assert.equal(v.isValid, false);
  });

  it('incomplete weight shows message', () => {
    const v = validatePortfolioBetaInput({
      stocks: [
        { id: 'a', beta: '1', weight: '40' },
        { id: 'b', beta: '1', weight: '40' },
        { id: 'c', beta: '1', weight: '5' },
      ],
    });
    assert.equal(v.isValid, false);
    assert.ok(v.result);
    assert.equal(v.result!.portfolioBeta, null);
    assert.ok(v.result!.weightMessage);
  });
});
