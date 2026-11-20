import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateConstantElasticity,
  calculateImpliedMarginalRevenue,
  calculateOptimalPrice,
  calculateOptimalQuantity,
  calculateProfitAtPrice,
} from './calculation';
import { createDefaultInput } from './types';
import { validateOptimalPriceInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-6) {
  assert.ok(actual !== null, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateOptimalPrice', () => {
  it('MC 40, ε -2 → 80', () => {
    nearly(calculateOptimalPrice(40, -2), 80);
  });

  it('MC 30, ε -3 → 45', () => {
    nearly(calculateOptimalPrice(30, -3), 45);
  });

  it('MC 20, ε -1.5 → 60', () => {
    nearly(calculateOptimalPrice(20, -1.5), 60);
  });

  it('MC 50, ε -4 → 66.666…', () => {
    nearly(calculateOptimalPrice(50, -4), 50 * (4 / 3));
  });

  it('unit / inelastic / positive / zero MC → null', () => {
    assert.equal(calculateOptimalPrice(40, -1), null);
    assert.equal(calculateOptimalPrice(40, -0.5), null);
    assert.equal(calculateOptimalPrice(40, 1.5), null);
    assert.equal(calculateOptimalPrice(0, -2), null);
    assert.equal(calculateOptimalPrice(-10, -2), null);
  });
});

describe('elasticity and quantity', () => {
  it('Company Alpha: 100/100 → 125/64 → ε = -2', () => {
    nearly(calculateConstantElasticity(100, 100, 125, 64), -2);
  });

  it('optimal quantity 156.25', () => {
    nearly(calculateOptimalQuantity(100, 100, 80, -2), 156.25);
  });

  it('MR at optimum equals MC', () => {
    nearly(calculateImpliedMarginalRevenue(80, -2), 40);
  });
});

describe('profits', () => {
  it('initial / final / optimal profits', () => {
    nearly(calculateProfitAtPrice(100, 100, 40), 6000);
    nearly(calculateProfitAtPrice(125, 64, 40), 5440);
    nearly(calculateProfitAtPrice(80, 156.25, 40), 6250);
  });
});

describe('validateOptimalPriceInput', () => {
  it('Company Alpha end-to-end', () => {
    const { isValid, result } = validateOptimalPriceInput({
      ...createDefaultInput(),
      marginalCost: '40',
      initialPrice: '100',
      initialQuantity: '100',
      finalPrice: '125',
      finalQuantity: '64',
    });
    assert.equal(isValid, true);
    nearly(result!.constantElasticity, -2);
    nearly(result!.optimalPrice, 80);
    nearly(result!.optimalQuantity, 156.25);
    nearly(result!.profitAtInitial, 6000);
    nearly(result!.profitAtFinal, 5440);
    nearly(result!.profitAtOptimal, 6250);
  });

  it('unit elastic → no finite optimum but still returns elasticity', () => {
    // Craft points with ε ≈ -1: Q2/Q1 = P1/P2
    const { result, isValid } = validateOptimalPriceInput({
      ...createDefaultInput(),
      marginalCost: '40',
      initialPrice: '100',
      initialQuantity: '100',
      finalPrice: '110',
      finalQuantity: String(100 * (100 / 110)),
    });
    assert.equal(isValid, false);
    assert.ok(result);
    assert.equal(result!.status, 'noFiniteOptimum');
    assert.equal(result!.optimalPrice, null);
    nearly(result!.constantElasticity, -1, 1e-4);
  });

  it('equal prices → error', () => {
    const { errors, result } = validateOptimalPriceInput({
      ...createDefaultInput(),
      marginalCost: '40',
      initialPrice: '100',
      initialQuantity: '100',
      finalPrice: '100',
      finalQuantity: '90',
    });
    assert.ok(errors.finalPrice);
    assert.equal(result, null);
  });

  it('negative MC → error', () => {
    const { errors } = validateOptimalPriceInput({
      ...createDefaultInput(),
      marginalCost: '-10',
      initialPrice: '100',
      initialQuantity: '100',
      finalPrice: '125',
      finalQuantity: '64',
    });
    assert.ok(errors.marginalCost);
  });

  it('MR inconsistency warning', () => {
    const { result } = validateOptimalPriceInput({
      ...createDefaultInput(),
      marginalCost: '40',
      marginalRevenue: '70',
      initialPrice: '100',
      initialQuantity: '100',
      finalPrice: '125',
      finalQuantity: '64',
    });
    assert.equal(result!.status, 'mrInconsistent');
    nearly(result!.impliedMarginalRevenueAtInitial, 50);
    nearly(result!.optimalPrice, 80);
  });
});
