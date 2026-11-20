import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateMaturityValue,
  formatMaturityMoney,
  roundMoneyAmount,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateMaturityValueInput } from './validation';

describe('calculateMaturityValue', () => {
  it('2000 · 3% · 2 years → 2121.80', () => {
    const r = calculateMaturityValue({
      principal: 2000,
      annualInterestRatePercent: 3,
      duration: 2,
      durationUnit: 'years',
    });
    assert.ok(r);
    assert.equal(roundMoneyAmount(r!.maturityValue, 'PKR'), 2121.8);
    assert.equal(roundMoneyAmount(r!.interestEarned, 'PKR'), 121.8);
  });

  it('10000 · 5% · 3 years → 11576.25', () => {
    const r = calculateMaturityValue({
      principal: 10000,
      annualInterestRatePercent: 5,
      duration: 3,
      durationUnit: 'years',
    });
    assert.ok(r);
    assert.equal(roundMoneyAmount(r!.maturityValue, 'PKR'), 11576.25);
  });

  it('zero interest → principal', () => {
    const r = calculateMaturityValue({
      principal: 5000,
      annualInterestRatePercent: 0,
      duration: 5,
      durationUnit: 'years',
    });
    assert.ok(r);
    assert.equal(r!.maturityValue, 5000);
    assert.equal(r!.interestEarned, 0);
  });

  it('zero duration → principal', () => {
    const r = calculateMaturityValue({
      principal: 8000,
      annualInterestRatePercent: 6,
      duration: 0,
      durationUnit: 'years',
    });
    assert.ok(r);
    assert.equal(r!.maturityValue, 8000);
  });

  it('24 months ≡ 2 years', () => {
    const r = calculateMaturityValue({
      principal: 2000,
      annualInterestRatePercent: 3,
      duration: 24,
      durationUnit: 'months',
    });
    assert.ok(r);
    assert.equal(r!.durationYears, 2);
    assert.equal(roundMoneyAmount(r!.maturityValue, 'PKR'), 2121.8);
  });

  it('4.5% decimal rate', () => {
    const r = calculateMaturityValue({
      principal: 1000,
      annualInterestRatePercent: 4.5,
      duration: 1,
      durationUnit: 'years',
    });
    assert.ok(r);
    assert.equal(roundMoneyAmount(r!.maturityValue, 'PKR'), 1045);
  });

  it('1.5 fractional years', () => {
    const r = calculateMaturityValue({
      principal: 1000,
      annualInterestRatePercent: 8,
      duration: 1.5,
      durationUnit: 'years',
    });
    assert.ok(r);
    // 1000 * (1.08)^1.5
    assert.ok(Math.abs(r!.maturityValue - 1000 * Math.pow(1.08, 1.5)) < 1e-9);
  });

  it('negative principal → null', () => {
    assert.equal(
      calculateMaturityValue({
        principal: -1,
        annualInterestRatePercent: 3,
        duration: 2,
        durationUnit: 'years',
      }),
      null
    );
  });

  it('negative rate → null', () => {
    assert.equal(
      calculateMaturityValue({
        principal: 1000,
        annualInterestRatePercent: -1,
        duration: 2,
        durationUnit: 'years',
      }),
      null
    );
  });

  it('negative duration → null', () => {
    assert.equal(
      calculateMaturityValue({
        principal: 1000,
        annualInterestRatePercent: 3,
        duration: -1,
        durationUnit: 'years',
      }),
      null
    );
  });

  it('overflow → null', () => {
    assert.equal(
      calculateMaturityValue({
        principal: 1e308,
        annualInterestRatePercent: 100,
        duration: 1000,
        durationUnit: 'years',
      }),
      null
    );
  });
});

describe('formatting', () => {
  it('formats money with two decimals', () => {
    assert.equal(formatMaturityMoney(2121.8, 'PKR'), '2,121.80');
  });
});

describe('validateMaturityValueInput', () => {
  it('defaults → $2,121.80', () => {
    const v = validateMaturityValueInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result!.maturityValue, 2121.8);
    assert.equal(v.result!.interestEarned, 121.8);
  });

  it('empty → invalid', () => {
    const v = validateMaturityValueInput(createEmptyInput());
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });

  it('negative principal error', () => {
    const v = validateMaturityValueInput({
      ...createDefaultInput(),
      principal: '-10',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.principal);
  });

  it('fractional months duration allowed', () => {
    const v = validateMaturityValueInput({
      ...createDefaultInput(),
      duration: '18',
      durationUnit: 'months',
    });
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result!.durationYears, 1.5);
  });

  it('invalid characters', () => {
    const v = validateMaturityValueInput({
      ...createDefaultInput(),
      principal: 'abc',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.principal);
  });
});
