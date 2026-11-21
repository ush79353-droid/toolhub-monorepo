import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  annualizeQuarterlyGrowth,
  calculateCurrentGDP,
  calculateGDPGrowth,
  calculatePreviousGDP,
  toBaseUnits,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
} from './types';
import { validateGdpGrowthInput } from './validation';

describe('GDP growth formulas', () => {
  it('+5% for 21/20', () => {
    assert.equal(calculateGDPGrowth(21, 20), 5);
  });

  it('-5% for 19/20', () => {
    assert.equal(calculateGDPGrowth(19, 20), -5);
  });

  it('0% when equal', () => {
    assert.equal(calculateGDPGrowth(20, 20), 0);
  });

  it('+20% and -20%', () => {
    assert.equal(calculateGDPGrowth(12, 10), 20);
    assert.equal(calculateGDPGrowth(8, 10), -20);
  });

  it('magnitude mix 20,000B → 21T = +5%', () => {
    const cur = toBaseUnits(21, 'trillions');
    const prev = toBaseUnits(20_000, 'billions');
    assert.equal(calculateGDPGrowth(cur, prev), 5);
  });

  it('reverse current and previous', () => {
    assert.equal(calculateCurrentGDP(20, 5), 21);
    assert.equal(calculatePreviousGDP(21, 5), 20);
  });

  it('rejects growth ≤ -100%', () => {
    assert.throws(() => calculateCurrentGDP(20, -100));
    assert.throws(() => calculatePreviousGDP(21, -100));
  });

  it('rejects zero previous', () => {
    assert.throws(() => calculateGDPGrowth(21, 0));
  });

  it('annualized QoQ labeled formula', () => {
    // 1% QoQ ≈ 4.0604% annualized
    const a = annualizeQuarterlyGrowth(101, 100);
    assert.ok(Math.abs(a - ((Math.pow(1.01, 4) - 1) * 100)) < 1e-9);
  });
});

describe('validateGdpGrowthInput', () => {
  it('empty invalid', () => {
    assert.equal(validateGdpGrowthInput(createEmptyInput()).isValid, false);
    assert.equal(validateGdpGrowthInput(createDefaultInput()).isValid, false);
  });

  it('example → +5%', () => {
    const v = validateGdpGrowthInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result?.growthPercent, 5);
    assert.equal(v.result?.statusTitle, 'Economic Expansion');
  });

  it('current mode', () => {
    const input = createEmptyInput('current');
    input.previousGdp = '20';
    input.growthPercent = '5';
    const v = validateGdpGrowthInput(input);
    assert.equal(v.result?.currentBase, toBaseUnits(21, 'trillions'));
  });

  it('previous mode', () => {
    const input = createEmptyInput('previous');
    input.currentGdp = '21';
    input.growthPercent = '5';
    const v = validateGdpGrowthInput(input);
    assert.equal(v.result?.previousBase, toBaseUnits(20, 'trillions'));
  });

  it('annualized only when quarterly + flag', () => {
    const input = createExampleInput();
    input.period = 'quarterly';
    input.annualizeQuarterly = true;
    const v = validateGdpGrowthInput(input);
    assert.ok(v.result?.annualizedGrowth != null);
  });

  it('growth -100 rejected', () => {
    const input = createEmptyInput('current');
    input.previousGdp = '20';
    input.growthPercent = '-100';
    assert.equal(validateGdpGrowthInput(input).isValid, false);
  });
});
