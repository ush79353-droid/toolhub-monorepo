import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateEstimatedEligibleHQLA,
  calculateLiquidityCoverageRatio,
  calculateNetCashOutflows,
  calculatePreliminaryHQLA,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
  createHqlaHelperExampleInput,
} from './types';
import { validateLcrInput } from './validation';

describe('LCR formula', () => {
  it('1.75M / 1.5M → 116.67%', () => {
    const r = calculateLiquidityCoverageRatio(1_750_000, 1_500_000);
    assert.ok(r != null);
    assert.ok(Math.abs(r! - 116.6666666667) < 1e-6);
  });

  it('table fixtures', () => {
    assert.equal(calculateLiquidityCoverageRatio(1_000_000, 1_000_000), 100);
    assert.equal(calculateLiquidityCoverageRatio(750_000, 1_000_000), 75);
    assert.equal(calculateLiquidityCoverageRatio(2_000_000, 1_000_000), 200);
    assert.equal(calculateLiquidityCoverageRatio(0, 1_000_000), 0);
    assert.equal(calculateLiquidityCoverageRatio(500_000, 0), null);
  });
});

describe('HQLA helper', () => {
  it('preliminary haircuts', () => {
    const p = calculatePreliminaryHQLA(1_000_000, 500_000, 200_000, 100_000);
    // 1M + 0.85*500k + 0.75*200k + 0.5*100k = 1M + 425k + 150k + 50k = 1.625M
    assert.equal(p, 1_625_000);
  });

  it('applies composition caps when needed', () => {
    const est = calculateEstimatedEligibleHQLA(100_000, 1_000_000, 500_000, 0);
    assert.ok(est.afterCaps <= est.preliminary + 1e-9);
    assert.ok(est.cappedByLevel2 || est.cappedByLevel2B);
  });

  it('rejects negatives', () => {
    assert.throws(() => calculatePreliminaryHQLA(-1, 0, 0, 0));
  });
});

describe('net outflows helper', () => {
  it('75% inflow cap', () => {
    // Out 1000, In 900 → capped 750 → net 250
    assert.equal(calculateNetCashOutflows(1000, 900), 250);
    assert.equal(calculateNetCashOutflows(1000, 100), 900);
  });
});

describe('validateLcrInput', () => {
  it('empty invalid', () => {
    assert.equal(validateLcrInput(createEmptyInput()).isValid, false);
    assert.equal(validateLcrInput(createDefaultInput()).isValid, false);
  });

  it('example → 116.67%', () => {
    const v = validateLcrInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.ok(Math.abs(v.result!.lcrPercent - 116.6666666667) < 1e-6);
    assert.equal(v.result?.status, 'above');
    assert.equal(v.result?.additionalHqlaNeeded, 0);
    assert.equal(v.result?.liquidityDifference, 250_000);
  });

  it('below 100% needs additional HQLA', () => {
    const v = validateLcrInput({
      ...createDefaultInput(),
      highQualityLiquidAssets: '750000',
      netCashOutflows30Days: '1000000',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result?.lcrPercent, 75);
    assert.equal(v.result?.additionalHqlaNeeded, 250_000);
    assert.equal(v.result?.status, 'below');
  });

  it('HQLA helper populates main HQLA when blank', () => {
    const v = validateLcrInput(createHqlaHelperExampleInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result?.hqlaHelper != null);
    assert.ok(v.result!.hqla > 0);
  });

  it('rejects negative / zero outflows', () => {
    assert.equal(
      validateLcrInput({
        ...createExampleInput(),
        highQualityLiquidAssets: '-1',
      }).isValid,
      false
    );
    assert.equal(
      validateLcrInput({
        ...createExampleInput(),
        netCashOutflows30Days: '0',
      }).isValid,
      false
    );
  });
});
