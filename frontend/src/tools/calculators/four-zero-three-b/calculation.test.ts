import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateFourZeroThreeB, periodRate } from './calculation';
import {
  MAX_MONEY,
  type FourZeroThreeBInput,
  type FourZeroThreeBResult,
} from './types';
import { validateFourZeroThreeB } from './validation';

function base(overrides: Partial<FourZeroThreeBInput> = {}): FourZeroThreeBInput {
  return {
    mode: 'balance',
    scenarioSolve: 'salary',
    currentAge: 40,
    retirementAge: 41,
    balance: 0,
    annualSalary: 60_000,
    salaryGrowthRate: 0,
    contributionKind: 'percent',
    employeePercent: 0.06,
    employeeFixedAnnual: 0,
    contributionIncrease: 0,
    matchKind: 'percent-of-contribution',
    matchRate: 0.5,
    matchUpToPercent: 0.06,
    fixedEmployerPercent: 0,
    annualReturn: 0,
    annualFeeRate: 0,
    frequency: 'yearly',
    targetBalance: null,
    accountType: 'traditional',
    inflationRate: 0,
    vestingPercent: 1,
    timing: 'end',
    rateConvention: 'nominal',
    applyLimits: false,
    electiveDeferralLimit: null,
    catchUpAge: null,
    catchUpAmount: null,
    annualAdditionsLimit: null,
    currency: 'USD',
    ...overrides,
  };
}

function expectResult(input: FourZeroThreeBInput): FourZeroThreeBResult {
  const result = calculateFourZeroThreeB(input);
  assert.ok(result);
  return result;
}

function assertReconciles(input: FourZeroThreeBInput, result: FourZeroThreeBResult): void {
  const cents = (amount: number) => Math.round(amount * 100);
  assert.equal(
    cents(result.startingBalance) +
      cents(result.employeeContributions) +
      cents(result.vestedEmployerContributions) +
      cents(result.investmentGrowth) -
      cents(result.fees),
    cents(result.finalBalance),
  );
  assert.equal(cents(result.startingBalance), cents(input.balance));
  assert.equal(result.impossible, false);
}

