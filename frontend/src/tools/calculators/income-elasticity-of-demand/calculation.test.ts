import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateIncomeElasticity,
  calculateIncomePercentageChange,
  calculateMidpointPercentageChange,
  calculateQuantityPercentageChange,
  calculateStandardPercentageChange,
  classifyIncomeElasticity,
} from './calculation';
import { createDefaultInput } from './types';
import { validateIncomeElasticityOfDemandInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-6) {
  assert.ok(actual !== null, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('percentage changes', () => {
  it('standard income +20%', () => {
    nearly(calculateStandardPercentageChange(1000, 1200), 20);
  });

  it('standard quantity +30%', () => {
    nearly(calculateStandardPercentageChange(100, 130), 30);
  });

  it('midpoint income ≈ 18.1818%', () => {
    nearly(calculateMidpointPercentageChange(1000, 1200), (200 / 1100) * 100);
  });

  it('midpoint quantity ≈ 26.087%', () => {
    nearly(calculateMidpointPercentageChange(100, 130), (30 / 115) * 100);
  });

  it('midpoint quantity 0 → 100 = +200%', () => {
    nearly(calculateMidpointPercentageChange(0, 100), 200);
  });

  it('midpoint both quantities 0 undefined', () => {
    assert.equal(calculateMidpointPercentageChange(0, 0), null);
  });
});

describe('calculateIncomeElasticity', () => {
  it('standard YED 1.50', () => {
    nearly(calculateIncomeElasticity(30, 20), 1.5);
  });

  it('midpoint YED ≈ 1.43478', () => {
    const dy = calculateIncomePercentageChange(1000, 1200, 'midpoint')!;
    const dq = calculateQuantityPercentageChange(100, 130, 'midpoint')!;
    nearly(calculateIncomeElasticity(dq, dy), dq / dy);
  });

  it('necessity 0.50', () => {
    nearly(calculateIncomeElasticity(10, 20), 0.5);
  });

  it('luxury 2.50', () => {
    nearly(calculateIncomeElasticity(25, 10), 2.5);
  });

  it('inferior -0.50', () => {
    nearly(calculateIncomeElasticity(-10, 20), -0.5);
  });

  it('zero quantity response → 0', () => {
    nearly(calculateIncomeElasticity(0, 10), 0);
  });

  it('zero income change → undefined', () => {
    assert.equal(calculateIncomeElasticity(20, 0), null);
  });
});

describe('classifyIncomeElasticity', () => {
  it('classifies bands', () => {
    assert.equal(classifyIncomeElasticity(-0.5), 'inferior');
    assert.equal(classifyIncomeElasticity(0), 'zeroElasticity');
    assert.equal(classifyIncomeElasticity(0.5), 'normalNecessity');
    assert.equal(classifyIncomeElasticity(1), 'unitIncomeElasticity');
    assert.equal(classifyIncomeElasticity(1.5), 'incomeElasticNormal');
  });
});

describe('validateIncomeElasticityOfDemandInput', () => {
  it('validates standard example', () => {
    const { isValid, result } = validateIncomeElasticityOfDemandInput({
      ...createDefaultInput(),
      incomePeriod1: '1000',
      incomePeriod2: '1200',
      quantityPeriod1: '100',
      quantityPeriod2: '130',
    });
    assert.equal(isValid, true);
    nearly(result!.incomeElasticityOfDemand!, 1.5);
    assert.equal(result!.classification, 'incomeElasticNormal');
  });

  it('validates midpoint example', () => {
    const { isValid, result } = validateIncomeElasticityOfDemandInput({
      ...createDefaultInput(),
      method: 'midpoint',
      incomePeriod1: '1000',
      incomePeriod2: '1200',
      quantityPeriod1: '100',
      quantityPeriod2: '130',
    });
    assert.equal(isValid, true);
    const expected =
      ((30 / 115) * 100) / ((200 / 1100) * 100);
    nearly(result!.incomeElasticityOfDemand!, expected);
  });

  it('flags zero income change', () => {
    const { isValid, result, errors } = validateIncomeElasticityOfDemandInput({
      ...createDefaultInput(),
      incomePeriod1: '1000',
      incomePeriod2: '1000',
      quantityPeriod1: '100',
      quantityPeriod2: '120',
    });
    assert.equal(isValid, false);
    assert.equal(result!.status, 'zeroIncomeChange');
    assert.ok(errors.form);
  });

  it('rejects negative quantity', () => {
    const { isValid, errors } = validateIncomeElasticityOfDemandInput({
      ...createDefaultInput(),
      incomePeriod1: '1000',
      incomePeriod2: '1200',
      quantityPeriod1: '100',
      quantityPeriod2: '-10',
    });
    assert.equal(isValid, false);
    assert.ok(errors.quantityPeriod2);
  });

  it('midpoint reverse periods keep same YED', () => {
    const a = validateIncomeElasticityOfDemandInput({
      ...createDefaultInput(),
      method: 'midpoint',
      incomePeriod1: '1000',
      incomePeriod2: '1200',
      quantityPeriod1: '100',
      quantityPeriod2: '130',
    });
    const b = validateIncomeElasticityOfDemandInput({
      ...createDefaultInput(),
      method: 'midpoint',
      incomePeriod1: '1200',
      incomePeriod2: '1000',
      quantityPeriod1: '130',
      quantityPeriod2: '100',
    });
    nearly(
      a.result!.incomeElasticityOfDemand!,
      b.result!.incomeElasticityOfDemand!
    );
  });

  it('returns incomplete when blank', () => {
    const { isValid, result } = validateIncomeElasticityOfDemandInput(
      createDefaultInput()
    );
    assert.equal(isValid, false);
    assert.equal(result, null);
  });
});
