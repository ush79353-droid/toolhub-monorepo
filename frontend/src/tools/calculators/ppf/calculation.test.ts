import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  calculatePPFInflationAdjustedValue,
  calculatePPFMaturity,
  calculatePPFMonthlyInterest,
  generateFixedDepositSchedule,
  getIndianFinancialYear,
  getPPFMaturityDate,
  validatePPFAnnualInvestment,
  calculatePpfFromInput,
} from './calculation';
import {
  DEFAULT_PPF_SCHEME,
  createEmptyInput,
  createExampleInput,
  newDepositId,
  type PpfInput,
} from './types';
import { validatePpfInput } from './validation';

function approx(actual: number | null | undefined, expected: number, tol = 1) {
  assert.ok(actual != null, `expected ${expected}, got null`);
  assert.ok(
    Math.abs(actual! - expected) <= tol,
    `expected ~${expected}, got ${actual}`,
  );
}

describe('PPF Calculator engine', () => {
  it('Indian FY for Nov 2026 is 2026-27', () => {
    const fy = getIndianFinancialYear('2026-11-15')!;
    assert.equal(fy.label, '2026-27');
    assert.equal(fy.endYear, 2027);
  });

  it('Indian FY for Feb 2027 is still 2026-27', () => {
    assert.equal(getIndianFinancialYear('2027-02-10')!.label, '2026-27');
  });

  it('maturity: open FY 2026-27 → 31 Mar 2042', () => {
    assert.equal(getPPFMaturityDate('2026-11-15'), '2042-03-31');
    assert.equal(getPPFMaturityDate('2026-04-01'), '2042-03-31');
    assert.equal(getPPFMaturityDate('2027-03-31'), '2042-03-31');
  });

  it('maturity: open Apr 2027 → 31 Mar 2043', () => {
    assert.equal(getPPFMaturityDate('2027-04-01'), '2043-03-31');
  });

  it('monthly interest on eligible balance', () => {
    approx(calculatePPFMonthlyInterest(100000, 7.1), 591.6667, 0.01);
  });

  it('deposit on/before 5th earns that month; after 5th does not', () => {
    const before = calculatePPFMaturity({
      startIso: '2026-04-01',
      maturityIso: '2026-04-30',
      deposits: [{ date: '2026-04-05', amount: 100000 }],
      annualRatePercent: 12,
    })!;
    const after = calculatePPFMaturity({
      startIso: '2026-04-01',
      maturityIso: '2026-04-30',
      deposits: [{ date: '2026-04-06', amount: 100000 }],
      annualRatePercent: 12,
    })!;
    assert.ok(before.totalInterest > after.totalInterest);
    approx(after.totalInterest, 0, 0.01);
    approx(before.totalInterest, 1000, 0.01); // 100000 * 12 / 1200
  });

  it('annual limit: 150000 ok, 150050 rejected', () => {
    const ok = validatePPFAnnualInvestment([
      { date: '2026-04-05', amount: 150000 },
    ]);
    assert.equal(ok.ok, true);
    const bad = validatePPFAnnualInvestment([
      { date: '2026-04-05', amount: 150050 },
    ]);
    assert.equal(bad.ok, false);
  });

  it('monthly schedule generates 12 deposits in a full year window', () => {
    const deps = generateFixedDepositSchedule(
      '2026-04-05',
      '2027-03-05',
      5000,
      'monthly',
    );
    assert.equal(deps.length, 12);
  });

  it('quarterly schedule generates 4 deposits per full year window', () => {
    const deps = generateFixedDepositSchedule(
      '2026-04-05',
      '2027-01-05',
      30000,
      'quarterly',
    );
    assert.equal(deps.length, 4);
  });

  it('annual investment schedule spans tenure', () => {
    const maturity = getPPFMaturityDate('2026-04-05')!;
    const deps = generateFixedDepositSchedule(
      '2026-04-05',
      maturity,
      50000,
      'annually',
    );
    assert.ok(deps.length >= 15 && deps.length <= 16);
  });

  it('example annual 50000 @ 7.1% produces positive interest and reconciles', () => {
    const r = calculatePpfFromInput(createExampleInput())!;
    assert.ok(r.maturityValue > r.totalInvestment);
    approx(r.totalInvestment + r.totalInterest, r.maturityValue, 1);
    assert.equal(r.maturityDate, '2042-03-31');
  });

  it('zero interest rate → interest remains zero', () => {
    const r = calculatePpfFromInput({
      ...createExampleInput(),
      annualInterestRate: '0',
    })!;
    approx(r.totalInterest, 0, 0.01);
    approx(r.maturityValue, r.totalInvestment, 0.01);
  });

  it('inflation 0 → real equals nominal', () => {
    const r = calculatePpfFromInput({
      ...createExampleInput(),
      inflationRate: '0',
    })!;
    approx(r.inflationAdjustedValue, r.maturityValue, 0.01);
  });

  it('inflation > 0 discounts purchasing power', () => {
    const nominal = 2_000_000;
    const real = calculatePPFInflationAdjustedValue(nominal, 5, 15)!;
    assert.ok(real < nominal);
    approx(real, nominal / 1.05 ** 15, 1);
  });

  it('monthly 50000 exceeds annual limit → validation error', () => {
    const v = validatePpfInput({
      ...createExampleInput(),
      depositAmount: '50000',
      depositFrequency: 'monthly',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.depositAmount);
  });

  it('custom schedule with over-limit FY fails', () => {
    const input: PpfInput = {
      ...createExampleInput(),
      investmentMode: 'custom',
      customDeposits: [
        { id: newDepositId(), date: '2026-04-05', amount: '100000' },
        { id: newDepositId(), date: '2026-05-05', amount: '60000' },
      ],
    };
    const v = validatePpfInput(input);
    assert.equal(v.isValid, false);
  });

  it('custom deposits matching fixed schedule can compute', () => {
    const fixed = calculatePpfFromInput(createExampleInput())!;
    const maturity = fixed.maturityDate;
    const deps = generateFixedDepositSchedule(
      '2026-04-05',
      maturity,
      50000,
      'annually',
    );
    const custom: PpfInput = {
      ...createExampleInput(),
      investmentMode: 'custom',
      customDeposits: deps.map((d) => ({
        id: newDepositId(),
        date: d.date,
        amount: String(d.amount),
      })),
    };
    const r = calculatePpfFromInput(custom)!;
    approx(r.maturityValue, fixed.maturityValue, 1);
    approx(r.totalInterest, fixed.totalInterest, 1);
  });

  it('extension without contributions continues past standard maturity', () => {
    const std = calculatePpfFromInput(createExampleInput())!;
    const ext = calculatePpfFromInput({
      ...createExampleInput(),
      extensionMode: 'extension-without-contributions',
    })!;
    assert.ok(ext.maturityDate > std.maturityDate);
    assert.equal(ext.totalInvestment, std.totalInvestment);
    assert.ok(ext.maturityValue >= std.maturityValue);
  });

  it('empty form yields no result', () => {
    assert.equal(validatePpfInput(createEmptyInput()).result, null);
  });

  it('minimum annual deposit 500 accepted for annual frequency', () => {
    const v = validatePpfInput({
      ...createExampleInput(),
      depositAmount: '500',
      depositFrequency: 'annually',
    });
    assert.equal(v.isValid, true);
  });

  it('increment rule: 525 rejected', () => {
    const v = validatePpfInput({
      ...createExampleInput(),
      depositAmount: '525',
    });
    assert.equal(v.isValid, false);
  });

  it('leap-year clamp in schedule', () => {
    const deps = generateFixedDepositSchedule(
      '2024-01-31',
      '2024-03-31',
      1000,
      'monthly',
    );
    assert.equal(deps[1]!.date, '2024-02-29');
  });

  it('scheme max constant matches config', () => {
    assert.equal(DEFAULT_PPF_SCHEME.maximumAnnualDeposit, 150000);
    assert.equal(DEFAULT_PPF_SCHEME.minimumAnnualDeposit, 500);
  });
});
