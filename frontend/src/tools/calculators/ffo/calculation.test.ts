import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateFfoExcludingInterestIncome,
  calculateStandardFfo,
} from './calculation';
import { createDefaultInput } from './types';
import { validateFfoInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-9) {
  assert.ok(actual !== null, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateStandardFfo', () => {
  it('computes worked example 575000', () => {
    nearly(calculateStandardFfo(500_000, 150_000, 125_000, 50_000), 575_000);
  });

  it('computes positive FFO example', () => {
    nearly(calculateStandardFfo(300_000, 100_000, 50_000, 20_000), 370_000);
  });

  it('computes zero FFO', () => {
    nearly(calculateStandardFfo(-50_000, 50_000, 0, 0), 0);
  });

  it('computes negative FFO', () => {
    nearly(calculateStandardFfo(-250_000, 100_000, 0, 0), -150_000);
  });

  it('negative NI with positive FFO', () => {
    nearly(calculateStandardFfo(-100_000, 200_000, 0, 0), 100_000);
  });

  it('no adjustments equals NI', () => {
    nearly(calculateStandardFfo(100_000, 0, 0, 0), 100_000);
  });
});

describe('calculateFfoExcludingInterestIncome', () => {
  it('subtracts interest once', () => {
    nearly(calculateFfoExcludingInterestIncome(575_000, 75_000), 500_000);
  });
});

describe('validateFfoInput', () => {
  it('standard mode ignores interest income for displayed FFO', () => {
    const { isValid, result } = validateFfoInput({
      ...createDefaultInput(),
      netIncome: '500000',
      depreciationAmortization: '150000',
      gainsFromPropertySales: '125000',
      lossesFromPropertySales: '50000',
      interestIncome: '75000',
    });
    assert.equal(isValid, true);
    nearly(result!.standardFfo, 575_000);
    nearly(result!.displayedFfo, 575_000);
    nearly(result!.adjustedFfo!, 500_000);
  });

  it('adjusted mode requires interest and subtracts it', () => {
    const { isValid, result } = validateFfoInput({
      ...createDefaultInput(),
      convention: 'excludeInterestIncome',
      netIncome: '500000',
      depreciationAmortization: '150000',
      gainsFromPropertySales: '125000',
      lossesFromPropertySales: '50000',
      interestIncome: '75000',
    });
    assert.equal(isValid, true);
    nearly(result!.displayedFfo, 500_000);
  });

  it('standard mode works without interest income', () => {
    const { isValid, result } = validateFfoInput({
      ...createDefaultInput(),
      netIncome: '100000',
      depreciationAmortization: '0',
      gainsFromPropertySales: '0',
      lossesFromPropertySales: '0',
    });
    assert.equal(isValid, true);
    nearly(result!.displayedFfo, 100_000);
  });

  it('rejects negative D&A', () => {
    const { isValid, errors } = validateFfoInput({
      ...createDefaultInput(),
      netIncome: '100',
      depreciationAmortization: '-10',
      gainsFromPropertySales: '0',
      lossesFromPropertySales: '0',
    });
    assert.equal(isValid, false);
    assert.ok(errors.depreciationAmortization);
  });

  it('returns incomplete when blank', () => {
    const { isValid, result } = validateFfoInput(createDefaultInput());
    assert.equal(isValid, false);
    assert.equal(result, null);
  });
});
