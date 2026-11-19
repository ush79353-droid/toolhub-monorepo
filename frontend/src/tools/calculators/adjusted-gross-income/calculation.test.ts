import assert from 'node:assert/strict';
import {
  applyCapitalLossLimit,
  calculateAgiUsd,
  deductibleHalfSeTax,
  iraDeductionLimit,
  phaseoutFactor,
  studentLoanDeduction,
} from './calculation';

assert.equal(phaseoutFactor(80_000, 85_000, 100_000), 1);
assert.equal(phaseoutFactor(100_000, 85_000, 100_000), 0);
assert.ok(Math.abs(phaseoutFactor(92_500, 85_000, 100_000) - 0.5) < 1e-12);

{
  const r = applyCapitalLossLimit(-10_000, 'single');
  assert.equal(r.included, -3_000);
  assert.equal(r.limited, true);
}
{
  const r = applyCapitalLossLimit(-10_000, 'married-separate');
  assert.equal(r.included, -1_500);
}

{
  const ira = iraDeductionLimit({
    contribution: 7_000,
    magi: 70_000,
    status: 'single',
    coveredByWorkplacePlan: true,
    age50OrOver: false,
  });
  assert.equal(ira.deduction, 7_000);
}
{
  const ira = iraDeductionLimit({
    contribution: 7_000,
    magi: 90_000,
    status: 'single',
    coveredByWorkplacePlan: true,
    age50OrOver: false,
  });
  assert.equal(ira.deduction, 0);
}

{
  const s = studentLoanDeduction({
    interest: 3_000,
    magi: 80_000,
    status: 'single',
  });
  assert.equal(s.deduction, 2_500);
}
{
  const s = studentLoanDeduction({
    interest: 2_500,
    magi: 100_000,
    status: 'single',
  });
  assert.equal(s.deduction, 0);
}
{
  const s = studentLoanDeduction({
    interest: 2_500,
    magi: 50_000,
    status: 'married-separate',
  });
  assert.equal(s.deduction, 0);
}

assert.ok(deductibleHalfSeTax(100_000) > 0);

// Guide example: single, not covered, wages 80k, IRA 7k
{
  const r = calculateAgiUsd({
    filingStatus: 'single',
    age50OrOver: false,
    age55OrOver: false,
    coveredByWorkplacePlan: false,
    hsaCoverage: 'self-only',
    selfEmployedHealthInsurance: false,
    alimonyReceivedPre2019: false,
    alimonyPaidPre2019: false,
    armedForcesMove: false,
    includeMoreIncome: false,
    includeMoreDeductions: false,
    income: {
      wages: 80_000,
      business: 0,
      interestDividends: 0,
      capitalGains: 0,
      retirementDistributions: 0,
      unemployment: 0,
      alimonyReceived: 0,
      taxableSocialSecurity: 0,
      otherIncome: 0,
    },
    adjustments: {
      iraContributions: 7_000,
      studentLoanInterest: 0,
      educatorExpenses: 0,
      hsaContributions: 0,
      healthInsurancePremiums: 0,
      earlyWithdrawalPenalty: 0,
      alimonyPaid: 0,
      movingExpenses: 0,
    },
  });
  assert.ok(r);
  assert.equal(r.grossIncomeUsd, 80_000);
  assert.equal(r.iraDeductionUsd, 7_000);
  assert.equal(r.totalAdjustmentsUsd, 7_000);
  assert.equal(r.agiUsd, 73_000);
}

// Health premiums blocked without SE eligibility
{
  const r = calculateAgiUsd({
    filingStatus: 'single',
    age50OrOver: false,
    age55OrOver: false,
    coveredByWorkplacePlan: false,
    hsaCoverage: 'self-only',
    selfEmployedHealthInsurance: false,
    alimonyReceivedPre2019: false,
    alimonyPaidPre2019: false,
    armedForcesMove: false,
    includeMoreIncome: false,
    includeMoreDeductions: false,
    income: {
      wages: 50_000,
      business: 0,
      interestDividends: 0,
      capitalGains: 0,
      retirementDistributions: 0,
      unemployment: 0,
      alimonyReceived: 0,
      taxableSocialSecurity: 0,
      otherIncome: 0,
    },
    adjustments: {
      iraContributions: 0,
      studentLoanInterest: 0,
      educatorExpenses: 0,
      hsaContributions: 0,
      healthInsurancePremiums: 5_000,
      earlyWithdrawalPenalty: 0,
      alimonyPaid: 0,
      movingExpenses: 0,
    },
  });
  assert.ok(r);
  assert.equal(r.seHealthDeductionUsd, 0);
  assert.equal(r.agiUsd, 50_000);
}

console.log('calculation.test.ts: ok');
