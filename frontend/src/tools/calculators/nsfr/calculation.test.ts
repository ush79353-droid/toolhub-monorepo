import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateASF,
  calculateCoverageMultiple,
  calculateFundingGap,
  calculateFundingShortfall,
  calculateNSFR,
} from './calculation';
import {
  createAsfHelperExampleInput,
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
} from './types';
import { validateNsfrInput } from './validation';

describe('nsfr math', () => {
  it('170M / 150M → 113.333…%', () => {
    const n = calculateNSFR(170_000_000, 150_000_000);
    assert.ok(n != null);
    assert.ok(Math.abs(n - 113.3333333333) < 1e-6);
  });

  it('exact 100%', () => {
    assert.equal(calculateNSFR(150_000_000, 150_000_000), 100);
  });

  it('below 100% → 90%', () => {
    assert.equal(calculateNSFR(135_000_000, 150_000_000), 90);
  });

  it('funding surplus and shortfall', () => {
    assert.equal(calculateFundingGap(170_000_000, 150_000_000), 20_000_000);
    assert.equal(calculateFundingShortfall(135_000_000, 150_000_000), 15_000_000);
    assert.equal(calculateFundingShortfall(170_000_000, 150_000_000), 0);
  });

  it('zero RSF → null', () => {
    assert.equal(calculateNSFR(170_000_000, 0), null);
    assert.equal(calculateCoverageMultiple(170_000_000, 0), null);
  });

  it('negative ASF rejected by NSFR', () => {
    assert.equal(calculateNSFR(-10_000, 150_000), null);
  });

  it('ASF helper example → 50,750,000', () => {
    const a = calculateASF({
      regulatoryCapital: 10_000_000,
      stableDeposits: 15_000_000,
      lessStableDeposits: 20_000_000,
      funding50Percent: 17_000_000,
      funding0Percent: 5_000_000,
    });
    assert.equal(a.weightedTotal, 50_750_000);
  });
});

describe('validateNsfrInput', () => {
  it('empty invalid', () => {
    assert.equal(validateNsfrInput(createEmptyInput()).isValid, false);
    assert.equal(validateNsfrInput(createDefaultInput()).isValid, false);
  });

  it('example → ~113.33%', () => {
    const v = validateNsfrInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.ok(Math.abs(v.result!.nsfrPercent - 113.3333333333) < 1e-6);
    assert.equal(v.result!.fundingGap, 20_000_000);
    assert.equal(v.result!.status, 'above');
  });

  it('zero RSF message', () => {
    const v = validateNsfrInput({
      ...createExampleInput(),
      requiredStableFunding: '0',
    });
    assert.equal(v.isValid, false);
    assert.match(v.errors.requiredStableFunding ?? '', /greater than zero/i);
  });

  it('negative ASF rejected', () => {
    const v = validateNsfrInput({
      ...createExampleInput(),
      availableStableFunding: '-10000',
    });
    assert.equal(v.isValid, false);
  });

  it('ASF helper fills ASF', () => {
    const v = validateNsfrInput(createAsfHelperExampleInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result?.asf, 50_750_000);
    assert.ok(v.result?.asfHelper);
  });
});
