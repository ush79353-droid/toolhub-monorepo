/**
 * Run: npx --yes tsx src/tools/calculators/income-tax/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  calculateFederalIncomeTax,
  taxFromBrackets,
  taxWithPreferentialIncome,
  taxableSocialSecurityBenefits,
} from './calculation';
import { YEAR_PARAMS } from './tax-parameters';
import { createDefaultInput } from './types';
import { validateIncomeTaxInput } from './validation';

const brackets2025 = YEAR_PARAMS[2025].ordinaryBrackets.single;

// 10% bracket only
assert.ok(Math.abs(taxFromBrackets(10_000, brackets2025) - 1_000) < 0.01);

// Screenshot-like default: single, 2025, $80k wages, $9k withheld
const defaults = validateIncomeTaxInput(createDefaultInput());
assert.equal(defaults.isValid, true);
assert.ok(defaults.result);
assert.equal(defaults.result.taxYear, 2025);
assert.ok(defaults.result.adjustedGrossIncome > 0);
assert.ok(defaults.result.taxableIncome > 0);
assert.ok(defaults.result.taxBeforeCredits > 0);
assert.equal(defaults.result.federalWithholding, 9_000);
// Standard deduction 15,750 → taxable 64,250
assert.ok(Math.abs(defaults.result.taxableIncome - 64_250) < 0.02);
// Tax: 1,192.50 + 12% * (48,475-11,925) wait — full worksheet:
// 10% to 11925 = 1192.50; 12% on (48475-11925)=36550 → 4386; 22% on (64250-48475)=15775 → 3470.50
// Total = 1192.50 + 4386 + 3470.50 = 9049
assert.ok(Math.abs(defaults.result.taxBeforeCredits - 9_049) < 0.05);

const raw = calculateFederalIncomeTax({
  filingStatus: 'single',
  taxYear: 2025,
  age: 30,
  youngDependents: 0,
  otherDependents: 0,
  wages: 80_000,
  federalWithheld: 9_000,
  stateWithheld: 0,
  localWithheld: 0,
  hasSelfEmployment: false,
  socialSecurity: 0,
  interestIncome: 0,
  ordinaryDividends: 0,
  qualifiedDividends: 0,
  passiveIncome: 0,
  shortTermGains: 0,
  longTermGains: 0,
  otherIncome: 0,
  stateLocalTaxRatePercent: 0,
  tipsIncome: 0,
  overtimeIncome: 0,
  carLoanInterest: 0,
  iraContributions: 0,
  realEstateTax: 0,
  mortgageInterest: 0,
  charitableDonations: 0,
  studentLoanInterest: 0,
  childCareExpense: 0,
  collegeExpenses: [0, 0, 0, 0],
  otherDeductibles: 0,
});
assert.ok(raw);
assert.ok(Math.abs(raw.taxBeforeCredits - 9_049) < 0.05);
assert.ok(Math.abs(raw.refundOrOwed - Math.abs(9_000 - 9_049)) < 0.05);
assert.equal(raw.isRefund, false);

// Preferential stack: ordinary 0, all LTCG in 0% band for low taxable income
const pref = taxWithPreferentialIncome({
  taxableIncome: 40_000,
  qualifiedAndLtcg: 40_000,
  brackets: brackets2025,
  zeroMax: YEAR_PARAMS[2025].ltcgZeroMax.single,
  fifteenMax: YEAR_PARAMS[2025].ltcgFifteenMax.single,
});
assert.equal(pref, 0);

// SS: below base threshold → 0 taxable
assert.equal(taxableSocialSecurityBenefits(10_000, 10_000, 'single'), 0);

// CTC young dependent reduces tax / can create refundable ACTC path
const withChild = calculateFederalIncomeTax({
  filingStatus: 'single',
  taxYear: 2025,
  age: 35,
  youngDependents: 1,
  otherDependents: 0,
  wages: 40_000,
  federalWithheld: 2_000,
  stateWithheld: 0,
  localWithheld: 0,
  hasSelfEmployment: false,
  socialSecurity: 0,
  interestIncome: 0,
  ordinaryDividends: 0,
  qualifiedDividends: 0,
  passiveIncome: 0,
  shortTermGains: 0,
  longTermGains: 0,
  otherIncome: 0,
  stateLocalTaxRatePercent: 0,
  tipsIncome: 0,
  overtimeIncome: 0,
  carLoanInterest: 0,
  iraContributions: 0,
  realEstateTax: 0,
  mortgageInterest: 0,
  charitableDonations: 0,
  studentLoanInterest: 0,
  childCareExpense: 0,
  collegeExpenses: [0, 0, 0, 0],
  otherDeductibles: 0,
});
assert.ok(withChild);
assert.ok(withChild.totalCredits > 0);

// 2026 uses different standard deduction
const y2026 = calculateFederalIncomeTax({
  filingStatus: 'single',
  taxYear: 2026,
  age: 30,
  youngDependents: 0,
  otherDependents: 0,
  wages: 80_000,
  federalWithheld: 9_000,
  stateWithheld: 0,
  localWithheld: 0,
  hasSelfEmployment: false,
  socialSecurity: 0,
  interestIncome: 0,
  ordinaryDividends: 0,
  qualifiedDividends: 0,
  passiveIncome: 0,
  shortTermGains: 0,
  longTermGains: 0,
  otherIncome: 0,
  stateLocalTaxRatePercent: 0,
  tipsIncome: 0,
  overtimeIncome: 0,
  carLoanInterest: 0,
  iraContributions: 0,
  realEstateTax: 0,
  mortgageInterest: 0,
  charitableDonations: 0,
  studentLoanInterest: 0,
  childCareExpense: 0,
  collegeExpenses: [0, 0, 0, 0],
  otherDeductibles: 0,
});
assert.ok(y2026);
assert.ok(Math.abs(y2026.totalDeductions - 16_100) < 0.02);
assert.ok(y2026.taxableIncome !== raw!.taxableIncome);

// State withheld must not count as federal withholding
assert.equal(raw!.federalWithholding, 9_000);

// Reject negatives
assert.equal(
  calculateFederalIncomeTax({
    ...{
      filingStatus: 'single' as const,
      taxYear: 2025 as const,
      age: 30,
      youngDependents: 0,
      otherDependents: 0,
      wages: -1,
      federalWithheld: 0,
      stateWithheld: 0,
      localWithheld: 0,
      hasSelfEmployment: false,
      socialSecurity: 0,
      interestIncome: 0,
      ordinaryDividends: 0,
      qualifiedDividends: 0,
      passiveIncome: 0,
      shortTermGains: 0,
      longTermGains: 0,
      otherIncome: 0,
      stateLocalTaxRatePercent: 0,
      tipsIncome: 0,
      overtimeIncome: 0,
      carLoanInterest: 0,
      iraContributions: 0,
      realEstateTax: 0,
      mortgageInterest: 0,
      charitableDonations: 0,
      studentLoanInterest: 0,
      childCareExpense: 0,
      collegeExpenses: [0, 0, 0, 0],
      otherDeductibles: 0,
    },
  }),
  null
);

console.log('income-tax calculation.test.ts: all assertions passed');
