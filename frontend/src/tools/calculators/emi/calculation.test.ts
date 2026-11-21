import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  calculateEMI,
  calculateOutstandingBalance,
  generateAmortizationSchedule,
  resolveTermMonths,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
  type EmiInput,
} from './types';
import { validateEmiInput } from './validation';

function approx(actual: number | null | undefined, expected: number, tol = 0.02) {
  assert.ok(actual != null, `expected ${expected}, got null`);
  assert.ok(
    Math.abs(actual! - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('EMI Calculator engine', () => {
  it('standard EMI: 500000, 10%, 60 months ≈ 10623.52', () => {
    const r = calculateEMI({
      principal: 500000,
      annualInterestRate: 10,
      loanTermMonths: 60,
    });
    assert.ok(r);
    approx(r!.monthlyEMI, 10623.52, 0.05);
    approx(r!.totalPayable, 637411.34, 1);
    approx(r!.totalInterest, 137411.34, 1);
  });

  it('zero interest: 120000, 0%, 12 → 10000', () => {
    const r = calculateEMI({
      principal: 120000,
      annualInterestRate: 0,
      loanTermMonths: 12,
    });
    assert.ok(r);
    approx(r!.monthlyEMI, 10000);
    approx(r!.totalInterest, 0);
  });

  it('one-month loan: 10000, 12%, 1 → 10100', () => {
    const r = calculateEMI({
      principal: 10000,
      annualInterestRate: 12,
      loanTermMonths: 1,
    });
    assert.ok(r);
    approx(r!.monthlyEMI, 10100);
  });

  it('loan term conversion: 5 years → 60 months', () => {
    assert.equal(resolveTermMonths(5, 'years'), 60);
    assert.equal(resolveTermMonths(60, 'months'), 60);
    assert.equal(resolveTermMonths(12.5, 'months'), null);
  });

  it('no principal fails validation', () => {
    const input: EmiInput = { ...createExampleInput(), principal: '0' };
    const v = validateEmiInput(input);
    assert.ok(v.errors.principal);
  });

  it('negative principal fails', () => {
    const input: EmiInput = { ...createExampleInput(), principal: '-100000' };
    assert.ok(validateEmiInput(input).errors.principal);
  });

  it('negative rate fails', () => {
    const input: EmiInput = {
      ...createExampleInput(),
      annualInterestRate: '-5',
    };
    assert.ok(validateEmiInput(input).errors.annualInterestRate);
  });

  it('zero tenure fails', () => {
    const input: EmiInput = { ...createExampleInput(), termValue: '0' };
    assert.ok(validateEmiInput(input).errors.termValue);
  });

  it('fractional months fail', () => {
    const input: EmiInput = {
      ...createExampleInput(),
      termUnit: 'months',
      termValue: '12.5',
    };
    assert.ok(validateEmiInput(input).errors.termValue);
  });

  it('amortization ends at zero balance', () => {
    const schedule = generateAmortizationSchedule({
      principal: 500000,
      annualInterestRate: 10,
      loanTermMonths: 60,
      currency: 'PKR',
    });
    assert.ok(schedule);
    assert.equal(schedule![schedule!.length - 1]!.remainingBalance, 0);
    assert.equal(schedule!.length, 60);
  });

  it('extra payment shortens payoff', () => {
    const base = generateAmortizationSchedule({
      principal: 500000,
      annualInterestRate: 10,
      loanTermMonths: 60,
      currency: 'PKR',
    })!;
    const withExtra = generateAmortizationSchedule({
      principal: 500000,
      annualInterestRate: 10,
      loanTermMonths: 60,
      extraMonthlyPayment: 2000,
      currency: 'PKR',
    })!;
    assert.ok(withExtra.length < base.length);
    assert.equal(withExtra[withExtra.length - 1]!.remainingBalance, 0);
  });

  it('outstanding balance after 0 payments = principal', () => {
    approx(
      calculateOutstandingBalance(500000, 10, 60, 0, 'PKR'),
      500000,
    );
  });

  it('example input validates', () => {
    const v = validateEmiInput(createExampleInput());
    assert.ok(v.result);
    approx(v.result!.monthlyEMI, 10623.52, 0.05);
  });

  it('empty / clear helpers', () => {
    assert.equal(createEmptyInput().principal, '');
    assert.equal(createDefaultInput().currency, 'PKR');
  });

  it('empty form yields no result', () => {
    assert.equal(validateEmiInput(createDefaultInput()).result, null);
  });
});
