import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateMarginalCost } from './calculation';
import { validateMarginalCostInput } from './validation';
import { createDefaultInput } from './types';

const TOL = 1e-9;

describe('calculateMarginalCost', () => {
  it('15,000 / 200 = 75', () => {
    assert.equal(calculateMarginalCost(15000, 200), 75);
  });

  it('150,000 / 2,000 = 75', () => {
    assert.equal(calculateMarginalCost(150000, 2000), 75);
  });

  it('10,000 / 500 = 20', () => {
    assert.equal(calculateMarginalCost(10000, 500), 20);
  });

  it('0 / 100 = 0', () => {
    assert.equal(calculateMarginalCost(0, 100), 0);
  });

  it('-5,000 / 100 = -50', () => {
    assert.equal(calculateMarginalCost(-5000, 100), -50);
  });

  it('-4,000 / -200 = 20', () => {
    assert.equal(calculateMarginalCost(-4000, -200), 20);
  });

  it('2,000 / -100 = -20', () => {
    assert.equal(calculateMarginalCost(2000, -100), -20);
  });

  it('250 / 12.5 = 20', () => {
    assert.equal(calculateMarginalCost(250, 12.5), 20);
  });

  it('ΔQ = 0 → null', () => {
    assert.equal(calculateMarginalCost(5000, 0), null);
    assert.equal(calculateMarginalCost(0, 0), null);
  });

  it('125.50 / 5 = 25.10', () => {
    const mc = calculateMarginalCost(125.5, 5);
    assert.ok(mc !== null);
    assert.ok(Math.abs(mc! - 25.1) < TOL);
  });

  it('initial/final derived: 6000 / 150 = 40', () => {
    assert.equal(calculateMarginalCost(46000 - 40000, 650 - 500), 40);
  });
});

describe('validateMarginalCostInput', () => {
  it('Company Alpha end-to-end', () => {
    const v = validateMarginalCostInput({
      ...createDefaultInput(),
      changeInTotalCost: '15000',
      changeInQuantity: '200',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result?.marginalCost, 75);
    assert.equal(v.result?.status, 'valid');
    assert.ok(v.result?.formattedMarginalCostPerUnit?.includes('/unit'));
  });

  it('zero quantity → unavailable', () => {
    const v = validateMarginalCostInput({
      ...createDefaultInput(),
      changeInTotalCost: '5000',
      changeInQuantity: '0',
    });
    assert.equal(v.isValid, false);
    assert.equal(v.result?.status, 'zeroQuantityChange');
    assert.equal(v.result?.marginalCost, null);
  });

  it('0/0 → indeterminate', () => {
    const v = validateMarginalCostInput({
      ...createDefaultInput(),
      changeInTotalCost: '0',
      changeInQuantity: '0',
    });
    assert.equal(v.result?.status, 'indeterminate');
    assert.equal(v.result?.marginalCost, null);
  });

  it('negative MC', () => {
    const v = validateMarginalCostInput({
      ...createDefaultInput(),
      changeInTotalCost: '-1000',
      changeInQuantity: '100',
    });
    assert.equal(v.result?.marginalCost, -10);
  });

  it('missing inputs → no result', () => {
    const v = validateMarginalCostInput(createDefaultInput());
    assert.equal(v.result, null);
  });

  it('invalid text → error', () => {
    const v = validateMarginalCostInput({
      ...createDefaultInput(),
      changeInTotalCost: 'abc',
      changeInQuantity: '10',
    });
    assert.ok(v.errors.changeInTotalCost);
    assert.equal(v.result, null);
  });
});
