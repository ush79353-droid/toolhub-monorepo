import assert from 'node:assert/strict';
import { calculateMarriageTax, type SpouseAmounts } from './calculation';

const baseSpouse = (overrides: Partial<SpouseAmounts> = {}): SpouseAmounts => ({
  salaryBusiness: 65_000,
  interestDividends: 0,
  rentalPassive: 0,
  shortTermGain: 0,
  longTermGain: 0,
  qualifiedDividends: 0,
  retirementSavings: 10_000,
  fileStatus: 'single',
  dependents: 0,
  useStandardDeduction: true,
  stateCityTaxRatePercent: 5,
  selfEmployed: false,
  ...overrides,
});

{
  const result = calculateMarriageTax({
    spouse1: baseSpouse({ salaryBusiness: 65_000, retirementSavings: 10_000 }),
    spouse2: baseSpouse({ salaryBusiness: 45_000, retirementSavings: 6_000 }),
  });
  assert.ok(result);
  assert.ok(result.before.totalTax > 0);
  assert.ok(result.after.totalTax > 0);
  assert.ok(Number.isFinite(result.difference));
}

{
  assert.equal(
    calculateMarriageTax({
      spouse1: baseSpouse({ salaryBusiness: -1 }),
      spouse2: baseSpouse(),
    }),
    null
  );
}

console.log('marriage-tax calculation.test.ts: all assertions passed');
