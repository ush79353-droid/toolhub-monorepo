import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateGiniCoefficient,
  calculateGiniFromIncomes,
  giniIndexFromCoefficient,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
  createIncomeExampleInput,
} from './types';
import { validateGiniInput } from './validation';

describe('Gini area formula', () => {
  it('1200/3800 → 0.24', () => {
    assert.equal(calculateGiniCoefficient(1200, 3800), 0.24);
  });

  it('perfect equality', () => {
    assert.equal(calculateGiniCoefficient(0, 5000), 0);
  });

  it('high inequality 0.8', () => {
    assert.equal(calculateGiniCoefficient(4000, 1000), 0.8);
  });

  it('max area model → 1', () => {
    assert.equal(calculateGiniCoefficient(5000, 0), 1);
  });

  it('0.5 and 0.2 and 0.3', () => {
    assert.equal(calculateGiniCoefficient(2500, 2500), 0.5);
    assert.equal(calculateGiniCoefficient(1000, 4000), 0.2);
    assert.equal(calculateGiniCoefficient(300, 700), 0.3);
  });

  it('rejects both zero / negative', () => {
    assert.throws(() => calculateGiniCoefficient(0, 0));
    assert.throws(() => calculateGiniCoefficient(-1, 1));
  });

  it('gini index', () => {
    assert.equal(giniIndexFromCoefficient(0.24), 24);
  });
});

describe('Gini from incomes', () => {
  it('equal incomes → 0', () => {
    assert.ok(Math.abs(calculateGiniFromIncomes([10, 10, 10, 10])) < 1e-12);
  });

  it('example incomes finite', () => {
    const g = calculateGiniFromIncomes([
      10000, 20000, 30000, 40000, 100000,
    ]);
    assert.ok(g > 0 && g < 1);
  });

  it('rejects single observation', () => {
    assert.throws(() => calculateGiniFromIncomes([1]));
  });
});

describe('validateGiniInput', () => {
  it('empty invalid', () => {
    assert.equal(validateGiniInput(createEmptyInput()).isValid, false);
    assert.equal(validateGiniInput(createDefaultInput()).isValid, false);
  });

  it('example areas → 0.24', () => {
    const v = validateGiniInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result?.giniCoefficient, 0.24);
    assert.equal(v.result?.giniIndex, 24);
    assert.equal(v.result?.lorenz.kind, 'illustrative');
  });

  it('income mode', () => {
    const v = validateGiniInput(createIncomeExampleInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result?.lorenz.kind, 'from-data');
    assert.equal(v.result?.observationCount, 5);
  });
});
