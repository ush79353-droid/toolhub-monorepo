import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateInflationAdjustedValue,
  calculateMillionaireGoal,
  calculatePeriodsToGoal,
  calculatePeriodicInterestRate,
  calculateSavingsFutureValue,
} from './calculation';
import { validateMillionaireInput } from './validation';
import { createBlankInput, createDefaultInput } from './types';

const base = {
  targetAmount: 1_000_000,
  initialSavings: 20_000,
  annualInterestRatePercent: 4,
  compoundFrequency: 'monthly' as const,
  additionalDeposit: 1_000,
  depositTiming: 'end' as const,
  inflationRatePercent: 2,
  currency: 'USD' as const,
};

describe('millionaire default configuration', () => {
  it('produces a reachable duration with contributions and inflation', () => {
    const result = calculateMillionaireGoal(base);
    assert.ok(result);
    assert.equal(result!.goalReachable, true);
    assert.equal(result!.goalAlreadyAchieved, false);
    assert.ok(result!.totalPeriods > 0);
    assert.ok(result!.finalSavings >= 1_000_000);
    assert.ok(result!.totalContributions > 0);
    assert.ok(result!.totalInterest > 0);
    assert.ok(result!.inflationAdjustedValue < result!.finalSavings);
    assert.ok(result!.projection.length > 0);
    // Screenshot-ish: roughly 35 years
    assert.ok(result!.yearsToGoal >= 30 && result!.yearsToGoal <= 40);
  });
});

describe('future value', () => {
  it('matches the ordinary annuity formula', () => {
    const i = 0.04 / 12;
    const n = 12;
    const pv = 20_000;
    const pmt = 1_000;
    const expected =
      pv * Math.pow(1 + i, n) + pmt * ((Math.pow(1 + i, n) - 1) / i);
    const actual = calculateSavingsFutureValue({
      initialSavings: pv,
      periodicDeposit: pmt,
      periodicRate: i,
      numberOfPeriods: n,
      depositTiming: 'end',
    });
    assert.ok(actual !== null);
    assert.ok(Math.abs(actual! - expected) < 1e-6);
  });

  it('beginning deposits beat end deposits at positive rates', () => {
    const i = 0.04 / 12;
    const end = calculateSavingsFutureValue({
      initialSavings: 20_000,
      periodicDeposit: 1_000,
      periodicRate: i,
      numberOfPeriods: 120,
      depositTiming: 'end',
    });
    const begin = calculateSavingsFutureValue({
      initialSavings: 20_000,
      periodicDeposit: 1_000,
      periodicRate: i,
      numberOfPeriods: 120,
      depositTiming: 'beginning',
    });
    assert.ok(end !== null && begin !== null);
    assert.ok(begin! > end!);
  });

  it('handles zero interest', () => {
    const fv = calculateSavingsFutureValue({
      initialSavings: 20_000,
      periodicDeposit: 1_000,
      periodicRate: 0,
      numberOfPeriods: 10,
      depositTiming: 'end',
    });
    assert.equal(fv, 30_000);
  });
});

describe('compound frequencies', () => {
  it('returns valid periodic rates for discrete frequencies', () => {
    for (const freq of [
      'annually',
      'semiannually',
      'quarterly',
      'monthly',
      'weekly',
      'daily',
      'continuously',
    ] as const) {
      const i = calculatePeriodicInterestRate(0.04, freq);
      assert.ok(i !== null);
      assert.ok(i! > 0);
      const result = calculateMillionaireGoal({ ...base, compoundFrequency: freq });
      assert.ok(result);
      assert.equal(result!.goalReachable, true);
    }
  });
});

describe('duration and identity', () => {
  it('ceil periods is the first whole period at/over target', () => {
    const i = 0.04 / 12;
    const n = calculatePeriodsToGoal({
      targetAmount: 1_000_000,
      initialSavings: 20_000,
      periodicDeposit: 1_000,
      periodicRate: i,
      depositTiming: 'end',
      maxPeriods: 150 * 12,
    });
    assert.ok(n !== null);
    const before = calculateSavingsFutureValue({
      initialSavings: 20_000,
      periodicDeposit: 1_000,
      periodicRate: i,
      numberOfPeriods: Math.max(0, Math.ceil(n!) - 1),
      depositTiming: 'end',
    });
    const after = calculateSavingsFutureValue({
      initialSavings: 20_000,
      periodicDeposit: 1_000,
      periodicRate: i,
      numberOfPeriods: Math.ceil(n!),
      depositTiming: 'end',
    });
    assert.ok(before !== null && after !== null);
    assert.ok(before! < 1_000_000 || Math.ceil(n!) === 0);
    assert.ok(after! >= 1_000_000);
  });

  it('final = initial + contributions + interest', () => {
    const result = calculateMillionaireGoal(base);
    assert.ok(result);
    assert.ok(
      Math.abs(
        result!.finalSavings -
          (result!.initialSavings +
            result!.totalContributions +
            result!.totalInterest),
      ) < 0.02,
    );
  });
});

describe('inflation', () => {
  it('matches PV = FV / (1+f)^t', () => {
    const expected = 1_000_000 / Math.pow(1.02, 35);
    const actual = calculateInflationAdjustedValue(1_000_000, 0.02, 35);
    assert.ok(actual !== null);
    assert.ok(Math.abs(actual! - expected) < 1e-6);
  });
});

describe('edge cases', () => {
  it('already reached', () => {
    const result = calculateMillionaireGoal({
      ...base,
      initialSavings: 1_500_000,
    });
    assert.ok(result);
    assert.equal(result!.goalAlreadyAchieved, true);
    assert.equal(result!.totalPeriods, 0);
  });

  it('unreachable without deposits and zero growth', () => {
    const result = calculateMillionaireGoal({
      ...base,
      annualInterestRatePercent: 0,
      additionalDeposit: 0,
      initialSavings: 10_000,
    });
    assert.ok(result);
    assert.equal(result!.goalReachable, false);
  });
});

describe('validation', () => {
  it('rejects invalid inputs and accepts defaults', () => {
    const bad = validateMillionaireInput({
      ...createDefaultInput(),
      targetAmount: '-1',
    });
    assert.equal(bad.isValid, false);
    assert.ok(bad.errors.targetAmount);

    const blank = validateMillionaireInput(createBlankInput());
    assert.equal(blank.incomplete, true);

    const ok = validateMillionaireInput(createDefaultInput());
    assert.equal(ok.isValid, true);
    assert.ok(ok.result);
  });
});
