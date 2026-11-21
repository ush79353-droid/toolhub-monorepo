import assert from 'node:assert/strict';
import {
  apyToNominal,
  balanceAtYears,
  calculateCd,
  generateAnnualCdSchedule,
  nominalToApy,
} from './calculation';
import { validateCdInput } from './validation';
import { createDefaultInput, createExampleInput } from './types';

function nearly(actual: number, expected: number, eps = 0.02) {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`,
  );
}

// Test Case 1 — Basic annual compounding (reference screenshot)
{
  const r = calculateCd({
    initialDeposit: 10_000,
    interestRatePercent: 5,
    rateConvention: 'nominal',
    compounding: 'annually',
    depositYears: 3,
    depositMonths: 0,
    marginalTaxRatePercent: 0,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.grossFinalBalance, 11_576.25);
  assert.equal(r.grossInterest, 1_576.25);
  assert.equal(r.estimatedTax, 0);
  assert.equal(r.afterTaxBalance, 11_576.25);
  assert.equal(r.annualSchedule.length, 3);
  assert.equal(r.annualSchedule[0]!.deposit, 10_000);
  assert.equal(r.annualSchedule[0]!.interest, 500);
  assert.equal(r.annualSchedule[0]!.endingBalance, 10_500);
  assert.equal(r.annualSchedule[1]!.deposit, 0);
  assert.equal(r.annualSchedule[1]!.interest, 525);
  assert.equal(r.annualSchedule[1]!.endingBalance, 11_025);
  assert.equal(r.annualSchedule[2]!.interest, 551.25);
  assert.equal(r.annualSchedule[2]!.endingBalance, 11_576.25);
  assert.equal(r.monthlySchedule.length, 36);
  assert.equal(r.monthlySchedule[35]!.endingBalance, 11_576.25);
}

// Test Case 2 — Monthly compounding
{
  const r = calculateCd({
    initialDeposit: 10_000,
    interestRatePercent: 5,
    rateConvention: 'nominal',
    compounding: 'monthly',
    depositYears: 3,
    depositMonths: 0,
    marginalTaxRatePercent: 0,
    currency: 'USD',
  });
  assert.ok(r);
  nearly(r.grossFinalBalance, 11_614.72);
  nearly(r.grossInterest, 1_614.72);
}

// Test Case 3 — Quarterly compounding
{
  const r = calculateCd({
    initialDeposit: 10_000,
    interestRatePercent: 5,
    rateConvention: 'nominal',
    compounding: 'quarterly',
    depositYears: 3,
    depositMonths: 0,
    marginalTaxRatePercent: 0,
    currency: 'USD',
  });
  assert.ok(r);
  nearly(r.grossFinalBalance, 11_607.55, 0.05);
}

// Test Case 4 — Six-month deposit
{
  const r = calculateCd({
    initialDeposit: 10_000,
    interestRatePercent: 5,
    rateConvention: 'nominal',
    compounding: 'annually',
    depositYears: 0,
    depositMonths: 6,
    marginalTaxRatePercent: 0,
    currency: 'USD',
  });
  assert.ok(r);
  nearly(r.grossFinalBalance, 10_246.95);
  nearly(r.grossInterest, 246.95);
  assert.equal(r.monthlySchedule.length, 6);
  assert.equal(r.annualSchedule.length, 1);
}

// Test Case 5 — Tax-adjusted interest
{
  const r = calculateCd({
    initialDeposit: 10_000,
    interestRatePercent: 5,
    rateConvention: 'nominal',
    compounding: 'annually',
    depositYears: 3,
    depositMonths: 0,
    marginalTaxRatePercent: 20,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.grossFinalBalance, 11_576.25);
  assert.equal(r.grossInterest, 1_576.25);
  assert.equal(r.estimatedTax, 315.25);
  assert.equal(r.netInterest, 1_261);
  assert.equal(r.afterTaxBalance, 11_261);
}

// Test Case 6 — Zero interest
{
  const r = calculateCd({
    initialDeposit: 10_000,
    interestRatePercent: 0,
    rateConvention: 'nominal',
    compounding: 'monthly',
    depositYears: 3,
    depositMonths: 0,
    marginalTaxRatePercent: 20,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.grossFinalBalance, 10_000);
  assert.equal(r.grossInterest, 0);
  assert.equal(r.estimatedTax, 0);
}

// Test Case 7 — Large deposit
{
  const r = calculateCd({
    initialDeposit: 1_000_000,
    interestRatePercent: 5,
    rateConvention: 'nominal',
    compounding: 'annually',
    depositYears: 5,
    depositMonths: 0,
    marginalTaxRatePercent: 0,
    currency: 'USD',
  });
  assert.ok(r);
  nearly(r.grossFinalBalance, 1_276_281.56);
}

// Daily / weekly / semiannual frequencies
{
  for (const compounding of ['daily', 'weekly', 'semiannually'] as const) {
    const r = calculateCd({
      initialDeposit: 10_000,
      interestRatePercent: 5,
      rateConvention: 'nominal',
      compounding,
      depositYears: 1,
      depositMonths: 0,
      marginalTaxRatePercent: 0,
      currency: 'USD',
    });
    assert.ok(r);
    assert.ok(r.grossFinalBalance > 10_000);
    assert.ok(r.effectiveApyPercent >= 5 - 1e-9);
  }
}

// APY convention does not double-compound
{
  const fromApy = calculateCd({
    initialDeposit: 10_000,
    interestRatePercent: 5,
    rateConvention: 'apy',
    compounding: 'monthly',
    depositYears: 1,
    depositMonths: 0,
    marginalTaxRatePercent: 0,
    currency: 'USD',
  });
  assert.ok(fromApy);
  nearly(fromApy.grossFinalBalance, 10_500, 0.05);
  nearly(fromApy.effectiveApyPercent, 5, 1e-6);

  const nominal = apyToNominal(0.05, 12);
  const apyBack = nominalToApy(nominal, 12);
  nearly(apyBack, 0.05, 1e-10);
}

// Validation: reject zero deposit, bad months, tax > 100
{
  assert.equal(
    calculateCd({
      initialDeposit: 0,
      interestRatePercent: 5,
      rateConvention: 'nominal',
      compounding: 'annually',
      depositYears: 1,
      depositMonths: 0,
      marginalTaxRatePercent: 0,
      currency: 'USD',
    }),
    null,
  );
  assert.equal(
    calculateCd({
      initialDeposit: 1000,
      interestRatePercent: 5,
      rateConvention: 'nominal',
      compounding: 'annually',
      depositYears: 1,
      depositMonths: 12,
      marginalTaxRatePercent: 0,
      currency: 'USD',
    }),
    null,
  );
  assert.equal(
    calculateCd({
      initialDeposit: 1000,
      interestRatePercent: 5,
      rateConvention: 'nominal',
      compounding: 'annually',
      depositYears: 1,
      depositMonths: 0,
      marginalTaxRatePercent: 101,
      currency: 'USD',
    }),
    null,
  );

  const empty = validateCdInput(createDefaultInput());
  assert.equal(empty.isValid, false);

  const example = validateCdInput(createExampleInput());
  assert.equal(example.isValid, true);
  assert.ok(example.result);
  assert.equal(example.result.grossFinalBalance, 11_576.25);
}

// Schedule reconciles to maturity
{
  const principal = 10_000;
  const nominal = 0.05;
  const n = 1;
  const years = 3;
  const schedule = generateAnnualCdSchedule({
    principal,
    nominalDecimal: nominal,
    compoundsPerYear: n,
    durationYears: years,
    currency: 'USD',
  });
  const maturity = balanceAtYears(principal, nominal, n, years);
  nearly(schedule[schedule.length - 1]!.endingBalance, Math.round(maturity * 100) / 100);
}

console.log('cd/calculation.test.ts: all assertions passed');
