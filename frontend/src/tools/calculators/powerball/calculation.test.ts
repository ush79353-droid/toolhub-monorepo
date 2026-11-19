import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateFirstAnnuityPayment,
  calculateLumpSum,
  calculatePowerballPayout,
  estimateFederalLotteryWithholding,
} from './calculation';
import { calculateLotteryStateIncomeTax } from './lottery-state-tax';
import { POWERBALL_ANNUITY_GROWTH, POWERBALL_PAYMENT_COUNT } from './types';
import { validatePowerballInput } from './validation';
import { createBlankInput, createDefaultInput } from './types';
import { generateGrossAnnuityPayments } from '../mega-millions-payout/calculation';

describe('powerball lump sum', () => {
  it('applies 52% to $281M', () => {
    assert.equal(calculateLumpSum(281_000_000, 52), 146_120_000);
  });
});

describe('powerball annuity', () => {
  it('builds 30 graduated 5% payments that sum to the jackpot', () => {
    const jackpot = 281_000_000;
    const first = calculateFirstAnnuityPayment(
      jackpot,
      POWERBALL_ANNUITY_GROWTH,
      POWERBALL_PAYMENT_COUNT,
    );
    assert.ok(first !== null);
    const expected =
      jackpot /
      ((Math.pow(1.05, 30) - 1) / 0.05);
    assert.ok(Math.abs(first! - expected) < 1e-4);

    const payments = generateGrossAnnuityPayments(jackpot, 0.05, 30);
    assert.ok(payments);
    assert.equal(payments!.length, 30);
    assert.ok(Math.abs(payments![1]! - payments![0]! * 1.05) < 1e-4);
    const total = payments!.reduce((s, p) => s + p, 0);
    assert.ok(Math.abs(total - jackpot) < 0.01);
  });
});

describe('powerball taxes', () => {
  it('distinguishes 24% withholding from progressive liability', () => {
    const result = calculatePowerballPayout({
      jackpot: 281_000_000,
      lumpSumPercent: 52,
      filingStatus: 'single',
      state: 'FL',
    });
    assert.ok(result);
    assert.equal(result!.lumpSum.grossPayout, 146_120_000);
    assert.equal(
      result!.lumpSum.federalWithholding,
      estimateFederalLotteryWithholding(146_120_000),
    );
    assert.ok(result!.lumpSum.federalTax > 0);
    assert.notEqual(
      result!.lumpSum.federalTax,
      result!.lumpSum.federalWithholding,
    );
    assert.equal(result!.lumpSum.stateTax, 0);
    assert.ok(
      Math.abs(
        result!.lumpSum.netPayout -
          (result!.lumpSum.grossPayout - result!.lumpSum.totalTax),
      ) < 0.01,
    );
  });

  it('zeros California lottery state tax and taxes Alabama', () => {
    const ca = calculateLotteryStateIncomeTax(1_000_000, 'CA', 'single', 2025);
    assert.equal(ca.tax, 0);
    const al = calculateLotteryStateIncomeTax(1_000_000, 'AL', 'single', 2025);
    assert.ok(al.tax > 0);
  });

  it('taxes annuity per payment not as one-year jackpot', () => {
    const result = calculatePowerballPayout({
      jackpot: 281_000_000,
      lumpSumPercent: 52,
      filingStatus: 'single',
      state: 'TX',
    });
    assert.ok(result);
    assert.equal(result!.annualPayments.length, 30);
    const scheduleFederal = result!.annualPayments.reduce(
      (s, r) => s + r.federalTax,
      0,
    );
    assert.ok(Math.abs(scheduleFederal - result!.annuity.federalTax) < 0.01);
  });

  it('updates federal tax when filing status changes', () => {
    const single = calculatePowerballPayout({
      jackpot: 281_000_000,
      lumpSumPercent: 52,
      filingStatus: 'single',
      state: 'FL',
    });
    const joint = calculatePowerballPayout({
      jackpot: 281_000_000,
      lumpSumPercent: 52,
      filingStatus: 'married_jointly',
      state: 'FL',
    });
    assert.ok(single && joint);
    assert.notEqual(single!.lumpSum.federalTax, joint!.lumpSum.federalTax);
  });
});

describe('validation', () => {
  it('accepts defaults and rejects invalid input', () => {
    const ok = validatePowerballInput(createDefaultInput());
    assert.equal(ok.isValid, true);
    assert.equal(ok.result!.lumpSum.grossPayout, 146_120_000);

    const blank = validatePowerballInput(createBlankInput());
    assert.equal(blank.incomplete, true);

    const bad = validatePowerballInput({
      ...createDefaultInput(),
      lumpSumPercent: '120',
    });
    assert.equal(bad.isValid, false);
  });
});
