/**
 * Run: npx --yes tsx src/tools/calculators/illinois-tax/calculation.test.ts
 */
import assert from 'node:assert/strict';
import { calculateIllinoisTax, annualizeAgi } from './calculation';
import { ILLINOIS_COUNTY_RATES } from './counties';
import { illinoisExemptionAllowance, ILLINOIS_INCOME_TAX_RATE } from './tax-parameters';
import { validateIllinoisTaxInput } from './validation';
import { createDefaultInput } from './types';

assert.equal(ILLINOIS_COUNTY_RATES.length, 102);
assert.equal(annualizeAgi(1000, 'month'), 12_000);
assert.equal(illinoisExemptionAllowance(2026, 'single', 80_000, 0), 2_925);
assert.equal(illinoisExemptionAllowance(2026, 'single', 300_000, 0), 0);
assert.equal(illinoisExemptionAllowance(2025, 'married-joint', 100_000, 1), 2_850 * 3);

const example = calculateIllinoisTax({
  taxYear: 2026,
  agiEntered: 80_000,
  incomePeriod: 'year',
  payFrequency: 'weekly',
  filingStatus: 'single',
  additionalDependents: 0,
  itemizedDeductions: 0,
  postTaxDeductions: 0,
  assessedHomeValue: 200_000,
  propertyTaxRatePercent: 1.582,
  county: 'adams',
});
assert.ok(example);
assert.equal(example.illinoisTaxableIncome, 80_000 - 2_925);
assert.ok(
  Math.abs(example.illinoisIncomeTax - example.illinoisTaxableIncome * ILLINOIS_INCOME_TAX_RATE) <
    1e-6
);
assert.ok(Math.abs(example.estimatedPropertyTax - 200_000 * 0.01582) < 0.01);

const validated = validateIllinoisTaxInput({
  ...createDefaultInput(),
  agi: '80000',
});
assert.equal(validated.isValid, true);

console.log('illinois-tax calculation.test.ts: all assertions passed');
