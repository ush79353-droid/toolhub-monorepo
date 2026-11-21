import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateCompoundingMonthlyGrowthRate,
  calculateMonthOverMonth,
  calculatePercentageChange,
  calculateQuarterOverQuarter,
  calculateYearOverYear,
  convertDurationToMonths,
  formatGrowthPercent,
} from './calculation';
import { createDefaultInput } from './types';
import { validateMonthOverMonthInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-6) {
  assert.ok(actual !== null, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculatePercentageChange / MoM', () => {
  it('positive MoM 100 → 120 = +20%', () => {
    nearly(calculatePercentageChange(100, 120), 20);
    nearly(calculateMonthOverMonth(100, 120)!.percent, 20);
  });

  it('negative MoM 100 → 85 = -15%', () => {
    nearly(calculateMonthOverMonth(100, 85)!.percent, -15);
  });

  it('zero MoM', () => {
    nearly(calculateMonthOverMonth(100, 100)!.percent, 0);
  });

  it('zero baseline → unavailable', () => {
    const r = calculateMonthOverMonth(0, 100)!;
    assert.equal(r.status, 'zeroBaseline');
    assert.equal(r.formatted, '');
  });

  it('both zero → indeterminate', () => {
    const r = calculateMonthOverMonth(0, 0)!;
    assert.equal(r.status, 'indeterminate');
  });

  it('signed negative baseline -100 → -50 = -50%', () => {
    nearly(calculateMonthOverMonth(-100, -50)!.percent, -50);
    assert.equal(calculateMonthOverMonth(-100, -50)!.status, 'negativeBaseline');
  });

  it('FAQ: 80k → 100k = +25%', () => {
    nearly(calculatePercentageChange(80_000, 100_000), 25);
  });

  it('FAQ: 50k → 40k traffic = -20%', () => {
    nearly(calculatePercentageChange(50_000, 40_000), -20);
  });
});

describe('CMGR', () => {
  it('100 → 121 over 2 months = +10%', () => {
    nearly(calculateCompoundingMonthlyGrowthRate(100, 121, 2), 10);
  });

  it('100 → 81 over 2 months = -10%', () => {
    nearly(calculateCompoundingMonthlyGrowthRate(100, 81, 2), -10);
  });

  it('no growth → 0%', () => {
    nearly(calculateCompoundingMonthlyGrowthRate(100, 100, 12), 0);
  });

  it('doubling over 12 months ≈ 5.9463%', () => {
    nearly(
      calculateCompoundingMonthlyGrowthRate(100, 200, 12),
      (Math.pow(2, 1 / 12) - 1) * 100
    );
  });

  it('Company Alpha 50k → 100k / 12 ≈ 5.95%', () => {
    const cmgr = calculateCompoundingMonthlyGrowthRate(50_000, 100_000, 12)!;
    nearly(cmgr, (Math.pow(2, 1 / 12) - 1) * 100);
    assert.equal(formatGrowthPercent(cmgr), '+5.95');
  });

  it('final zero → -100%', () => {
    nearly(calculateCompoundingMonthlyGrowthRate(100, 0, 12), -100);
  });

  it('zero / negative initial → null', () => {
    assert.equal(calculateCompoundingMonthlyGrowthRate(0, 100, 12), null);
    assert.equal(calculateCompoundingMonthlyGrowthRate(-100, 100, 12), null);
  });

  it('negative final → null', () => {
    assert.equal(calculateCompoundingMonthlyGrowthRate(100, -100, 12), null);
  });

  it('zero duration → null', () => {
    assert.equal(calculateCompoundingMonthlyGrowthRate(100, 200, 0), null);
  });

  it('years → months conversion', () => {
    nearly(convertDurationToMonths(2, 'years'), 24);
    nearly(convertDurationToMonths(12, 'months'), 12);
  });

  it('CMGR round-trip invariant', () => {
    const vi = 50_000;
    const n = 12;
    const cmgr = calculateCompoundingMonthlyGrowthRate(vi, 100_000, n)!;
    const vf = vi * Math.pow(1 + cmgr / 100, n);
    nearly(vf, 100_000, 1e-4);
  });
});

describe('QoQ and YoY', () => {
  it('QoQ +20% and -15%', () => {
    nearly(calculateQuarterOverQuarter(250_000, 300_000)!.percent, 20);
    nearly(calculateQuarterOverQuarter(400_000, 340_000)!.percent, -15);
  });

  it('YoY +25% and -10%', () => {
    nearly(calculateYearOverYear(1_000_000, 1_250_000)!.percent, 25);
    nearly(calculateYearOverYear(800_000, 720_000)!.percent, -10);
  });
});

describe('validateMonthOverMonthInput', () => {
  it('validates MoM + CMGR independently', () => {
    const { isValid, result, errors } = validateMonthOverMonthInput({
      ...createDefaultInput(),
      month1: '100000',
      month2: '120000',
      cmgrInitial: '50000',
      cmgrFinal: '100000',
      cmgrDuration: '12',
      cmgrDurationUnit: 'months',
    });
    assert.equal(isValid, true);
    nearly(result!.mom!.percent, 20);
    nearly(result!.cmgr!.cmgrPercent, (Math.pow(2, 1 / 12) - 1) * 100);
    assert.equal(Object.keys(errors).length, 0);
  });

  it('rejects CMGR zero initial', () => {
    const { errors, result } = validateMonthOverMonthInput({
      ...createDefaultInput(),
      cmgrInitial: '0',
      cmgrFinal: '100',
      cmgrDuration: '12',
    });
    assert.ok(errors.cmgrInitial);
    assert.equal(result?.cmgr, null);
  });

  it('year duration converts for CMGR', () => {
    const { result } = validateMonthOverMonthInput({
      ...createDefaultInput(),
      cmgrInitial: '100',
      cmgrFinal: '200',
      cmgrDuration: '1',
      cmgrDurationUnit: 'years',
    });
    nearly(result!.cmgr!.months, 12);
    nearly(result!.cmgr!.cmgrPercent, (Math.pow(2, 1 / 12) - 1) * 100);
  });

  it('blank inputs → no results', () => {
    const { result, isValid } = validateMonthOverMonthInput(
      createDefaultInput()
    );
    assert.equal(isValid, false);
    assert.equal(result, null);
  });
});