describe('403(b) projection', () => {
  it('matches 50% of the first 6% on a 60,000 salary', () => {
    const result = expectResult(base());
    assert.equal(result.firstYearEmployeeContribution, 3600);
    assert.equal(result.firstYearEmployerContribution, 1800);
    assert.equal(result.finalBalance, 5400);
    assert.equal(result.investmentGrowth, 0);
    assert.equal(result.fees, 0);
    assert.equal(result.years, 1);
    assertReconciles(base(), result);
  });

  it('caps a partial match at the stated salary percent', () => {
    const result = expectResult(base({ employeePercent: 0.1 }));
    assert.equal(result.employeeContributions, 6000);
    assert.equal(result.employerContributions, 1800);
    assert.equal(result.finalBalance, 7800);
  });

  it('matches only the deferral the employee actually makes', () => {
    const result = expectResult(base({ employeePercent: 0.03 }));
    assert.equal(result.employeeContributions, 1800);
    assert.equal(result.employerContributions, 900);
  });

  it('treats a 100% match up to 6% as dollar-for-dollar', () => {
    const result = expectResult(base({ matchRate: 1 }));
    assert.equal(result.employeeContributions, 3600);
    assert.equal(result.employerContributions, 3600);
  });

  it('deposits a fixed employer percent even when the employee contributes nothing', () => {
    const result = expectResult(
      base({
        employeePercent: 0,
        matchKind: 'fixed-percent',
        fixedEmployerPercent: 0.03,
      }),
    );
    assert.equal(result.employeeContributions, 0);
    assert.equal(result.employerContributions, 1800);
    assert.equal(result.finalBalance, 1800);
  });

  it('keeps a zero balance and zero contributions at zero', () => {
    const result = expectResult(
      base({
        employeePercent: 0,
        matchKind: 'none',
        annualReturn: 0.05,
      }),
    );
    assert.equal(result.finalBalance, 0);
    assert.equal(result.investmentGrowth, 0);
  });

  it('grows salary once per year and contributes from that year salary', () => {
    const input = base({
      retirementAge: 42,
      salaryGrowthRate: 0.1,
      employeePercent: 0.1,
      matchKind: 'none',
    });
    const result = expectResult(input);
    assert.equal(result.yearly[0]?.salary, 60_000);
    assert.equal(result.yearly[0]?.employeeContribution, 6_000);
    assert.equal(result.yearly[1]?.salary, 66_000);
    assert.equal(result.yearly[1]?.employeeContribution, 6_600);
    assert.equal(result.finalBalance, 12_600);
    assertReconciles(input, result);
  });

  it('adds a percentage point of deferral each year', () => {
    const result = expectResult(
      base({
        retirementAge: 42,
        annualSalary: 10_000,
        employeePercent: 0.1,
        contributionIncrease: 0.01,
        matchKind: 'none',
      }),
    );
    assert.equal(result.yearly[0]?.employeeContribution, 1_000);
    assert.equal(result.yearly[1]?.employeeContribution, 1_100);
    assert.equal(result.finalBalance, 2_100);
  });

  it('invests a beginning-of-period contribution and not an end-of-period one', () => {
    const shared = {
      balance: 1_000,
      employeePercent: 0,
      employeeFixedAnnual: 100,
      contributionKind: 'fixed' as const,
      matchKind: 'none' as const,
      annualReturn: 0.1,
    };
    const end = expectResult(base({ ...shared, timing: 'end' }));
    const beginning = expectResult(base({ ...shared, timing: 'beginning' }));
    assert.equal(end.finalBalance, 1_200);
    assert.equal(end.investmentGrowth, 100);
    assert.equal(beginning.finalBalance, 1_210);
    assert.equal(beginning.investmentGrowth, 110);
  });

  it('uses nominal annual rate divided by the number of periods', () => {
    const periods = 12;
    assert.equal(periodRate(0.12, periods, 'nominal'), 0.01);
    let cents = 100_000;
    const rate = 0.12 / 12;
    for (let month = 0; month < 12; month += 1) cents += Math.round(cents * rate);
    const result = expectResult(
      base({
        balance: 1_000,
        employeePercent: 0,
        matchKind: 'none',
        annualReturn: 0.12,
        frequency: 'monthly',
        rateConvention: 'nominal',
      }),
    );
    assert.equal(Math.round(result.finalBalance * 100), cents);
    assert.equal(result.fees, 0);
  });

  it('uses effective annual compounding only when that convention is selected', () => {
    let cents = 100_000;
    const rate = 1.12 ** (1 / 12) - 1;
    for (let month = 0; month < 12; month += 1) cents += Math.round(cents * rate);
    const effective = expectResult(
      base({
        balance: 1_000,
        employeePercent: 0,
        matchKind: 'none',
        annualReturn: 0.12,
        frequency: 'monthly',
        rateConvention: 'effective',
      }),
    );
    const nominal = expectResult(
      base({
        balance: 1_000,
        employeePercent: 0,
        matchKind: 'none',
        annualReturn: 0.12,
        frequency: 'monthly',
        rateConvention: 'nominal',
      }),
    );
    assert.equal(Math.round(effective.finalBalance * 100), cents);
    assert.notEqual(effective.finalBalance, nominal.finalBalance);
    assert.ok(Math.abs(effective.finalBalance - 1_120) < 0.2);
  });

  it('applies a negative return without producing a negative breakdown', () => {
    const input = base({
      balance: 1_000,
      employeePercent: 0,
      matchKind: 'none',
      annualReturn: -0.1,
    });
    const result = expectResult(input);
    assert.equal(result.finalBalance, 900);
    assert.equal(result.investmentGrowth, -100);
    assert.equal(Number.isFinite(result.finalBalance), true);
    assertReconciles(input, result);
  });

  it('separates fees from investment growth', () => {
    const input = base({
      balance: 1_000,
      employeePercent: 0,
      matchKind: 'none',
      annualReturn: 0.1,
      annualFeeRate: 0.01,
    });
    const result = expectResult(input);
    assert.equal(result.investmentGrowth, 100);
    assert.equal(result.fees, 10);
    assert.equal(result.finalBalance, 1_090);
    assertReconciles(input, result);
  });

  it('deflates the nominal balance by the inflation assumption', () => {
    const result = expectResult(
      base({
        balance: 1_000,
        employeePercent: 0,
        matchKind: 'none',
        annualReturn: 0.1,
        inflationRate: 0.1,
      }),
    );
    assert.equal(result.finalBalance, 1_100);
    assert.equal(result.inflationAdjustedBalance, 1_000);
    assert.equal(result.yearly[0]?.inflationAdjustedBalance, 1_000);
  });

  it('counts only the vested share of the employer deposit', () => {
    const input = base({ vestingPercent: 0.5 });
    const result = expectResult(input);
    assert.equal(result.employerContributions, 1_800);
    assert.equal(result.vestedEmployerContributions, 900);
    assert.equal(result.finalBalance, 4_500);
    assertReconciles(input, result);
  });

  it('splits a biweekly deferral across 26 periods', () => {
    const result = expectResult(
      base({
        annualSalary: 26_000,
        employeePercent: 0.1,
        matchKind: 'none',
        frequency: 'biweekly',
      }),
    );
    assert.equal(result.employeeContributions, 2_600);
    assert.equal(result.finalBalance, 2_600);
  });

  it('caps the employee deferral and then the combined annual addition', () => {
    const elective = expectResult(
      base({
        annualSalary: 100_000,
        employeePercent: 0.2,
        matchKind: 'none',
        applyLimits: true,
        electiveDeferralLimit: 5_000,
      }),
    );
    assert.equal(elective.employeeContributions, 5_000);
    assert.equal(elective.limitsReducedAContribution, true);

    const catchUp = expectResult(
      base({
        currentAge: 50,
        retirementAge: 51,
        annualSalary: 100_000,
        employeePercent: 0.2,
        matchKind: 'none',
        applyLimits: true,
        electiveDeferralLimit: 5_000,
        catchUpAge: 50,
        catchUpAmount: 1_000,
      }),
    );
    assert.equal(catchUp.employeeContributions, 6_000);

    const beforeCatchUp = expectResult(
      base({
        currentAge: 49,
        retirementAge: 50,
        annualSalary: 100_000,
        employeePercent: 0.2,
        matchKind: 'none',
        applyLimits: true,
        electiveDeferralLimit: 5_000,
        catchUpAge: 50,
        catchUpAmount: 1_000,
      }),
    );
    assert.equal(beforeCatchUp.employeeContributions, 5_000);

    const additions = expectResult(
      base({
        annualSalary: 100_000,
        employeePercent: 0.05,
        matchKind: 'fixed-percent',
        fixedEmployerPercent: 0.1,
        applyLimits: true,
        electiveDeferralLimit: 20_000,
        annualAdditionsLimit: 8_000,
      }),
    );
    assert.equal(additions.employeeContributions, 5_000);
    assert.equal(additions.employerContributions, 3_000);
    assert.equal(additions.finalBalance, 8_000);
  });

  it('reconciles a multi-year monthly projection to the cent', () => {
    const input = base({
      currentAge: 35,
      retirementAge: 38,
      balance: 12_345.67,
      annualSalary: 60_000,
      salaryGrowthRate: 0.02,
      employeePercent: 0.06,
      contributionIncrease: 0.005,
      matchRate: 0.5,
      matchUpToPercent: 0.06,
      annualReturn: 0.06,
      annualFeeRate: 0.002,
      frequency: 'monthly',
      timing: 'beginning',
      inflationRate: 0.02,
      vestingPercent: 0.8,
    });
    const result = expectResult(input);
    assert.equal(result.yearly.length, 3);
    assert.equal(result.years, 3);
    assert.ok(result.finalBalance > result.inflationAdjustedBalance);
    assert.equal(Number.isFinite(result.finalBalance), true);
    assertReconciles(input, result);
  });

  it('solves the employee percent that reaches a known balance', () => {
    const result = expectResult(
      base({
        mode: 'employee-contribution',
        employeePercent: 0,
        targetBalance: 5_400,
      }),
    );
    assert.equal(result.impossible, false);
    assert.equal(result.solvedEmployeePercent, 0.06);
    assert.equal(result.finalBalance, 5_400);
    assert.equal(result.firstYearEmployeeContribution, 3_600);
  });

  it('solves a fixed dollar deferral to the cent', () => {
    const result = expectResult(
      base({
        mode: 'employee-contribution',
        contributionKind: 'fixed',
        employeeFixedAnnual: 0,
        matchKind: 'none',
        balance: 1_000,
        annualReturn: 0.1,
        timing: 'end',
        targetBalance: 1_200,
      }),
    );
    assert.equal(result.solvedEmployeeFixedAnnual, 100);
    assert.equal(result.finalBalance, 1_200);
  });

  it('reports an impossible target when the deferral cap cannot reach it', () => {
    const result = expectResult(
      base({
        mode: 'employee-contribution',
        annualSalary: 100_000,
        matchKind: 'none',
        applyLimits: true,
        electiveDeferralLimit: 1_000,
        targetBalance: 50_000,
      }),
    );
    assert.equal(result.impossible, true);
    assert.equal(result.finalBalance, 1_000);
    assert.equal(Number.isFinite(result.finalBalance), true);
  });

  it('solves the salary that produces a percent-of-salary deferral', () => {
    const result = expectResult(
      base({
        mode: 'scenario',
        scenarioSolve: 'salary',
        annualSalary: 0,
        employeePercent: 0.1,
        matchKind: 'none',
        targetBalance: 6_000,
      }),
    );
    assert.equal(result.impossible, false);
    assert.equal(result.solvedSalary, 60_000);
    assert.equal(result.finalBalance, 6_000);
  });

  it('solves the match rate and a flat employer percent', () => {
    const match = expectResult(
      base({
        mode: 'scenario',
        scenarioSolve: 'employer',
        matchRate: 0,
        targetBalance: 5_400,
      }),
    );
    assert.equal(match.solvedEmployerRate, 0.5);
    assert.equal(match.finalBalance, 5_400);

    const flat = expectResult(
      base({
        mode: 'scenario',
        scenarioSolve: 'employer',
        employeePercent: 0,
        matchKind: 'none',
        targetBalance: 1_800,
      }),
    );
    assert.equal(flat.solvedEmployerRate, 0.03);
    assert.equal(flat.employerContributions, 1_800);
  });

  it('rejects an age range and a salary scenario that ignores salary', () => {
    const ages = validateFourZeroThreeB(base({ retirementAge: 40 }));
    assert.equal(ages.isValid, false);
    assert.ok(ages.errors.retirementAge);

    const salary = validateFourZeroThreeB(
      base({
        mode: 'scenario',
        scenarioSolve: 'salary',
        contributionKind: 'fixed',
        employeeFixedAnnual: 1_000,
        matchKind: 'none',
        targetBalance: 2_000,
      }),
    );
    assert.equal(salary.isValid, false);
    assert.ok(salary.errors.scenario);

    const wiped = validateFourZeroThreeB(
      base({ annualReturn: -0.99, annualFeeRate: 0.05, frequency: 'yearly' }),
    );
    assert.equal(wiped.isValid, false);
    assert.equal(calculateFourZeroThreeB(base({ retirementAge: 40 })), null);
    assert.equal(calculateFourZeroThreeB(base({ balance: Number.NaN })), null);
  });

  it('rejects a target above the money ceiling and a negative salary', () => {
    const huge = validateFourZeroThreeB(
      base({ mode: 'employee-contribution', targetBalance: MAX_MONEY + 1 }),
    );
    assert.equal(huge.isValid, false);
    const negative = validateFourZeroThreeB(base({ annualSalary: -1 }));
    assert.equal(negative.isValid, false);
    assert.equal(calculateFourZeroThreeB(base({ annualSalary: -1 })), null);
  });
});
