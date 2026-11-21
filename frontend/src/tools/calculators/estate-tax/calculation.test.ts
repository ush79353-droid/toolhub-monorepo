/**
 * Run: npx --yes tsx src/tools/calculators/estate-tax/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  APPLICABLE_CREDIT_AMOUNT_2026,
  BASIC_EXCLUSION_AMOUNT_2026,
  calculateEstateTax,
  computeTentativeTax,
} from './calculation';

assert.equal(BASIC_EXCLUSION_AMOUNT_2026, 15_000_000);
assert.equal(APPLICABLE_CREDIT_AMOUNT_2026, 5_945_800);
assert.equal(computeTentativeTax(15_000_000), 5_945_800);
assert.equal(computeTentativeTax(13_990_000), 5_541_800);
assert.equal(computeTentativeTax(1_000_000), 345_800);
assert.equal(computeTentativeTax(10_000), 1_800);

const zero = calculateEstateTax({
  residence: 0,
  investments: 0,
  savings: 0,
  vehicles: 0,
  retirement: 0,
  lifeInsurance: 0,
  otherAssets: 0,
  debts: 0,
  funeralAdmin: 0,
  charitable: 0,
  stateDeathTaxes: 0,
  taxFreeLifetimeGifts: 100_000,
});
assert.ok(zero);
assert.equal(zero.grossEstate, 0);
assert.equal(zero.estimatedFederalEstateTax, 0);
assert.equal(zero.taxFreeLifetimeGifts, 100_000);

const under = calculateEstateTax({
  residence: 5_000_000,
  investments: 4_000_000,
  savings: 1_000_000,
  vehicles: 0,
  retirement: 0,
  lifeInsurance: 0,
  otherAssets: 0,
  debts: 500_000,
  funeralAdmin: 50_000,
  charitable: 0,
  stateDeathTaxes: 0,
  taxFreeLifetimeGifts: 0,
});
assert.ok(under);
assert.equal(under.grossEstate, 10_000_000);
assert.equal(under.allowableDeductions, 550_000);
assert.equal(under.taxableEstate, 9_450_000);
assert.equal(under.estimatedFederalEstateTax, 0);

const over = calculateEstateTax({
  residence: 10_000_000,
  investments: 8_000_000,
  savings: 2_000_000,
  vehicles: 0,
  retirement: 0,
  lifeInsurance: 1_000_000,
  otherAssets: 0,
  debts: 0,
  funeralAdmin: 0,
  charitable: 0,
  stateDeathTaxes: 0,
  taxFreeLifetimeGifts: 50_000,
});
assert.ok(over);
assert.equal(over.grossEstate, 21_000_000);
assert.equal(over.taxableEstate, 21_000_000);
const expectedTax = computeTentativeTax(21_000_000) - APPLICABLE_CREDIT_AMOUNT_2026;
assert.equal(over.estimatedFederalEstateTax, expectedTax);
assert.equal(over.estimatedFederalEstateTax, 2_400_000);

console.log('estate-tax calculation.test.ts: all assertions passed');
