/**
 * Run: npx --yes tsx src/tools/calculators/california-tax/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  annualizeAgi,
  calculateCaliforniaTax,
  phaseOutExemptionCredits,
} from './calculation';
import {
  californiaStandardDeduction,
  taxFromBrackets,
  californiaBrackets,
  federalStandardDeduction,
} from './tax-parameters';
import { validateCaliforniaTaxInput } from './validation';
import { createDefaultInput } from './types';

assert.equal(annualizeAgi(1000, 'month'), 12_000);
assert.equal(annualizeAgi(1000, 'week'), 52_000);
assert.equal(californiaStandardDeduction('single'), 5_706);
assert.equal(californiaStandardDeduction('married-joint'), 11_412);
assert.equal(federalStandardDeduction(2025, 'single'), 15_750);

// Single CA: first 11079 @ 1% = 110.79
assert.ok(
  Math.abs(taxFromBrackets(11_079, californiaBrackets('single')) - 110.79) < 0.001
);

const example = calculateCaliforniaTax({
  taxYear: 2025,
  agiEntered: 80_000,
  incomePeriod: 'year',
  payFrequency: 'weekly',
  filingStatus: 'single',
  additionalDependents: 0,
  itemizedDeductions: 0,
  postTaxDeductions: 0,
  assessedHomeValue: 500_000,
  propertyTaxRatePercent: 1.22,
});
assert.ok(example);
assert.equal(example.federalDeductionUsed, 15_750);
assert.equal(example.californiaDeductionUsed, 5_706);
assert.equal(example.federalTaxableIncome, 64_250);
assert.equal(example.californiaTaxableIncome, 74_294);
assert.ok(example.federalIncomeTax > 0);
assert.ok(example.californiaIncomeTax > 0);
assert.ok(example.socialSecurityTax > 0);
assert.ok(example.californiaSdiTax > 0);
assert.ok(
  Math.abs(example.estimatedPropertyTax - 500_000 * 0.0122) < 0.001
);

// Zero income / zero property
const zero = calculateCaliforniaTax({
  taxYear: 2025,
  agiEntered: 0,
  incomePeriod: 'year',
  payFrequency: 'annually',
  filingStatus: 'single',
  additionalDependents: 0,
  itemizedDeductions: 0,
  postTaxDeductions: 0,
  assessedHomeValue: 0,
  propertyTaxRatePercent: 1.22,
});
assert.ok(zero);
assert.equal(zero.federalIncomeTax, 0);
assert.equal(zero.californiaIncomeTax, 0);
assert.equal(zero.payrollTaxes, 0);
assert.equal(zero.estimatedPropertyTax, 0);

assert.equal(phaseOutExemptionCredits(153, 100_000, 'single'), 153);
assert.equal(phaseOutExemptionCredits(153, 252_203, 'single'), 153);
assert.ok(phaseOutExemptionCredits(153, 300_000, 'single') < 153);

const validated = validateCaliforniaTaxInput({
  ...createDefaultInput(),
  agi: '80000',
});
assert.equal(validated.isValid, true);
assert.equal(validated.result?.federalTaxableIncome, 64_250);

const blank = validateCaliforniaTaxInput(createDefaultInput());
assert.equal(blank.isValid, false);

console.log('california-tax calculation.test.ts: all assertions passed');
