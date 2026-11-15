import assert from 'node:assert/strict';
import { calculateFourZeroOneK, periodRate, periodsPerYear } from './calculation';
import type { FourZeroOneKInput, FourZeroOneKResult } from './types';
import { validateFourZeroOneK } from './validation';

function base(overrides: Partial<FourZeroOneKInput> = {}): FourZeroOneKInput {
  return {
    mode: 'balance',
    currentAge: 35,
    retirementAge: 36,
    balance: 0,
    annualSalary: 80_000,
    salaryGrowthRate: 0,
    salaryCap: null,
    contributionKind: 'percent',
    employeePercent: 0.06,
    employeeFixedAnnual: 0,
    contributionIncrease: 0,
    matchKind: 'partial',
    matchRate: 0.5,
    matchUpToPercent: 0.06,
    fixedEmployerPercent: 0,
    extraEmployerAnnual: 0,
    annualReturn: 0,
    annualFeeRate: 0,
    frequency: 'yearly',
    targetBalance: null,
    accountType: 'traditional',
    inflationRate: 0,
    vestingPercent: 1,
    timing: 'end',
    applyLimits: false,
    electiveDeferralLimit: null,
    catchUpAge: null,
    catchUpAmount: null,
    annualAdditionsLimit: null,
    withdrawalRate: null,
    currency: 'USD',
    ...overrides,
  };
}

function must(input: FourZeroOneKInput): FourZeroOneKResult {
  const result = calculateFourZeroOneK(input);
  assert.ok(result, 'expected a projection');
  return result;
}

function reconciled(input: FourZeroOneKInput, result: FourZeroOneKResult): void {
  const end =
    Math.round(input.balance * 100) +
    Math.round(result.employeeContributions * 100) +
    Math.round(result.vestedEmployerContributions * 100) +
    Math.round(result.investmentGrowth * 100) -
    Math.round(result.fees * 100);
  assert.equal(Math.round(result.finalBalance * 100), end);
}

{
  const result = must(base());
  assert.equal(result.firstYearEmployeeContribution, 4800);
  assert.equal(result.firstYearEmployerContribution, 2400);
  assert.equal(result.finalBalance, 7200);
  assert.equal(result.investmentGrowth, 0);
  assert.equal(result.fees, 0);
  reconciled(base(), result);
}

{
  const result = must(base({ matchKind: 'none', employeePercent: 0, extraEmployerAnnual: 0, balance: 0 }));
  assert.equal(result.finalBalance, 0);
  assert.equal(result.employeeContributions, 0);
  assert.equal(result.employerContributions, 0);
}

{
  const result = must(base({ balance: 1000, employeePercent: 0, matchKind: 'none', annualReturn: 0.1 }));
  assert.equal(result.investmentGrowth, 100);
  assert.equal(result.finalBalance, 1100);
  reconciled(base({ balance: 1000, employeePercent: 0, matchKind: 'none', annualReturn: 0.1 }), result);
}

{
  const result = must(base({ balance: 1000, employeePercent: 0, matchKind: 'none', annualReturn: -0.1 }));
  assert.equal(result.investmentGrowth, -100);
  assert.equal(result.finalBalance, 900);
}

{
  const result = must(
    base({ balance: 1000, employeePercent: 0, matchKind: 'none', annualReturn: 0, annualFeeRate: 0.01 }),
  );
  assert.equal(result.fees, 10);
  assert.equal(result.finalBalance, 990);
}

{
  const input = base({
    retirementAge: 37,
    employeePercent: 0.1,
    matchKind: 'none',
    annualSalary: 10_000,
    salaryGrowthRate: 0.1,
  });
  const result = must(input);
  assert.equal(result.yearly[0]?.salary, 10_000);
  assert.equal(result.yearly[0]?.employeeContribution, 1000);
  assert.equal(result.yearly[1]?.salary, 11_000);
  assert.equal(result.yearly[1]?.employeeContribution, 1100);
  assert.equal(result.finalBalance, 2100);
  reconciled(input, result);
}

{
  const result = must(
    base({
      annualSalary: 100_000,
      salaryCap: 80_000,
      employeePercent: 0.1,
      matchKind: 'none',
    }),
  );
  assert.equal(result.firstYearSalary, 80_000);
  assert.equal(result.firstYearEmployeeContribution, 8000);
}

{
  const beginning = must(
    base({ balance: 1000, employeePercent: 0, matchKind: 'none', annualReturn: 0.1, timing: 'beginning', extraEmployerAnnual: 100 }),
  );
  const ending = must(
    base({ balance: 1000, employeePercent: 0, matchKind: 'none', annualReturn: 0.1, timing: 'end', extraEmployerAnnual: 100 }),
  );
  assert.equal(beginning.finalBalance, 1210);
  assert.equal(ending.finalBalance, 1200);
}

{
  const traditional = must(base({ accountType: 'traditional', annualReturn: 0.05, balance: 5000 }));
  const roth = must(base({ accountType: 'roth', annualReturn: 0.05, balance: 5000 }));
  assert.equal(roth.finalBalance, traditional.finalBalance);
  assert.equal(roth.employeeContributions, traditional.employeeContributions);
  assert.equal(roth.investmentGrowth, traditional.investmentGrowth);
}

