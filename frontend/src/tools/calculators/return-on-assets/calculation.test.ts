import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAverageAssets,
  calculateROA,
  formatRoaPercent,
  interpretROA,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateReturnOnAssetsInput } from './validation';

describe('calculateROA', () => {
  it('150000 / 1000000 → 15%', () => {
    const r = calculateROA(150_000, 1_000_000)!;
    assert.equal(r.roaPercentage, 15);
    assert.equal(r.profitPerAssetUnit, 0.15);
  });

  it('high profitability 50%', () => {
    assert.equal(calculateROA(250_000, 500_000)!.roaPercentage, 50);
  });

  it('low profitability 1%', () => {
    assert.equal(calculateROA(10_000, 1_000_000)!.roaPercentage, 1);
  });

  it('zero NI → 0%', () => {
    assert.equal(calculateROA(0, 800_000)!.roaPercentage, 0);
  });

  it('negative NI → -10%', () => {
    assert.equal(calculateROA(-50_000, 500_000)!.roaPercentage, -10);
  });

  it('above 100%', () => {
    assert.equal(calculateROA(150_000, 100_000)!.roaPercentage, 150);
  });

  it('zero assets → null', () => {
    assert.equal(calculateROA(100_000, 0), null);
  });

  it('negative assets → null', () => {
    assert.equal(calculateROA(100_000, -500_000), null);
  });
});

describe('calculateAverageAssets', () => {
  it('(900k + 1.1M) / 2 → 1M', () => {
    assert.equal(calculateAverageAssets(900_000, 1_100_000), 1_000_000);
  });

  it('nonpositive → null', () => {
    assert.equal(calculateAverageAssets(0, 100), null);
  });
});

describe('interpretROA', () => {
  it('bands', () => {
    assert.match(interpretROA(15), /Positive ROA/i);
    assert.match(interpretROA(0), /Zero ROA/i);
    assert.match(interpretROA(-10), /Negative ROA/i);
    assert.match(interpretROA(50), /relatively high/i);
  });
});

describe('formatting', () => {
  it('formats percent', () => {
    assert.equal(formatRoaPercent(15), '15.00%');
  });
});

describe('validateReturnOnAssetsInput', () => {
  it('defaults → 15%', () => {
    const v = validateReturnOnAssetsInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result!.roaPercentage, 15);
  });

  it('average assets path → 15%', () => {
    const v = validateReturnOnAssetsInput({
      ...createDefaultInput(),
      useAverageAssets: true,
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.roaPercentage, 15);
    assert.equal(v.result!.usedAverageAssets, true);
  });

  it('empty → invalid', () => {
    const v = validateReturnOnAssetsInput(createEmptyInput());
    assert.equal(v.isValid, false);
  });

  it('zero assets error', () => {
    const v = validateReturnOnAssetsInput({
      ...createDefaultInput(),
      totalAssets: '0',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.totalAssets);
  });
});
