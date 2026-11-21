import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAfterTaxTaxableYield,
  calculateImpliedMarginalTaxRate,
  calculateTaxEquivalentYield,
  calculateTaxEquivalentYieldFromInput,
  calculateTaxExemptYield,
  formatPercentDisplay,
} from './calculation';
import { createExampleInput, type TaxEquivalentYieldInput } from './types';
import { validateTaxEquivalentYieldInput } from './validation';

function base(
  patch: Partial<TaxEquivalentYieldInput> = {},
): TaxEquivalentYieldInput {
  return { ...createExampleInput(), ...patch };
}

describe('tax equivalent yield', () => {
  it('Test 1: reference 6% / 30% → ≈ 8.57142857%', () => {
    const calc = calculateTaxEquivalentYield({
      bondYieldPercent: 6,
      marginalTaxRatePercent: 30,
    });
    assert.ok(calc);
    assert.ok(Math.abs(calc.taxableEquivalentYieldPercent - 6 / 0.7) < 1e-12);
    assert.equal(calc.taxRetentionFactor, 0.7);
    assert.equal(formatPercentDisplay(calc.taxableEquivalentYieldPercent), '8.57%');
    const r = calculateTaxEquivalentYieldFromInput(createExampleInput());
    assert.ok(r);
    assert.equal(r.formattedTey, '8.57%');
  });

  it('Test 2: tax rate zero → TEY = bond yield', () => {
    const calc = calculateTaxEquivalentYield({
      bondYieldPercent: 5,
      marginalTaxRatePercent: 0,
    });
    assert.ok(calc);
    assert.equal(calc.taxableEquivalentYieldPercent, 5);
  });

  it('Test 3: 4% / 25% → ≈ 5.333…%', () => {
    const calc = calculateTaxEquivalentYield({
      bondYieldPercent: 4,
      marginalTaxRatePercent: 25,
    });
    assert.ok(calc);
    assert.ok(Math.abs(calc.taxableEquivalentYieldPercent - 4 / 0.75) < 1e-12);
    assert.equal(formatPercentDisplay(calc.taxableEquivalentYieldPercent), '5.33%');
  });

  it('Test 4: 3% / 40% → 5%', () => {
    const calc = calculateTaxEquivalentYield({
      bondYieldPercent: 3,
      marginalTaxRatePercent: 40,
    });
    assert.ok(calc);
    assert.equal(calc.taxableEquivalentYieldPercent, 5);
  });

  it('Test 5: zero bond yield → 0%', () => {
    const calc = calculateTaxEquivalentYield({
      bondYieldPercent: 0,
      marginalTaxRatePercent: 30,
    });
    assert.ok(calc);
    assert.equal(calc.taxableEquivalentYieldPercent, 0);
  });

  it('Test 6: tax rate 100% rejected', () => {
    assert.equal(
      calculateTaxEquivalentYield({
        bondYieldPercent: 6,
        marginalTaxRatePercent: 100,
      }),
      null,
    );
    const v = validateTaxEquivalentYieldInput(
      base({ marginalTaxRatePercent: '100' }),
    );
    assert.equal(v.isValid, false);
    assert.match(v.errors.marginalTaxRatePercent ?? '', /undefined|denominator/i);
  });

  it('Test 7: negative tax rate rejected', () => {
    const v = validateTaxEquivalentYieldInput(
      base({ marginalTaxRatePercent: '-5' }),
    );
    assert.equal(v.isValid, false);
  });

  it('Test 8: reverse bond yield 8% TEY @ 25% → 6%', () => {
    assert.equal(calculateTaxExemptYield(8, 25), 6);
    const r = calculateTaxEquivalentYieldFromInput(
      base({
        solveTarget: 'taxExemptYield',
        taxableEquivalentYieldPercent: '8',
        marginalTaxRatePercent: '25',
        bondYieldPercent: '',
      }),
    );
    assert.ok(r);
    assert.equal(r.bondYieldPercent, 6);
  });

  it('Test 9: reverse tax rate 6% / 8% → 25%', () => {
    assert.equal(calculateImpliedMarginalTaxRate(6, 8), 25);
    const r = calculateTaxEquivalentYieldFromInput(
      base({
        solveTarget: 'impliedTaxRate',
        bondYieldPercent: '6',
        taxableEquivalentYieldPercent: '8',
        marginalTaxRatePercent: '',
      }),
    );
    assert.ok(r);
    assert.equal(r.marginalTaxRatePercent, 25);
  });

  it('Test 10: after-tax taxable yield 7.5% @ 30% → 5.25%', () => {
    assert.equal(calculateAfterTaxTaxableYield(7.5, 30), 5.25);
    const r = calculateTaxEquivalentYieldFromInput(
      base({
        showComparison: true,
        taxableInvestmentYieldPercent: '7.5',
      }),
    );
    assert.ok(r?.comparison);
    assert.equal(r.comparison.afterTaxTaxableYieldPercent, 5.25);
    assert.ok(Math.abs(r.comparison.differencePp - 0.75) < 1e-12);
  });
});
