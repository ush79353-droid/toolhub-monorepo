import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateHeloc,
  calculateUpfrontFees,
  generateRateSchedule,
  interestOnlyPayment,
} from './calculation';
import { validateHelocInput } from './validation';
import { createDefaultInput, createEmptyInput } from './types';

const TOL = 0.02;

describe('heloc formulas', () => {
  it('interest-only draw payment 50k @ 6% = 250', () => {
    assert.equal(interestOnlyPayment(50_000, 6), 250);
  });

  it('upfront fees 1% + 500 = 1000', () => {
    assert.equal(calculateUpfrontFees(50_000, 1, 500), 1000);
  });

  it('fixed-rate Company Alpha schedule', () => {
    const r = calculateHeloc({
      currentBalance: 50_000,
      drawMonths: 120,
      repaymentMonths: 240,
      initialInterestRate: 6,
      upfrontFeePercent: 1,
      upfrontFeeFixed: 500,
      annualFee: 200,
      adjustmentType: 'none',
      expectedRateAdjustment: 0,
      firstAdjustmentAfterYears: 0,
      adjustmentIntervalMonths: 12,
      maximumInterestRate: 6,
    });
    assert.ok(r);
    assert.ok(Math.abs(r!.initialDrawPayment - 250) < TOL);
    assert.ok(Math.abs(r!.initialRepaymentPayment - 358.22) < TOL);
    assert.ok(Math.abs(r!.drawPeriodInterest - 30_000) < TOL);
    assert.equal(r!.upfrontFees, 1000);
    assert.equal(r!.recurringFees, 30 * 200);
    assert.equal(r!.schedule.length, 360);
    assert.equal(r!.schedule[0]!.phase, 'draw');
    assert.equal(r!.schedule[0]!.monthlyPrincipal, 0);
    assert.equal(r!.schedule[120]!.phase, 'repayment');
    assert.ok(r!.schedule[r!.schedule.length - 1]!.endingBalance < TOL);
    assert.ok(
      Math.abs(
        r!.totalCashOutflow -
          (r!.principalRepaid + r!.totalInterest + r!.totalFees)
      ) < 1
    );
  });

  it('zero interest', () => {
    const r = calculateHeloc({
      currentBalance: 50_000,
      drawMonths: 120,
      repaymentMonths: 240,
      initialInterestRate: 0,
      upfrontFeePercent: 0,
      upfrontFeeFixed: 0,
      annualFee: 0,
      adjustmentType: 'none',
      expectedRateAdjustment: 0,
      firstAdjustmentAfterYears: 0,
      adjustmentIntervalMonths: 12,
      maximumInterestRate: 0,
    });
    assert.ok(r);
    assert.equal(r!.initialDrawPayment, 0);
    assert.ok(Math.abs(r!.initialRepaymentPayment - 50_000 / 240) < TOL);
    assert.equal(r!.totalInterest, 0);
  });

  it('rate schedule with cap', () => {
    const rates = generateRateSchedule({
      totalMonths: 200,
      initialRate: 6,
      adjustmentType: 'scheduled',
      expectedAdjustment: 0.5,
      firstAdjustmentAfterYears: 5,
      adjustmentIntervalMonths: 24,
      maximumInterestRate: 8,
    });
    assert.ok(rates);
    assert.equal(rates![0], 6);
    assert.equal(rates![59], 6);
    assert.equal(rates![60], 6.5);
    assert.equal(rates![84], 7);
    // eventually capped at 8
    assert.ok(rates!.every((x) => x <= 8 + 1e-12));
    assert.equal(rates![rates!.length - 1], 8);
  });

  it('rate cap clamps 7.5 + 1 → 8', () => {
    const rates = generateRateSchedule({
      totalMonths: 80,
      initialRate: 7.5,
      adjustmentType: 'scheduled',
      expectedAdjustment: 1,
      firstAdjustmentAfterYears: 5,
      adjustmentIntervalMonths: 12,
      maximumInterestRate: 8,
    });
    assert.ok(rates);
    assert.equal(rates![60], 8);
  });
});

describe('validateHelocInput', () => {
  it('defaults produce valid result', () => {
    const v = validateHelocInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.ok(Math.abs(v.result!.initialDrawPayment - 250) < TOL);
  });

  it('negative balance → error', () => {
    const v = validateHelocInput({
      ...createDefaultInput(),
      currentBalance: '-1',
    });
    assert.ok(v.errors.currentBalance);
    assert.equal(v.result, null);
  });

  it('empty → no result', () => {
    assert.equal(validateHelocInput(createEmptyInput()).result, null);
  });

  it('zero repayment → error', () => {
    const v = validateHelocInput({
      ...createDefaultInput(),
      repaymentTermYears: '0',
    });
    assert.ok(v.errors.repaymentTermYears);
  });
});
