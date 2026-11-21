import assert from 'node:assert/strict';
import {
  amortizedAnnualWithdrawal,
  calculateRetirement,
  futureValueLumpSum,
  futureValueOrdinaryAnnuity,
  periodToAnnual,
} from './calculation';

assert.equal(periodToAnnual(500, 'month'), 6000);
assert.equal(periodToAnnual(6000, 'year'), 6000);

// FV lump: 50_000 at 7% for 27 years
const fvLump = futureValueLumpSum(50_000, 0.07, 27);
assert.ok(fvLump !== null);
assert.ok(Math.abs(fvLump! - 50_000 * Math.pow(1.07, 27)) < 1e-6);

// FV annuity: 6_000/yr at 7% for 27 years
const fvAnn = futureValueOrdinaryAnnuity(6000, 0.07, 27);
assert.ok(fvAnn !== null);
const expectedAnn = (6000 * (Math.pow(1.07, 27) - 1)) / 0.07;
assert.ok(Math.abs(fvAnn! - expectedAnn) < 1e-6);

// Zero-rate annuity
assert.equal(futureValueOrdinaryAnnuity(1000, 0, 10), 10_000);

// Amortized withdrawal: 100k at 0% over 10 years → 10k/yr
assert.equal(amortizedAnnualWithdrawal(100_000, 0, 10), 10_000);

// Worked example (defaults shape): age 40 → 67 → 81.4, 50k + 500/mo, 7%, SS 1922/mo, COL 4000/mo
const example = calculateRetirement({
  sex: 'female',
  country: 'US',
  currentAge: 40,
  retirementAge: 67,
  lifeExpectancy: 81.4,
  annualSavings: 6000,
  alreadySaved: 50_000,
  annualReturnPercent: 7,
  governmentPensionAnnual: 1922 * 12,
  costOfLivingAnnual: 4000 * 12,
});
assert.ok(example);
assert.equal(example!.yearsToRetirement, 27);
assert.ok(Math.abs(example!.yearsInRetirement - 14.4) < 1e-9);
assert.ok(example!.totalSavingsAtRetirement > 400_000);
assert.ok(example!.incomeFromSavingsAnnual > 0);
assert.ok(example!.totalRetirementIncomeAnnual > example!.incomeFromSavingsAnnual);
assert.equal(example!.alreadyRetired, false);

// Already retired: current age >= retirement age
const retired = calculateRetirement({
  sex: 'male',
  country: 'US',
  currentAge: 70,
  retirementAge: 67,
  lifeExpectancy: 85,
  annualSavings: 0,
  alreadySaved: 200_000,
  annualReturnPercent: 5,
  governmentPensionAnnual: 20_000,
  costOfLivingAnnual: 40_000,
});
assert.ok(retired);
assert.equal(retired!.alreadyRetired, true);
assert.equal(retired!.yearsToRetirement, 0);
assert.equal(retired!.totalSavingsAtRetirement, 200_000);

// Life expectancy not after retirement → zero draw horizon message path
const noHorizon = calculateRetirement({
  sex: 'female',
  country: 'OTHER',
  currentAge: 60,
  retirementAge: 65,
  lifeExpectancy: 65,
  annualSavings: 0,
  alreadySaved: 10_000,
  annualReturnPercent: 5,
  governmentPensionAnnual: 12_000,
  costOfLivingAnnual: 12_000,
});
assert.ok(noHorizon);
assert.equal(noHorizon!.incomeFromSavingsAnnual, 0);
assert.equal(noHorizon!.yearsInRetirement, 0);

// Insufficient funds flag
assert.equal(example!.insufficientFunds, example!.moneyLeftAnnual < 0);

console.log('retirement calculation.test.ts: ok');
