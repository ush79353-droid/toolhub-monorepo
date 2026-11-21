/**
 * Run: npx --yes tsx src/tools/calculators/alabama-tax/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  annualizeAgi,
  calculateAlabamaStateTax,
  calculateAlabamaTax,
} from './calculation';
import { standardDeduction, dependentExemptionPer } from './tax-parameters';
import { validateAlabamaTaxInput } from './validation';
import { createDefaultInput } from './types';

assert.equal(annualizeAgi(1000, 'month'), 12_000);
assert.equal(annualizeAgi(1000, 'week'), 52_000);
assert.equal(standardDeduction('single', 20_000), 3000);
assert.equal(standardDeduction('single', 50_000), 2500);
assert.equal(standardDeduction('married-joint', 20_000), 8500);
assert.equal(dependentExemptionPer(40_000), 1000);
assert.equal(dependentExemptionPer(75_000), 500);
assert.equal(dependentExemptionPer(120_000), 300);

// Single: first 500 @ 2%, next 2500 @ 4%, rest @ 5%
// Taxable 3000 → 10 + 100 = 110
assert.equal(calculateAlabamaStateTax(3000, 'single'), 110);
// Taxable 46000 → 10 + 100 + 2150 = 2260
assert.equal(calculateAlabamaStateTax(46_000, 'single'), 2260);

const example = calculateAlabamaTax({
  taxYear: 2026,
  agiEntered: 50_000,
  incomePeriod: 'year',
  payFrequency: 'weekly',
  filingStatus: 'single',
  jurisdiction: 'bessemer',
  additionalDependents: 0,
  itemizedDeductions: 0,
  postTaxDeductions: 0,
});
assert.ok(example);
assert.equal(example.standardDeduction, 2500);
assert.equal(example.personalExemption, 1500);
assert.equal(example.taxableIncome, 46_000);
assert.equal(example.stateIncomeTax, 2260);
assert.equal(example.localOccupationalTax, 500);
assert.equal(example.totalTax, 2760);

const gadsden = calculateAlabamaTax({
  taxYear: 2026,
  agiEntered: 50_000,
  incomePeriod: 'year',
  payFrequency: 'annually',
  filingStatus: 'single',
  jurisdiction: 'gadsden',
  additionalDependents: 0,
  itemizedDeductions: 0,
  postTaxDeductions: 0,
});
assert.ok(gadsden);
assert.equal(gadsden.localOccupationalTax, 1000);

const validated = validateAlabamaTaxInput({
  ...createDefaultInput(),
  agi: '50000',
});
assert.equal(validated.isValid, true);
assert.equal(validated.result?.taxableIncome, 46_000);

const blank = validateAlabamaTaxInput(createDefaultInput());
assert.equal(blank.isValid, false);

console.log('alabama-tax calculation.test.ts: all assertions passed');
