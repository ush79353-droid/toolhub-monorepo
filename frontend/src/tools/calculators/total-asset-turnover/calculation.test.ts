import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAverageAssets,
  calculateTotalAssetTurnover,
} from './calculation';
import { createDefaultInput } from './types';
import { validateTotalAssetTurnoverInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-9) {
  assert.ok(actual !== null, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateAverageAssets', () => {
  it('Company Alpha average 9M', () => {
    nearly(calculateAverageAssets(8_000_000, 10_000_000), 9_000_000);
  });

  it('equal balances', () => {
    nearly(calculateAverageAssets(1_000_000, 1_000_000), 1_000_000);
  });

  it('increasing assets', () => {
    nearly(calculateAverageAssets(500_000, 700_000), 600_000);
  });

  it('decreasing assets', () => {
    nearly(calculateAverageAssets(900_000, 700_000), 800_000);
  });

  it('decimal assets', () => {
    nearly(calculateAverageAssets(125_500.5, 150_500.5), 138_000.5);
  });

  it('rejects negative beginning', () => {
    assert.equal(calculateAverageAssets(-100_000, 500_000), null);
  });
});

describe('calculateTotalAssetTurnover', () => {
  it('Company Alpha ≈ 1.111111', () => {
    nearly(calculateTotalAssetTurnover(10_000_000, 9_000_000), 10_000_000 / 9_000_000);
  });

  it('2.00× equal assets', () => {
    nearly(calculateTotalAssetTurnover(2_000_000, 1_000_000), 2);
  });

  it('2.00× increasing', () => {
    nearly(calculateTotalAssetTurnover(1_200_000, 600_000), 2);
  });

  it('2.00× decreasing', () => {
    nearly(calculateTotalAssetTurnover(1_600_000, 800_000), 2);
  });

  it('low 0.20×', () => {
    nearly(calculateTotalAssetTurnover(1_000_000, 5_000_000), 0.2);
  });

  it('high 5.00×', () => {
    nearly(calculateTotalAssetTurnover(2_500_000, 500_000), 5);
  });

  it('zero revenue → 0', () => {
    nearly(calculateTotalAssetTurnover(0, 350_000), 0);
  });

  it('zero average → unavailable', () => {
    assert.equal(calculateTotalAssetTurnover(100_000, 0), null);
  });

  it('rejects negative revenue', () => {
    assert.equal(calculateTotalAssetTurnover(-1, 100_000), null);
  });

  it('large company 2.00×', () => {
    nearly(
      calculateTotalAssetTurnover(22_000_000_000, 11_000_000_000),
      2
    );
  });

  it('invariant: turnover × average ≈ revenue', () => {
    const avg = 9_000_000;
    const rev = 10_000_000;
    const tat = calculateTotalAssetTurnover(rev, avg)!;
    nearly(tat * avg, rev, 1e-6);
  });
});

describe('validateTotalAssetTurnoverInput', () => {
  it('Company Alpha full result', () => {
    const { isValid, result } = validateTotalAssetTurnoverInput({
      ...createDefaultInput(),
      beginningAssets: '8000000',
      endingAssets: '10000000',
      revenue: '10000000',
    });
    assert.equal(isValid, true);
    nearly(result!.averageAssets, 9_000_000);
    nearly(result!.totalAssetTurnover!, 10_000_000 / 9_000_000);
    assert.equal(result!.formattedTotalAssetTurnover, '1.1111');
  });

  it('partial average without revenue', () => {
    const { isValid, result } = validateTotalAssetTurnoverInput({
      ...createDefaultInput(),
      beginningAssets: '500000',
      endingAssets: '600000',
      revenue: '',
    });
    assert.equal(isValid, true);
    assert.equal(result!.status, 'partial');
    nearly(result!.averageAssets, 550_000);
    assert.equal(result!.totalAssetTurnover, null);
  });

  it('zero average assets → unavailable', () => {
    const { isValid, result, errors } = validateTotalAssetTurnoverInput({
      ...createDefaultInput(),
      beginningAssets: '0',
      endingAssets: '0',
      revenue: '100000',
    });
    assert.equal(isValid, false);
    assert.equal(result!.status, 'zeroAverageAssets');
    assert.equal(result!.totalAssetTurnover, null);
    assert.ok(errors.form);
  });

  it('zero revenue → 0.00×', () => {
    const { isValid, result } = validateTotalAssetTurnoverInput({
      ...createDefaultInput(),
      beginningAssets: '300000',
      endingAssets: '400000',
      revenue: '0',
    });
    assert.equal(isValid, true);
    nearly(result!.averageAssets, 350_000);
    nearly(result!.totalAssetTurnover!, 0);
  });

  it('negative beginning → error', () => {
    const { result, errors } = validateTotalAssetTurnoverInput({
      ...createDefaultInput(),
      beginningAssets: '-100000',
      endingAssets: '500000',
      revenue: '100000',
    });
    assert.equal(result, null);
    assert.ok(errors.beginningAssets);
  });

  it('missing beginning → no result', () => {
    const { result } = validateTotalAssetTurnoverInput({
      ...createDefaultInput(),
      beginningAssets: '',
      endingAssets: '600000',
      revenue: '1000000',
    });
    assert.equal(result, null);
  });

  it('empty defaults → no result', () => {
    assert.equal(validateTotalAssetTurnoverInput(createDefaultInput()).result, null);
  });
});
