import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  addMonthsUtc,
  calculatePOMISAnnualIncome,
  calculatePOMISMaturityDate,
  calculatePOMISMonthlyIncome,
  calculatePOMISTotalCashReceived,
  calculatePOMISTotalInterest,
  calculatePomisFromInput,
} from './calculation';
import {
  DEFAULT_POMIS_SCHEME,
  createEmptyInput,
  createExampleInput,
  type PomisInput,
} from './types';
import { validatePomisInput } from './validation';

function approx(actual: number | null | undefined, expected: number, tol = 0.01) {
  assert.ok(actual != null, `expected ${expected}, got null`);
  assert.ok(
    Math.abs(actual! - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('POMIS Calculator engine', () => {
  it('individual investment: 450000 at 6.6% → 2475 monthly', () => {
    approx(calculatePOMISMonthlyIncome(450000, 6.6), 2475);
  });

  it('annual interest: 450000 at 6.6% → 29700', () => {
    approx(calculatePOMISAnnualIncome(450000, 6.6), 29700);
  });

  it('five-year interest: 2475 × 60 → 148500', () => {
    approx(calculatePOMISTotalInterest(2475, 5), 148500);
  });

  it('total cash received: 450000 + 148500 → 598500', () => {
    approx(calculatePOMISTotalCashReceived(450000, 148500), 598500);
  });

  it('zero interest → 0 monthly', () => {
    approx(calculatePOMISMonthlyIncome(100000, 0), 0);
  });

  it('example input produces expected summary', () => {
    const r = calculatePomisFromInput(createExampleInput())!;
    approx(r.monthlyIncome, 2475);
    approx(r.annualIncome, 29700);
    approx(r.totalInterest, 148500);
    approx(r.totalCashReceived, 598500);
    assert.equal(r.investmentTermYears, 5);
    assert.equal(r.scheduledPaymentCount, 60);
  });

  it('individual limit: amount above limit → validation error', () => {
    const input: PomisInput = {
      ...createExampleInput(),
      investmentAmount: String(DEFAULT_POMIS_SCHEME.individualInvestmentLimit + 1),
    };
    const v = validatePomisInput(input);
    assert.equal(v.isValid, false);
    assert.ok(v.errors.investmentAmount);
  });

  it('joint limit: amount above joint limit → validation error', () => {
    const input: PomisInput = {
      ...createExampleInput(),
      accountType: 'joint',
      investmentAmount: String(DEFAULT_POMIS_SCHEME.jointInvestmentLimit + 1),
    };
    const v = validatePomisInput(input);
    assert.equal(v.isValid, false);
    assert.ok(v.errors.investmentAmount);
  });

  it('joint allows amount above individual limit but within joint', () => {
    const input: PomisInput = {
      ...createExampleInput(),
      accountType: 'joint',
      investmentAmount: '1200000',
    };
    const v = validatePomisInput(input);
    assert.equal(v.isValid, true);
    assert.ok(v.result);
  });

  it('zero investment → validation error', () => {
    const v = validatePomisInput({
      ...createExampleInput(),
      investmentAmount: '0',
    });
    assert.equal(v.isValid, false);
  });

  it('negative investment → validation error', () => {
    const v = validatePomisInput({
      ...createExampleInput(),
      investmentAmount: '-1000',
    });
    assert.equal(v.isValid, false);
  });

  it('invalid rate NaN → validation error', () => {
    const v = validatePomisInput({
      ...createExampleInput(),
      annualInterestRate: 'NaN',
    });
    assert.equal(v.isValid, false);
  });

  it('account switch individual→joint updates limit validation', () => {
    const overIndividual: PomisInput = {
      ...createExampleInput(),
      accountType: 'individual',
      investmentAmount: '1200000',
    };
    assert.equal(validatePomisInput(overIndividual).isValid, false);
    assert.equal(
      validatePomisInput({ ...overIndividual, accountType: 'joint' }).isValid,
      true,
    );
  });

  it('interest-rate change recalculates', () => {
    const a = calculatePomisFromInput(createExampleInput())!;
    const b = calculatePomisFromInput({
      ...createExampleInput(),
      annualInterestRate: '7',
    })!;
    assert.ok(b.monthlyIncome > a.monthlyIncome);
    approx(b.monthlyIncome, 2625);
  });

  it('date selection → maturity calculated', () => {
    assert.equal(calculatePOMISMaturityDate('2026-01-15', 5), '2031-01-15');
  });

  it('month-end / leap-year maturity clamp', () => {
    assert.equal(calculatePOMISMaturityDate('2024-02-29', 1), '2025-02-28');
    const d = addMonthsUtc(new Date(Date.UTC(2024, 0, 31)), 1);
    assert.equal(d.getUTCDate(), 29); // Feb 2024 leap
  });

  it('schedule reconciles cumulative interest', () => {
    const r = calculatePomisFromInput(createExampleInput())!;
    const interestRows = r.schedule.filter((row) => !row.isMaturityPrincipal);
    assert.equal(interestRows.length, 60);
    approx(interestRows[interestRows.length - 1]!.cumulativeInterest, 148500);
    const maturity = r.schedule.find((row) => row.isMaturityPrincipal);
    assert.ok(maturity);
    assert.equal(maturity!.principalOutstanding, 0);
  });

  it('empty form yields no result', () => {
    assert.equal(validatePomisInput(createEmptyInput()).result, null);
  });

  it('boundary individual limit accepted', () => {
    const v = validatePomisInput({
      ...createExampleInput(),
      investmentAmount: String(DEFAULT_POMIS_SCHEME.individualInvestmentLimit),
    });
    assert.equal(v.isValid, true);
  });
});