{
  const result = must(
    base({
      applyLimits: true,
      electiveDeferralLimit: 1000,
      employeePercent: 0.06,
      currency: 'USD',
    }),
  );
  assert.equal(result.limitsApplied, true);
  assert.equal(result.limitsReducedAContribution, true);
  assert.equal(result.firstYearEmployeeContribution, 1000);
  assert.equal(result.firstYearEmployerContribution, 500);
}

{
  const result = must(
    base({
      currentAge: 50,
      retirementAge: 51,
      applyLimits: true,
      electiveDeferralLimit: 2000,
      catchUpAge: 50,
      catchUpAmount: 1000,
      employeePercent: 0.1,
      matchKind: 'none',
    }),
  );
  assert.equal(result.firstYearEmployeeContribution, 3000);
}

{
  const young = must(
    base({
      currentAge: 40,
      retirementAge: 41,
      applyLimits: true,
      electiveDeferralLimit: 2000,
      catchUpAge: 50,
      catchUpAmount: 1000,
      employeePercent: 0.1,
      matchKind: 'none',
    }),
  );
  assert.equal(young.firstYearEmployeeContribution, 2000);
}

{
  const input = base({ balance: 1000, employeePercent: 0, matchKind: 'none', inflationRate: 0.1, annualReturn: 0 });
  const result = must(input);
  assert.equal(result.finalBalance, 1000);
  assert.equal(result.inflationAdjustedBalance, 909.09);
}

{
  const result = must(base({ balance: 10_000, employeePercent: 0, matchKind: 'none', withdrawalRate: 0.04 }));
  assert.equal(result.estimatedAnnualWithdrawal, 400);
  assert.equal(result.estimatedMonthlyWithdrawal, 33.33);
}

{
  const input = base({
    mode: 'required',
    targetBalance: 7200,
    employeePercent: 0,
    matchKind: 'partial',
    matchRate: 0.5,
    matchUpToPercent: 0.06,
  });
  const result = must(input);
  assert.equal(result.impossible, false);
  assert.equal(result.solvedEmployeePercent, 0.06);
  assert.equal(result.finalBalance, 7200);
}

{
  const input = base({
    mode: 'required',
    targetBalance: 50_000_000,
    employeePercent: 0,
    matchKind: 'none',
    annualReturn: 0,
    contributionKind: 'percent',
  });
  const result = must(input);
  assert.equal(result.impossible, true);
  assert.ok(result.finalBalance < input.targetBalance!);
  assert.equal(result.solvedEmployeePercent, 1);
}

{
  const input = base({
    mode: 'required',
    contributionKind: 'fixed',
    employeeFixedAnnual: 0,
    employeePercent: 0,
    matchKind: 'none',
    targetBalance: 1200,
    annualReturn: 0,
  });
  const result = must(input);
  assert.equal(result.solvedEmployeeFixedAnnual, 1200);
  assert.equal(result.finalBalance, 1200);
}

{
  const dollar = must(
    base({ matchKind: 'dollar-for-dollar', matchUpToPercent: 0.06, employeePercent: 0.1, matchRate: 0.25 }),
  );
  assert.equal(dollar.firstYearEmployeeContribution, 8000);
  assert.equal(dollar.firstYearEmployerContribution, 4800);
}

{
  const vested = must(base({ vestingPercent: 0.5 }));
  assert.equal(vested.employerContributions, 2400);
  assert.equal(vested.vestedEmployerContributions, 1200);
  assert.equal(vested.finalBalance, 6000);
  reconciled(base({ vestingPercent: 0.5 }), vested);
}

{
  assert.equal(periodsPerYear('monthly'), 12);
  assert.equal(periodsPerYear('biweekly'), 26);
  const monthly = periodRate(0.06, 12);
  assert.ok(Math.abs((1 + monthly) ** 12 - 1.06) < 1e-12);
  assert.ok(Number.isNaN(periodRate(-1, 12)));
}

{
  const monthly = must(
    base({
      frequency: 'monthly',
      annualReturn: 0.06,
      balance: 0,
      employeePercent: 0,
      matchKind: 'none',
      extraEmployerAnnual: 1200,
    }),
  );
  reconciled(
    base({
      frequency: 'monthly',
      annualReturn: 0.06,
      balance: 0,
      employeePercent: 0,
      matchKind: 'none',
      extraEmployerAnnual: 1200,
    }),
    monthly,
  );
  assert.ok(monthly.investmentGrowth > 0);
  assert.equal(monthly.employeePerPeriod, 0);
  assert.equal(monthly.employerPerPeriod, 100);
}

{
  const blocked = validateFourZeroOneK(
    base({ retirementAge: 35, applyLimits: true, currency: 'EUR', electiveDeferralLimit: 23000, employeePercent: 1.5 }),
  );
  assert.equal(blocked.isValid, false);
  assert.ok(blocked.errors.retirementAge);
  assert.ok(blocked.errors.electiveDeferralLimit);
  assert.ok(blocked.errors.employeePercent);
  assert.equal(calculateFourZeroOneK(base({ retirementAge: 35 })), null);
  assert.equal(calculateFourZeroOneK(base({ applyLimits: true, currency: 'EUR', electiveDeferralLimit: 23000 })), null);
}

{
  const ok = validateFourZeroOneK(base({ targetBalance: 1000, mode: 'balance' }));
  assert.equal(ok.isValid, true);
  const progress = must(base({ targetBalance: 14_400, mode: 'balance' }));
  assert.equal(progress.fundingProgress, 0.5);
}

console.log('four-zero-one-k calculation tests passed');
