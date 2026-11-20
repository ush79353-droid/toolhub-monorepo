/**
 * Run: npx --yes tsx src/tools/calculators/new-york-tax/calculation.test.ts
 */
import assert from 'node:assert/strict';
import { annualizeAgi, calculateNewYorkTax } from './calculation';
import {
  federalStandardDeduction,
  newYorkStandardDeduction,
  taxFromBrackets,
  newYorkStateBrackets,
  nycBrackets,
} from './tax-parameters';
import { validateNewYorkTaxInput } from './validation';
import { createDefaultInput } from './types';

assert.equal(annualizeAgi(1000, 'month'), 12_000);
assert.equal(annualizeAgi(1000, 'week'), 52_000);
assert.equal(newYorkStandardDeduction('single'), 8_000);
assert.equal(newYorkStandardDeduction('married-joint'), 16_050);
assert.equal(newYorkStandardDeduction('qualifying-surviving-spouse'), 16_050);
assert.equal(federalStandardDeduction(2025, 'single'), 15_750);

// NY State Single: first 8500 @ 4% = 340
assert.ok(
  Math.abs(taxFromBrackets(8_500, newYorkStateBrackets('single')) - 340) < 0.001
);

const example = calculateNewYorkTax({
  taxYear: 2025,
  agiEntered: 80_000,
  incomePeriod: 'year',
  payFrequency: 'weekly',
  filingStatus: 'single',
  nycResident: true,
  additionalDependents: 0,
  itemizedDeductions: 0,
  postTaxDeductions: 0,
});
assert.ok(example);
assert.equal(example.federalDeductionUsed, 15_750);
assert.equal(example.newYorkDeductionUsed, 8_000);
assert.equal(example.federalTaxableIncome, 64_250);
assert.equal(example.newYorkTaxableIncome, 72_000);
assert.equal(example.nycTaxableIncome, 72_000);
assert.ok(Math.abs(example.federalIncomeTax - 9_049) < 0.01);
assert.ok(Math.abs(example.newYorkStateTax - 3_795) < 0.01);
assert.ok(Math.abs(example.nycIncomeTax - 2_665.89) < 0.02);
assert.ok(Math.abs(example.totalIncomeTax - 15_509.89) < 0.02);
assert.ok(Math.abs(example.effectiveTaxRatePercent - 19.3873625) < 0.0001);

// Non-NYC resident — NYC tax zero
const upstate = calculateNewYorkTax({
  taxYear: 2025,
  agiEntered: 80_000,
  incomePeriod: 'year',
  payFrequency: 'weekly',
  filingStatus: 'single',
  nycResident: false,
  additionalDependents: 0,
  itemizedDeductions: 0,
  postTaxDeductions: 0,
});
assert.ok(upstate);
assert.equal(upstate.nycIncomeTax, 0);
assert.ok(
  Math.abs(upstate.totalIncomeTax - example!.totalIncomeTax + example!.nycIncomeTax) <
    0.02
);

// Dependent exemption reduces NY taxable only
const withDeps = calculateNewYorkTax({
  taxYear: 2025,
  agiEntered: 80_000,
  incomePeriod: 'year',
  payFrequency: 'weekly',
  filingStatus: 'single',
  nycResident: true,
  additionalDependents: 2,
  itemizedDeductions: 0,
  postTaxDeductions: 0,
});
assert.ok(withDeps);
assert.equal(withDeps.newYorkTaxableIncome, 70_000);
assert.equal(withDeps.federalTaxableIncome, example!.federalTaxableIncome);

assert.ok(taxFromBrackets(12_000, nycBrackets('single')) > 0);

const zero = calculateNewYorkTax({
  taxYear: 2025,
  agiEntered: 0,
  incomePeriod: 'year',
  payFrequency: 'weekly',
  filingStatus: 'single',
  nycResident: true,
  additionalDependents: 0,
  itemizedDeductions: 0,
  postTaxDeductions: 0,
});
assert.ok(zero);
assert.equal(zero.federalIncomeTax, 0);
assert.equal(zero.newYorkStateTax, 0);
assert.equal(zero.nycIncomeTax, 0);

const validated = validateNewYorkTaxInput({
  ...createDefaultInput(),
  agi: '80000',
});
assert.equal(validated.isValid, true);
assert.equal(validated.result?.federalTaxableIncome, 64_250);

const blank = validateNewYorkTaxInput(createDefaultInput());
assert.equal(blank.isValid, false);

console.log('new-york-tax calculation.test.ts: all assertions passed');