import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateEarningsGrowthPercent,
  calculateEps,
  calculatePegFromPeAndGrowth,
  calculatePeRatio,
  formatPercent,
  formatRatio,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validatePegRatioInput } from './validation';

describe('calculateEps', () => {
  it('15,500,000 / 1,000,000 → 15.50', () => {
    assert.equal(calculateEps(15_500_000, 1_000_000), 15.5);
  });

  it('zero shares → null', () => {
    assert.equal(calculateEps(100, 0), null);
  });

  it('negative net earnings → negative EPS', () => {
    assert.equal(calculateEps(-1_000_000, 100_000), -10);
  });
});

describe('calculatePeRatio', () => {
  it('250 / 15.50 ≈ 16.1290', () => {
    const pe = calculatePeRatio(250, 15.5);
    assert.ok(pe);
    assert.ok(Math.abs(pe! - 16.129032258064516) < 1e-9);
  });

  it('zero EPS → null', () => {
    assert.equal(calculatePeRatio(250, 0), null);
  });

  it('negative EPS → null', () => {
    assert.equal(calculatePeRatio(250, -1), null);
  });
});

describe('calculateEarningsGrowthPercent', () => {
  it('60% × 8% → 4.8%', () => {
    assert.equal(calculateEarningsGrowthPercent(60, 8), 4.8);
  });

  it('zero retention → 0%', () => {
    assert.equal(calculateEarningsGrowthPercent(0, 8), 0);
  });

  it('100% retention valid', () => {
    assert.equal(calculateEarningsGrowthPercent(100, 10), 10);
  });

  it('invalid retention → null', () => {
    assert.equal(calculateEarningsGrowthPercent(-1, 8), null);
    assert.equal(calculateEarningsGrowthPercent(101, 8), null);
  });

  it('negative ROE → negative growth', () => {
    assert.equal(calculateEarningsGrowthPercent(50, -10), -5);
  });
});

describe('calculatePegFromPeAndGrowth', () => {
  it('16.1290 / 4.8 ≈ 3.3602', () => {
    const pe = 250 / 15.5;
    const peg = calculatePegFromPeAndGrowth(pe, 4.8);
    assert.ok(peg);
    assert.ok(Math.abs(peg! - pe / 4.8) < 1e-12);
    assert.ok(Math.abs(peg! - 3.360215053763441) < 1e-9);
  });

  it('zero growth → null', () => {
    assert.equal(calculatePegFromPeAndGrowth(16, 0), null);
  });

  it('negative growth → null', () => {
    assert.equal(calculatePegFromPeAndGrowth(16, -1), null);
  });
});

describe('formatting', () => {
  it('formats ratio and percent', () => {
    assert.equal(formatRatio(16.129032258064516), '16.129');
    assert.equal(formatPercent(4.8), '4.80');
  });
});

describe('validatePegRatioInput', () => {
  it('defaults → PEG ≈ 3.36', () => {
    const v = validatePegRatioInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.ok(v.result!.peRatio);
    assert.ok(Math.abs(v.result!.peRatio! - 250 / 15.5) < 1e-9);
    assert.equal(v.result!.earningsGrowthPercent, 4.8);
    assert.ok(v.result!.pegRatio);
    assert.ok(
      Math.abs(v.result!.pegRatio! - 250 / 15.5 / 4.8) < 1e-9
    );
  });

  it('calculated EPS path', () => {
    const v = validatePegRatioInput({
      ...createDefaultInput(),
      calculateEps: true,
      earningsPerShare: '',
    });
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result!.earningsPerShare, 15.5);
  });

  it('empty → invalid', () => {
    const v = validatePegRatioInput(createEmptyInput());
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });

  it('zero EPS → no PE/PEG', () => {
    const v = validatePegRatioInput({
      ...createDefaultInput(),
      earningsPerShare: '0',
    });
    assert.ok(v.result);
    assert.equal(v.result!.peRatio, null);
    assert.equal(v.result!.pegRatio, null);
    assert.ok(v.result!.peUnavailableReason);
  });

  it('zero growth → no PEG', () => {
    const v = validatePegRatioInput({
      ...createDefaultInput(),
      retentionRate: '0',
    });
    assert.ok(v.result);
    assert.ok(v.result!.peRatio);
    assert.equal(v.result!.earningsGrowthPercent, 0);
    assert.equal(v.result!.pegRatio, null);
  });

  it('retention above 100 rejected', () => {
    const v = validatePegRatioInput({
      ...createDefaultInput(),
      retentionRate: '120',
    });
    assert.ok(v.errors.retentionRate);
  });
});
