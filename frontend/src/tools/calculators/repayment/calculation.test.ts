import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateEffectivePeriodicRate,
  calculateFixedInstallmentPeriods,
  calculateFixedTermPayment,
  formatRepMoney,
  generateAmortizationSchedule,
  termToPaymentCount,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateRepaymentInput } from './validation';

function nearly(actual: number | null | undefined, expected: number, eps = 1e-2) {
  assert.ok(actual != null, `expected ~${expected}, got ${actual}`);
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateEffectivePeriodicRate', () => {
  it('monthly/monthly 10% → 0.10/12', () => {
    nearly(
      calculateEffectivePeriodicRate(10, 'monthly', 'monthly'),
      0.1 / 12,
      1e-12
    );
  });
  it('zero rate → 0', () => {
    assert.equal(calculateEffectivePeriodicRate(0, 'monthly', 'monthly'), 0);
  });
  it('quarterly compound monthly pay', () => {
    const i = calculateEffectivePeriodicRate(12, 'quarterly', 'monthly')!;
    nearly(i, Math.pow(1 + 0.12 / 4, 4 / 12) - 1, 1e-12);
  });
});

describe('termToPaymentCount', () => {
  it('5y monthly → 60', () => {
    assert.equal(termToPaymentCount(5, 0, 12), 60);
  });
  it('5y biweekly → 130', () => {
    assert.equal(termToPaymentCount(5, 0, 26), 130);
  });
});

describe('calculateFixedTermPayment', () => {
  it('screenshot 10k @ 10% × 60 ≈ 212.47', () => {
    const i = 0.1 / 12;
    nearly(calculateFixedTermPayment(10000, i, 60), 212.470447, 1e-5);
  });
  it('zero interest', () => {
    nearly(calculateFixedTermPayment(12000, 0, 12), 1000);
  });
});

describe('generateAmortizationSchedule', () => {
  it('reconciles screenshot totals', () => {
    const i = 0.1 / 12;
    const A = calculateFixedTermPayment(10000, i, 60)!;
    const built = generateAmortizationSchedule(10000, i, A, 60)!;
    assert.equal(built.numberOfPayments, 60);
    nearly(built.totalRepayment, 12748.23, 0.02);
    nearly(built.totalInterest, 2748.23, 0.02);
    assert.equal(formatRepMoney(A, 'PKR'), '212.47');
    assert.equal(formatRepMoney(built.totalRepayment, 'PKR'), '12,748.23');
    assert.equal(formatRepMoney(built.totalInterest, 'PKR'), '2,748.23');
    const sumP = built.schedule.reduce((s, r) => s + r.principalPaid, 0);
    nearly(sumP, 10000, 0.05);
    assert.equal(built.schedule[built.schedule.length - 1]!.remainingBalance, 0);
  });
});

describe('calculateFixedInstallmentPeriods', () => {
  it('300/mo on 10k @ 10% is finite', () => {
    const i = 0.1 / 12;
    const r = calculateFixedInstallmentPeriods(10000, i, 300);
    assert.equal(r.ok, true);
    if (r.ok) assert.ok(r.theoreticalPeriods > 0 && r.theoreticalPeriods < 60);
  });
  it('payment below interest → too-low', () => {
    const r = calculateFixedInstallmentPeriods(10000, 0.01, 50);
    assert.equal(r.ok, false);
  });
  it('zero rate → P/A', () => {
    const r = calculateFixedInstallmentPeriods(10000, 0, 1000);
    assert.equal(r.ok, true);
    if (r.ok) nearly(r.theoreticalPeriods, 10);
  });
});

describe('validateRepaymentInput', () => {
  it('defaults → ~212.47 / 12748.23', () => {
    const v = validateRepaymentInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result!.formattedPayment, '212.47');
    assert.equal(v.result!.formattedTotalRepayment, '12,748.23');
    assert.equal(v.result!.formattedTotalInterest, '2,748.23');
    assert.equal(v.result!.numberOfPayments, 60);
  });

  it('empty → invalid', () => {
    const v = validateRepaymentInput(createEmptyInput());
    assert.equal(v.isValid, false);
  });

  it('negative balance', () => {
    const input = createDefaultInput();
    input.loanBalance = '-1';
    assert.equal(validateRepaymentInput(input).isValid, false);
  });

  it('fixed installment too low', () => {
    const input = createDefaultInput();
    input.mode = 'fixed-installment';
    input.fixedInstallment = '50';
    input.annualInterestRate = '12';
    const v = validateRepaymentInput(input);
    assert.equal(v.isValid, false);
    assert.ok(v.result?.nonAmortizing);
  });

  it('fixed installment 300 amortizes', () => {
    const input = createDefaultInput();
    input.mode = 'fixed-installment';
    input.fixedInstallment = '300';
    const v = validateRepaymentInput(input);
    assert.equal(v.isValid, true);
    assert.ok(v.result!.numberOfPayments > 0);
    assert.equal(
      v.result!.schedule[v.result!.schedule.length - 1]!.remainingBalance,
      0
    );
  });
});
