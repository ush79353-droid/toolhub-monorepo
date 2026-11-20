import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAverageBalance,
  calculateAverageWorkingCapitalFromAverages,
  calculateWorkingCapitalTurnover,
} from './calculation';
import { createDefaultInput } from './types';
import { validateWorkingCapitalTurnoverRatioInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-9) {
  assert.ok(actual !== null, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('averages', () => {
  it('Company Alpha ACA 600k', () => {
    nearly(calculateAverageBalance(500_000, 700_000), 600_000);
  });

  it('Company Alpha ACL 250k', () => {
    nearly(calculateAverageBalance(200_000, 300_000), 250_000);
  });

  it('AWC 350k', () => {
    nearly(
      calculateAverageWorkingCapitalFromAverages(600_000, 250_000),
      350_000
    );
  });

  it('rejects negative opening', () => {
    assert.equal(calculateAverageBalance(-1, 100), null);
  });
});

describe('turnover', () => {
  it('Company Alpha 10.00x', () => {
    nearly(calculateWorkingCapitalTurnover(3_500_000, 350_000), 10);
  });

  it('5.00x', () => {
    nearly(calculateWorkingCapitalTurnover(1_000_000, 200_000), 5);
  });

  it('zero AWC → unavailable', () => {
    assert.equal(calculateWorkingCapitalTurnover(1_000_000, 0), null);
  });

  it('negative AWC → signed', () => {
    nearly(calculateWorkingCapitalTurnover(1_000_000, -100_000), -10);
  });

  it('zero revenue → 0', () => {
    nearly(calculateWorkingCapitalTurnover(0, 200_000), 0);
  });
});

describe('validateWorkingCapitalTurnoverRatioInput', () => {
  it('Company Alpha full', () => {
    const { isValid, result } = validateWorkingCapitalTurnoverRatioInput({
      ...createDefaultInput(),
      openingCurrentAssets: '500000',
      closingCurrentAssets: '700000',
      openingCurrentLiabilities: '200000',
      closingCurrentLiabilities: '300000',
      revenue: '3500000',
    });
    assert.equal(isValid, true);
    nearly(result!.averageCurrentAssets, 600_000);
    nearly(result!.averageCurrentLiabilities, 250_000);
    nearly(result!.averageWorkingCapital, 350_000);
    nearly(result!.workingCapitalTurnover!, 10);
  });

  it('partial without revenue', () => {
    const { isValid, result } = validateWorkingCapitalTurnoverRatioInput({
      ...createDefaultInput(),
      openingCurrentAssets: '500000',
      closingCurrentAssets: '700000',
      openingCurrentLiabilities: '200000',
      closingCurrentLiabilities: '300000',
      revenue: '',
    });
    assert.equal(isValid, true);
    assert.equal(result!.status, 'partial');
    nearly(result!.averageWorkingCapital, 350_000);
    assert.equal(result!.workingCapitalTurnover, null);
  });

  it('zero AWC', () => {
    const { isValid, result, errors } =
      validateWorkingCapitalTurnoverRatioInput({
        ...createDefaultInput(),
        openingCurrentAssets: '200000',
        closingCurrentAssets: '200000',
        openingCurrentLiabilities: '200000',
        closingCurrentLiabilities: '200000',
        revenue: '1000000',
      });
    assert.equal(isValid, false);
    assert.equal(result!.status, 'zeroAverageWc');
    assert.equal(result!.workingCapitalTurnover, null);
    assert.ok(errors.form);
  });

  it('negative AWC signed turnover', () => {
    const { result } = validateWorkingCapitalTurnoverRatioInput({
      ...createDefaultInput(),
      openingCurrentAssets: '100000',
      closingCurrentAssets: '100000',
      openingCurrentLiabilities: '200000',
      closingCurrentLiabilities: '200000',
      revenue: '1000000',
    });
    nearly(result!.averageWorkingCapital, -100_000);
    nearly(result!.workingCapitalTurnover!, -10);
    assert.equal(result!.status, 'negativeAverageWc');
  });

  it('empty → no result', () => {
    assert.equal(
      validateWorkingCapitalTurnoverRatioInput(createDefaultInput()).result,
      null
    );
  });
});
