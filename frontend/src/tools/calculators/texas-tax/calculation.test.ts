/**
 * Run: npx --yes tsx src/tools/calculators/texas-tax/calculation.test.ts
 */
import assert from 'node:assert/strict';
import { calculateTexasTax, annualizeAgi } from './calculation';
import { TEXAS_COUNTY_RATES } from './counties';
import {
  federalOrdinaryBrackets,
  federalStandardDeduction,
  taxFromBrackets,
  TEXAS_STATE_INCOME_TAX,
} from './tax-parameters';
import { validateTexasTaxInput } from './validation';
import { createDefaultInput } from './types';

assert.equal(TEXAS_COUNTY_RATES.length, 250);
assert.equal(annualizeAgi(1000, 'month'), 12_000);
assert.equal(TEXAS_STATE_INCOME_TAX, 0);

const example = calculateTexasTax({
  taxYear: 2026,
  agiEntered: 80_000,
  incomePeriod: 'year',
  payFrequency: 'weekly',
  filingStatus: 'single',
  additionalDependents: 0,
  itemizedDeductions: 0,
  postTaxDeductions: 0,
  assessedHomeValue: 200_000,
  propertyTaxRatePercent: 0.919,
  county: 'anderson',
});
assert.ok(example);
assert.equal(example.texasStateIncomeTax, 0);
assert.equal(example.combinedIncomeTax, example.federalIncomeTax);

const fedTaxable = Math.max(
  0,
  80_000 - federalStandardDeduction(2026, 'single')
);
const expectedFederal = taxFromBrackets(
  fedTaxable,
  federalOrdinaryBrackets(2026, 'single')
);
assert.ok(Math.abs(example.federalIncomeTax - expectedFederal) < 0.02);
assert.ok(Math.abs(example.estimatedPropertyTax - 200_000 * 0.00919) < 0.01);
assert.equal(example.incomeTaxPerPayPeriod, example.combinedIncomeTax / 52);

const validated = validateTexasTaxInput({
  ...createDefaultInput(),
  agi: '80000',
});
assert.equal(validated.isValid, true);
assert.equal(validated.result?.texasStateIncomeTax, 0);

console.log('texas-tax calculation.test.ts: all assertions passed');