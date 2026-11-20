import assert from 'node:assert/strict';
import {
  calculateCapRate,
  calculateEffectiveGrossIncome,
  calculateNoi,
  calculateOperatingExpenseRatio,
  calculatePotentialGrossIncome,
  calculatePropertyValueFromCapRate,
  calculateRequiredNoi,
  calculateVacancyLoss,
  convertIncomePeriodDisplay,
  toAnnualIncome,
} from './calculation';
import { createDefaultInput } from './types';
import { validateCapRateInput } from './validation';

function approx(actual: number, expected: number, eps = 1e-9) {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

// Test 1: Basic Cap Rate
{
  assert.equal(calculateCapRate(45_000, 600_000), 7.5);
}

// Test 2: Net Operating Income
{
  const pgi = calculatePotentialGrossIncome(72_000, 3_000)!;
  assert.equal(pgi, 75_000);
  const loss = calculateVacancyLoss(pgi, 5)!;
  assert.equal(loss, 3_750);
  const egi = calculateEffectiveGrossIncome(pgi, loss)!;
  assert.equal(egi, 71_250);
  assert.equal(calculateNoi(egi, 25_000), 46_250);
}

// Test 3: Property Value From Cap Rate
{
  assert.equal(calculatePropertyValueFromCapRate(50_000, 8), 625_000);
}

// Test 4: Required NOI
{
  assert.equal(calculateRequiredNoi(800_000, 6), 48_000);
}

// Test 5: Monthly to Annual Income
{
  assert.equal(toAnnualIncome(4_500, 'monthly'), 54_000);
  assert.equal(toAnnualIncome(54_000, 'annually'), 54_000);
}

// Test 6: Operating Expense Ratio
{
  assert.equal(calculateOperatingExpenseRatio(24_000, 80_000), 30);
}

// Test 7: Zero Property Value → unavailable
{
  assert.equal(calculateCapRate(50_000, 0), null);
}

// Test 8: Negative NOI → negative cap rate
{
  assert.equal(calculateNoi(20_000, 30_000), -10_000);
  assert.equal(calculateCapRate(-10_000, 200_000), -5);
}

// Test 9: Zero NOI → 0%
{
  assert.equal(calculateCapRate(0, 500_000), 0);
}

// Test 10: Invalid reverse cap rate 0%
{
  assert.equal(calculatePropertyValueFromCapRate(50_000, 0), null);
}

// Test 11: Vacancy calculation
{
  const pgi = calculatePotentialGrossIncome(100_000, 0)!;
  const loss = calculateVacancyLoss(pgi, 10)!;
  const egi = calculateEffectiveGrossIncome(pgi, loss)!;
  assert.equal(egi, 90_000);
  assert.equal(calculateNoi(egi, 30_000), 60_000);
}

// Test 12: Reset defaults
{
  const d = createDefaultInput();
  assert.equal(d.currency, 'USD');
  assert.equal(d.incomePeriod, 'annually');
  assert.equal(d.vacancyRate, '0');
  assert.equal(d.propertyValue, '');
  const v = validateCapRateInput(d);
  assert.equal(v.isValid, false);
  assert.equal(v.result, null);
}

// Test 13: Income period switching preserves annual value
{
  const monthly = 4_500;
  const annual = convertIncomePeriodDisplay(monthly, 'monthly', 'annually');
  assert.equal(annual, 54_000);
  approx(convertIncomePeriodDisplay(annual, 'annually', 'monthly'), 4_500);
}

// Test 14: Clearing property value clears cap rate, keeps NOI path
{
  const full = validateCapRateInput({
    ...createDefaultInput(),
    propertyValue: '600000',
    grossRentalIncome: '72000',
    otherIncome: '3000',
    vacancyRate: '5',
    operatingExpenses: '25000',
  });
  assert.equal(full.isValid, true);
  assert.equal(full.result?.noi, 46_250);
  assert.equal(full.result?.capRatePercent, approxCap(46_250, 600_000));

  const clearedPv = validateCapRateInput({
    ...createDefaultInput(),
    propertyValue: '',
    grossRentalIncome: '72000',
    otherIncome: '3000',
    vacancyRate: '5',
    operatingExpenses: '25000',
  });
  assert.equal(clearedPv.isValid, true);
  assert.equal(clearedPv.result?.noi, 46_250);
  assert.equal(clearedPv.result?.capRatePercent, null);
}

function approxCap(noi: number, pv: number) {
  return (noi / pv) * 100;
}

// Test 15: Decimals / reverse / required sections independent
{
  const reverse = validateCapRateInput({
    ...createDefaultInput(),
    reverseNoi: '50000',
    reverseCapRate: '8',
  });
  assert.equal(reverse.result?.estimatedPropertyValue, 625_000);
  assert.equal(reverse.result?.formattedNoi, '');

  const required = validateCapRateInput({
    ...createDefaultInput(),
    requiredPropertyValue: '800000',
    targetCapRate: '6',
  });
  assert.equal(required.result?.requiredAnnualNoi, 48_000);
  approx(required.result!.requiredMonthlyNoi!, 4_000);

  const primary = validateCapRateInput({
    ...createDefaultInput(),
    propertyValue: '600000.50',
    grossRentalIncome: '4500',
    incomePeriod: 'monthly',
    vacancyRate: '0',
    operatingExpenses: '10000',
  });
  assert.equal(primary.result?.annualGrossRental, 54_000);
  assert.ok(primary.result?.capRatePercent !== null);
}

// Expense ratio unavailable when EGI = 0
{
  assert.equal(calculateOperatingExpenseRatio(1_000, 0), null);
}

console.log('cap-rate/calculation.test.ts: all assertions passed');
