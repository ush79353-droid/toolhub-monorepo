import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  calculateLoanTenureFromEMI,
  calculateMonthlyInterestRate,
  calculateMoratoriumFromInput,
  calculateMoratoriumInterest,
  calculateOriginalEMI,
  outstandingBalanceAfterK,
} from './calculation';
import {
  createEmptyInput,
  createExampleInput,
  type MoratoriumInput,
} from './types';
import { validateMoratoriumInput } from './validation';

function approx(actual: number | null | undefined, expected: number, tol = 0.05) {
  assert.ok(actual != null, `expected ${expected}, got null`);
  assert.ok(
    Math.abs(actual! - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Moratorium Calculator engine', () => {
  it('standard EMI: 300000, 8%, 120 months', () => {
    const r = calculateMonthlyInterestRate(8, 'monthly')!;
    const emi = calculateOriginalEMI(300000, r, 120);
    assert.ok(emi);
    // known ~3639. something
    approx(emi, 3639.81, 1);
  });

  it('zero interest: 120000, 0%, 12 → 10000', () => {
    approx(calculateOriginalEMI(120000, 0, 12), 10000);
  });

  it('capitalized moratorium: 300000, 8%, 12 months', () => {
    const r = calculateMonthlyInterestRate(8)!;
    const m = calculateMoratoriumInterest(300000, r, 12, 'capitalized')!;
    approx(m.balanceAfter, 300000 * (1 + 0.08 / 12) ** 12, 0.5);
    assert.ok(m.capitalized > 0);
    assert.equal(m.paid, 0);
  });

  it('interest-only moratorium: principal unchanged', () => {
    const r = calculateMonthlyInterestRate(8)!;
    const m = calculateMoratoriumInterest(300000, r, 12, 'paid-monthly')!;
    approx(m.balanceAfter, 300000);
    approx(m.paid, 300000 * r * 12, 0.5);
    assert.equal(m.capitalized, 0);
  });

  it('example capitalized same-term produces revised EMI > original', () => {
    const r = calculateMoratoriumFromInput(createExampleInput());
    assert.ok(r);
    assert.ok(r!.revisedEMI > r!.originalEMI);
    assert.ok(r!.balanceAfterMoratorium > r!.balanceAtMoratoriumStart);
    assert.ok(r!.additionalInterestCost > 0);
  });

  it('same-term restructuring keeps original maturity', () => {
    const r = calculateMoratoriumFromInput(createExampleInput())!;
    assert.equal(r.revisedMaturityDate, r.originalMaturityDate);
  });

  it('extended-term restructuring extends maturity', () => {
    const input: MoratoriumInput = {
      ...createExampleInput(),
      repaymentPlan: 'increased-payment-extended-term',
    };
    const r = calculateMoratoriumFromInput(input)!;
    assert.ok(r.revisedMaturityDate > r.originalMaturityDate);
  });

  it('same EMI extended tenure increases remaining payments', () => {
    const input: MoratoriumInput = {
      ...createExampleInput(),
      repaymentPlan: 'same-payment-extended-term',
    };
    const r = calculateMoratoriumFromInput(input)!;
    assert.ok(r.revisedRemainingPayments > r.originalRemainingPayments - 12);
    approx(r.revisedEMI, r.originalEMI, 0.02);
  });

  it('EMI insufficient → null / validation error', () => {
    const r = calculateMonthlyInterestRate(8)!;
    const n = calculateLoanTenureFromEMI(300000, r, 100);
    assert.equal(n, null);
  });

  it('zero moratorium ≈ baseline', () => {
    const input: MoratoriumInput = {
      ...createExampleInput(),
      moratoriumDurationValue: '0',
      repaymentPlan: 'increased-payment-same-term',
    };
    const result = calculateMoratoriumFromInput(input)!;
    approx(result.balanceAfterMoratorium, result.balanceAtMoratoriumStart, 0.05);
    approx(result.revisedEMI, result.originalEMI, 1);
  });

  it('outstanding after k payments decreases', () => {
    const r = calculateMonthlyInterestRate(8)!;
    const emi = calculateOriginalEMI(300000, r, 120)!;
    const b12 = outstandingBalanceAfterK(300000, r, emi, 12)!;
    assert.ok(b12 < 300000);
  });

  it('quarterly compounding differs from monthly rate', () => {
    const m = calculateMonthlyInterestRate(8, 'monthly')!;
    const q = calculateMonthlyInterestRate(8, 'quarterly')!;
    assert.ok(Math.abs(m - q) > 1e-8);
  });

  it('negative principal → validation error', () => {
    const v = validateMoratoriumInput({
      ...createExampleInput(),
      loanAmount: '-5000',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.loanAmount);
  });

  it('negative duration → validation error', () => {
    const v = validateMoratoriumInput({
      ...createExampleInput(),
      moratoriumDurationValue: '-3',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.moratoriumDurationValue);
  });

  it('moratorium before balance date → validation error', () => {
    const v = validateMoratoriumInput({
      ...createExampleInput(),
      dateOfBalance: '2026-06-01',
      moratoriumStartDate: '2026-01-01',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.moratoriumStartDate);
  });

  it('empty form yields no result', () => {
    const v = validateMoratoriumInput(createEmptyInput());
    assert.equal(v.result, null);
  });

  it('schedule last balance is zero', () => {
    const r = calculateMoratoriumFromInput(createExampleInput())!;
    const last = r.schedule[r.schedule.length - 1]!;
    approx(last.closingBalance, 0, 0.05);
  });

  it('paid-monthly example keeps balance after = start', () => {
    const input: MoratoriumInput = {
      ...createExampleInput(),
      interestTreatment: 'paid-monthly',
    };
    const r = calculateMoratoriumFromInput(input)!;
    approx(r.balanceAfterMoratorium, r.balanceAtMoratoriumStart, 0.05);
    assert.ok(r.paidMoratoriumInterest > 0);
  });
});
