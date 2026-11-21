import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAverageWorkingCapital,
  calculateChangeInWorkingCapital,
  calculateWorkingCapital,
  calculateWorkingCapitalRatio,
  calculateWorkingCapitalTurnover,
} from './calculation';
import { createDefaultInput } from './types';
import { validateWorkingCapitalInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-9) {
  assert.ok(actual !== null, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateWorkingCapital', () => {
  it('positive WC', () => {
    nearly(calculateWorkingCapital(300_000, 150_000), 150_000);
  });

  it('negative WC preserved', () => {
    nearly(calculateWorkingCapital(100_000, 200_000), -100_000);
  });

  it('zero WC', () => {
    nearly(calculateWorkingCapital(200_000, 200_000), 0);
  });

  it('decimals', () => {
    nearly(calculateWorkingCapital(125_500.5, 75_250.25), 50_250.25);
  });
});

describe('calculateWorkingCapitalRatio', () => {
  it('2.00', () => {
    nearly(calculateWorkingCapitalRatio(300_000, 150_000), 2);
  });

  it('0.50 with negative WC', () => {
    nearly(calculateWorkingCapitalRatio(100_000, 200_000), 0.5);
  });

  it('unavailable at zero CL', () => {
    assert.equal(calculateWorkingCapitalRatio(100_000, 0), null);
  });
});

describe('turnover formulas', () => {
  it('Company Alpha', () => {
    nearly(calculateWorkingCapital(400_000, 250_000), 150_000);
    nearly(calculateWorkingCapital(500_000, 300_000), 200_000);
    nearly(calculateAverageWorkingCapital(150_000, 200_000), 175_000);
    nearly(calculateChangeInWorkingCapital(150_000, 200_000), 50_000);
    nearly(
      calculateWorkingCapitalTurnover(1_500_000, 175_000),
      1_500_000 / 175_000
    );
  });

  it('zero average → unavailable', () => {
    assert.equal(calculateWorkingCapitalTurnover(100_000, 0), null);
  });

  it('zero revenue → 0', () => {
    nearly(calculateWorkingCapitalTurnover(0, 175_000), 0);
  });

  it('negative average yields signed turnover', () => {
    nearly(calculateWorkingCapitalTurnover(100_000, -50_000), -2);
  });
});

describe('validateWorkingCapitalInput', () => {
  it('basic positive', () => {
    const { isValid, result } = validateWorkingCapitalInput({
      ...createDefaultInput(),
      currentAssets: '300000',
      currentLiabilities: '150000',
    });
    assert.equal(isValid, true);
    nearly(result!.workingCapital!, 150_000);
    nearly(result!.workingCapitalRatio!, 2);
  });

  it('preserves negative WC', () => {
    const { result } = validateWorkingCapitalInput({
      ...createDefaultInput(),
      currentAssets: '100000',
      currentLiabilities: '200000',
    });
    nearly(result!.workingCapital!, -100_000);
    nearly(result!.workingCapitalRatio!, 0.5);
  });

  it('zero CL → ratio unavailable, WC shown', () => {
    const { result, errors } = validateWorkingCapitalInput({
      ...createDefaultInput(),
      currentAssets: '100000',
      currentLiabilities: '0',
    });
    nearly(result!.workingCapital!, 100_000);
    assert.equal(result!.workingCapitalRatio, null);
    assert.ok(errors.form);
  });

  it('Company Alpha advanced', () => {
    const { isValid, result } = validateWorkingCapitalInput({
      ...createDefaultInput(),
      revenue: '1500000',
      beginningCurrentAssets: '400000',
      beginningCurrentLiabilities: '250000',
      endingCurrentAssets: '500000',
      endingCurrentLiabilities: '300000',
    });
    assert.equal(isValid, true);
    nearly(result!.beginningWorkingCapital!, 150_000);
    nearly(result!.endingWorkingCapital!, 200_000);
    nearly(result!.averageWorkingCapital!, 175_000);
    nearly(result!.changeInWorkingCapital!, 50_000);
    nearly(result!.workingCapitalTurnoverRatio!, 1_500_000 / 175_000);
  });

  it('empty → no result', () => {
    assert.equal(validateWorkingCapitalInput(createDefaultInput()).result, null);
  });

  it('negative CA rejected', () => {
    const { result, errors } = validateWorkingCapitalInput({
      ...createDefaultInput(),
      currentAssets: '-1',
      currentLiabilities: '100',
    });
    assert.equal(result, null);
    assert.ok(errors.currentAssets);
  });
});
