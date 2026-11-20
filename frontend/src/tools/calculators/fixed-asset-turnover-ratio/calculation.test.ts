import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAverageFixedAssets,
  calculateFixedAssetIntensity,
  calculateFixedAssetTurnover,
} from './calculation';
import { createDefaultInput } from './types';
import { validateFixedAssetTurnoverRatioInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-9) {
  assert.ok(actual !== null, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateAverageFixedAssets', () => {
  it('averages starting and final', () => {
    nearly(calculateAverageFixedAssets(15_000_000, 18_000_000), 16_500_000);
  });

  it('rejects negative starting', () => {
    assert.equal(calculateAverageFixedAssets(-100, 100), null);
  });
});

describe('calculateFixedAssetTurnover', () => {
  it('computes reference FAT ≈ 0.454545', () => {
    nearly(calculateFixedAssetTurnover(7_500_000, 16_500_000), 7_500_000 / 16_500_000);
  });

  it('computes high FAT 5.00×', () => {
    nearly(calculateFixedAssetTurnover(2_500_000, 500_000), 5);
  });

  it('computes moderate FAT 2.00×', () => {
    nearly(calculateFixedAssetTurnover(2_000_000, 1_000_000), 2);
  });

  it('computes low FAT 0.20×', () => {
    nearly(calculateFixedAssetTurnover(1_000_000, 5_000_000), 0.2);
  });

  it('allows zero revenue', () => {
    nearly(calculateFixedAssetTurnover(0, 500_000), 0);
  });

  it('is undefined at zero average assets', () => {
    assert.equal(calculateFixedAssetTurnover(100_000, 0), null);
  });

  it('allows negative revenue', () => {
    nearly(calculateFixedAssetTurnover(-20_000, 100_000), -0.2);
  });
});

describe('calculateFixedAssetIntensity', () => {
  it('is reciprocal when revenue > 0', () => {
    nearly(calculateFixedAssetIntensity(500_000, 2_000_000), 0.25);
  });

  it('is undefined at zero revenue', () => {
    assert.equal(calculateFixedAssetIntensity(500_000, 0), null);
  });
});

describe('validateFixedAssetTurnoverRatioInput', () => {
  it('validates Company Alpha', () => {
    const { isValid, result } = validateFixedAssetTurnoverRatioInput({
      ...createDefaultInput(),
      startingFixedAssets: '15000000',
      finalFixedAssets: '18000000',
      revenue: '7500000',
    });
    assert.equal(isValid, true);
    nearly(result!.averageFixedAssets, 16_500_000);
    nearly(result!.fixedAssetTurnover!, 7_500_000 / 16_500_000);
  });

  it('flags zero average assets', () => {
    const { isValid, result, errors } = validateFixedAssetTurnoverRatioInput({
      ...createDefaultInput(),
      startingFixedAssets: '0',
      finalFixedAssets: '0',
      revenue: '100000',
    });
    assert.equal(isValid, false);
    assert.equal(result!.status, 'zeroAverageFixedAssets');
    assert.ok(errors.form);
  });

  it('flags negative revenue', () => {
    const { result } = validateFixedAssetTurnoverRatioInput({
      ...createDefaultInput(),
      startingFixedAssets: '100000',
      finalFixedAssets: '100000',
      revenue: '-20000',
    });
    assert.equal(result!.status, 'negativeRevenue');
    nearly(result!.fixedAssetTurnover!, -0.2);
  });

  it('rejects negative starting assets', () => {
    const { isValid, errors } = validateFixedAssetTurnoverRatioInput({
      ...createDefaultInput(),
      startingFixedAssets: '-100',
      finalFixedAssets: '100',
      revenue: '100',
    });
    assert.equal(isValid, false);
    assert.ok(errors.startingFixedAssets);
  });

  it('returns incomplete when blank', () => {
    const { isValid, result } = validateFixedAssetTurnoverRatioInput(
      createDefaultInput()
    );
    assert.equal(isValid, false);
    assert.equal(result, null);
  });
});
