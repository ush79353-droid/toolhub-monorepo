import assert from 'node:assert/strict';
import {
  calculateContributionMargin,
  calculateContributionMarginDOL,
  calculateDegreeOfOperatingLeverage,
  calculateEBIT,
  calculateEBITChangeFromDOL,
  calculateSalesChangeFromDOL,
} from './calculation';
import { createDefaultInput } from './types';
import { validateDegreeOfOperatingLeverageInput } from './validation';

assert.equal(calculateDegreeOfOperatingLeverage(30, 10), 3);
assert.equal(calculateDegreeOfOperatingLeverage(10, 5), 2);
assert.equal(calculateDegreeOfOperatingLeverage(15, 15), 1);
assert.equal(calculateDegreeOfOperatingLeverage(-25, -10), 2.5);
assert.equal(calculateDegreeOfOperatingLeverage(-20, 10), -2);
assert.equal(calculateDegreeOfOperatingLeverage(10, 0), null);
assert.equal(calculateDegreeOfOperatingLeverage(0, 0), null);
assert.equal(calculateDegreeOfOperatingLeverage(0, 10), 0);

assert.equal(calculateEBITChangeFromDOL(3, 8), 24);
assert.equal(calculateSalesChangeFromDOL(20, 2.5), 8);
assert.equal(calculateSalesChangeFromDOL(20, 0), null);

assert.equal(calculateContributionMargin(500_000, 300_000), 200_000);
assert.equal(calculateEBIT(200_000, 100_000), 100_000);
assert.equal(calculateContributionMarginDOL(200_000, 100_000), 2);
assert.equal(calculateContributionMarginDOL(200_000, 0), null);

const standard = validateDegreeOfOperatingLeverageInput({
  ...createDefaultInput(),
  salesChangePercentage: '10',
  ebitChangePercentage: '30',
});
assert.equal(standard.isValid, true);
assert.equal(standard.result?.degreeOfOperatingLeverage, 3);

const opposite = validateDegreeOfOperatingLeverageInput({
  ...createDefaultInput(),
  salesChangePercentage: '10',
  ebitChangePercentage: '-20',
});
assert.equal(opposite.result?.degreeOfOperatingLeverage, -2);

const zeroSales = validateDegreeOfOperatingLeverageInput({
  ...createDefaultInput(),
  salesChangePercentage: '0',
  ebitChangePercentage: '10',
});
assert.equal(zeroSales.result, null);
assert.ok(zeroSales.errors.form);

const reverseEbit = validateDegreeOfOperatingLeverageInput({
  ...createDefaultInput(),
  mode: 'ebitChange',
  degreeOfOperatingLeverage: '3',
  salesChangePercentage: '8',
});
assert.equal(reverseEbit.result?.ebitChangePercentage, 24);

const reverseSales = validateDegreeOfOperatingLeverageInput({
  ...createDefaultInput(),
  mode: 'salesChange',
  degreeOfOperatingLeverage: '2.5',
  ebitChangePercentage: '20',
});
assert.equal(reverseSales.result?.salesChangePercentage, 8);

const cm = validateDegreeOfOperatingLeverageInput({
  ...createDefaultInput(),
  method: 'contributionMargin',
  salesRevenue: '500000',
  variableCosts: '300000',
  fixedOperatingCosts: '100000',
});
assert.equal(cm.result?.contributionMargin, 200_000);
assert.equal(cm.result?.operatingIncome, 100_000);
assert.equal(cm.result?.degreeOfOperatingLeverage, 2);

const zeroEbit = validateDegreeOfOperatingLeverageInput({
  ...createDefaultInput(),
  method: 'contributionMargin',
  salesRevenue: '500000',
  variableCosts: '300000',
  fixedOperatingCosts: '200000',
});
assert.equal(zeroEbit.result, null);
assert.ok(zeroEbit.errors.form);

const faq = validateDegreeOfOperatingLeverageInput({
  ...createDefaultInput(),
  salesChangePercentage: '10',
  ebitChangePercentage: '25',
});
assert.equal(faq.result?.degreeOfOperatingLeverage, 2.5);

const blank = validateDegreeOfOperatingLeverageInput(createDefaultInput());
assert.equal(blank.result, null);

console.log(
  'degree-of-operating-leverage/calculation.test.ts: all assertions passed'
);
