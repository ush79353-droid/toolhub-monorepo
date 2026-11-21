import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  calculateEPSContribution,
  calculateEmployeeEPF,
  calculateEmployerContribution,
  calculateEmployerEPF,
  calculateEPFSalary,
  calculateMonthlyEPFDeposit,
  calculateEpfFromInput,
  splitMonthlyContributions,
} from './calculation';
import {
  createEmptyInput,
  createExampleInput,
  type EpfInput,
} from './types';
import { validateEpfInput } from './validation';

function approx(actual: number | null | undefined, expected: number, tol = 0.05) {
  assert.ok(actual != null, `expected ${expected}, got null`);
  assert.ok(
    Math.abs(actual! - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('EPF Calculator engine', () => {
  it('employee contribution: ₹15,000 at 12% → ₹1,800', () => {
    approx(calculateEmployeeEPF(15000, 12), 1800);
  });

  it('employer total contribution: ₹15,000 at 12% → ₹1,800', () => {
    approx(calculateEmployerContribution(15000, 12), 1800);
  });

  it('standard EPS allocation: eligible, ₹15,000 → ≈ ₹1,249.50', () => {
    const eps = calculateEPSContribution({
      epfSalary: 15000,
      eligibleForEPS: true,
      epsWageCeiling: 15000,
      employerTotalContribution: 1800,
    });
    approx(eps, 1249.5, 0.5);
  });

  it('employer EPF share: 1800 − EPS ≈ ₹550.50', () => {
    const eps = calculateEPSContribution({
      epfSalary: 15000,
      eligibleForEPS: true,
      epsWageCeiling: 15000,
      employerTotalContribution: 1800,
    })!;
    approx(calculateEmployerEPF(1800, eps), 1800 - eps, 0.01);
    approx(calculateEmployerEPF(1800, eps), 550.5, 0.5);
  });

  it('total monthly EPF deposit ≈ ₹2,350.50', () => {
    const split = splitMonthlyContributions({
      basic: 15000,
      da: 0,
      employeeRate: 12,
      employerRate: 12,
      eligibleForEPS: true,
      epsWageCeiling: 15000,
      vpfRate: 0,
      currency: 'INR',
    });
    assert.ok(split);
    approx(split!.employeeContribution, 1800);
    approx(split!.epsContribution, 1249.5, 0.5);
    approx(split!.employerEPFContribution, 550.5, 0.5);
    approx(split!.totalMonthlyEPFDeposit, 2350.5, 0.5);
  });

  it('annual contribution at flat salary ≈ ₹28,206', () => {
    const monthly = calculateMonthlyEPFDeposit(1800, 550.5)!;
    approx(monthly * 12, 28206, 1);
  });

  it('retirement horizon: age 25 to 58 → 33 years', () => {
    const result = calculateEpfFromInput(createExampleInput());
    assert.ok(result);
    assert.equal(result!.yearsToRetirement, 33);
  });

  it('existing balance is included in maturity', () => {
    const base = createExampleInput();
    const withBal: EpfInput = { ...base, existingEPFBalance: '50000' };
    const a = calculateEpfFromInput(base)!;
    const b = calculateEpfFromInput(withBal)!;
    assert.ok(b.maturityValue > a.maturityValue);
    assert.ok(b.maturityValue - a.maturityValue >= 50000);
  });

  it('zero salary growth keeps first-year deposits stable', () => {
    const input: EpfInput = {
      ...createExampleInput(),
      annualSalaryGrowthRate: '0',
      annualInterestRate: '0',
      existingEPFBalance: '0',
    };
    const r = calculateEpfFromInput(input)!;
    assert.equal(r.yearlySchedule[0]!.employeeContributions, 1800 * 12);
  });

  it('salary growth increases later-year employee deposits', () => {
    const input = createExampleInput();
    const r = calculateEpfFromInput(input)!;
    assert.ok(
      r.yearlySchedule[1]!.employeeContributions >
        r.yearlySchedule[0]!.employeeContributions,
    );
  });

  it('EPS-ineligible: no EPS; full employer share to EPF', () => {
    const split = splitMonthlyContributions({
      basic: 15000,
      da: 0,
      employeeRate: 12,
      employerRate: 12,
      eligibleForEPS: false,
      epsWageCeiling: 15000,
      vpfRate: 0,
      currency: 'INR',
    });
    assert.ok(split);
    assert.equal(split!.epsContribution, 0);
    approx(split!.employerEPFContribution, 1800);
    approx(split!.totalMonthlyEPFDeposit, 3600);
  });

  it('zero interest: maturity equals opening + deposits', () => {
    const input: EpfInput = {
      ...createExampleInput(),
      annualInterestRate: '0',
      annualSalaryGrowthRate: '0',
      existingEPFBalance: '10000',
      retirementAge: '27',
    };
    const r = calculateEpfFromInput(input)!;
    const deposits =
      r.totalEmployeeContributions + r.totalEmployerEPFContributions;
    approx(r.maturityValue, 10000 + deposits, 0.05);
    assert.equal(r.totalInterestEarned, 0);
  });

  it('negative salary → validation error', () => {
    const input: EpfInput = {
      ...createExampleInput(),
      monthlyBasicSalary: '-5000',
    };
    const v = validateEpfInput(input);
    assert.equal(v.isValid, false);
    assert.ok(v.errors.monthlyBasicSalary);
  });

  it('invalid age → validation error', () => {
    const input: EpfInput = { ...createExampleInput(), currentAge: '-5' };
    const v = validateEpfInput(input);
    assert.equal(v.isValid, false);
    assert.ok(v.errors.currentAge);
  });

  it('retirement below/equal age → validation error', () => {
    const input: EpfInput = {
      ...createExampleInput(),
      currentAge: '58',
      retirementAge: '50',
    };
    const v = validateEpfInput(input);
    assert.equal(v.isValid, false);
    assert.ok(v.errors.retirementAge);
  });

  it('negative contribution rate → validation error', () => {
    const input: EpfInput = {
      ...createExampleInput(),
      employeeContributionRate: '-5',
    };
    const v = validateEpfInput(input);
    assert.equal(v.isValid, false);
    assert.ok(v.errors.employeeContributionRate);
  });

  it('EPF salary = basic + DA', () => {
    assert.equal(calculateEPFSalary(15000, 2000), 17000);
  });

  it('example input projects positive maturity and yearly rows', () => {
    const r = calculateEpfFromInput(createExampleInput());
    assert.ok(r);
    assert.ok(r!.maturityValue > 0);
    assert.equal(r!.yearlySchedule.length, 33);
    assert.ok(r!.totalInterestEarned > 0);
    assert.ok(r!.totalEPSContributions > 0);
  });

  it('empty form yields no result', () => {
    const v = validateEpfInput(createEmptyInput());
    assert.equal(v.result, null);
  });

  it('VPF increases monthly EPF deposit', () => {
    const base = splitMonthlyContributions({
      basic: 15000,
      da: 0,
      employeeRate: 12,
      employerRate: 12,
      eligibleForEPS: true,
      epsWageCeiling: 15000,
      vpfRate: 0,
      currency: 'INR',
    })!;
    const withVpf = splitMonthlyContributions({
      basic: 15000,
      da: 0,
      employeeRate: 12,
      employerRate: 12,
      eligibleForEPS: true,
      epsWageCeiling: 15000,
      vpfRate: 5,
      currency: 'INR',
    })!;
    approx(withVpf.vpfContribution, 750);
    assert.ok(
      withVpf.totalMonthlyEPFDeposit > base.totalMonthlyEPFDeposit,
    );
  });
});
