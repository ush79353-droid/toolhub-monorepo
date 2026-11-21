import assert from 'node:assert/strict';
import {
  calculateSavingsGoal,
  growingAnnuityFactor,
  periodicRateFromCompounding,
} from './calculation';

// Screenshot defaults: 1,000,000 PKR, ages 32→65, 4% monthly, monthly end, no growth/inflation
const screenshot = calculateSavingsGoal({
  goalAmount: 1_000_000,
  startingSavings: 0,
  years: 33,
  annualRate: 0.04,
  compoundPeriodsPerYear: 12,
  contribPeriodsPerYear: 12,
  inflationRate: 0,
  periodicGrowth: 0,
  timing: 'end',
  currency: 'PKR',
  contributionFrequency: 'monthly',
});
assert.ok(screenshot);
assert.ok(Math.abs(screenshot.requiredContribution - 1218.6740810907231) < 1e-6);
assert.ok(Math.abs(screenshot.totalContributions - 482594.93611192633) < 1e-4);
assert.ok(Math.abs(screenshot.totalReturn - 517405.06388807367) < 1e-4);
assert.equal(screenshot.periods, 396);
assert.equal(screenshot.alreadyFunded, false);

// Zero interest: PMT = gap / n
const zeroRate = calculateSavingsGoal({
  goalAmount: 12_000,
  startingSavings: 0,
  years: 1,
  annualRate: 0,
  compoundPeriodsPerYear: 12,
  contribPeriodsPerYear: 12,
  inflationRate: 0,
  periodicGrowth: 0,
  timing: 'end',
  currency: 'PKR',
  contributionFrequency: 'monthly',
});
assert.ok(zeroRate);
assert.ok(Math.abs(zeroRate.requiredContribution - 1000) < 1e-9);
assert.ok(Math.abs(zeroRate.totalContributions - 12_000) < 1e-9);
assert.ok(Math.abs(zeroRate.totalReturn) < 1e-9);

// Already funded by starting savings
const funded = calculateSavingsGoal({
  goalAmount: 10_000,
  startingSavings: 10_000,
  years: 5,
  annualRate: 0.05,
  compoundPeriodsPerYear: 12,
  contribPeriodsPerYear: 12,
  inflationRate: 0,
  periodicGrowth: 0,
  timing: 'end',
  currency: 'PKR',
  contributionFrequency: 'monthly',
});
assert.ok(funded);
assert.equal(funded.requiredContribution, 0);
assert.equal(funded.alreadyFunded, true);

// Beginning-of-period requires a smaller deposit than end-of-period
const end = calculateSavingsGoal({
  goalAmount: 100_000,
  startingSavings: 0,
  years: 10,
  annualRate: 0.06,
  compoundPeriodsPerYear: 12,
  contribPeriodsPerYear: 12,
  inflationRate: 0,
  periodicGrowth: 0,
  timing: 'end',
  currency: 'PKR',
  contributionFrequency: 'monthly',
});
const begin = calculateSavingsGoal({
  goalAmount: 100_000,
  startingSavings: 0,
  years: 10,
  annualRate: 0.06,
  compoundPeriodsPerYear: 12,
  contribPeriodsPerYear: 12,
  inflationRate: 0,
  periodicGrowth: 0,
  timing: 'beginning',
  currency: 'PKR',
  contributionFrequency: 'monthly',
});
assert.ok(end && begin);
assert.ok(begin.requiredContribution < end.requiredContribution);

// Inflation raises the required contribution vs the same plan with 0% inflation
const noInflation = calculateSavingsGoal({
  goalAmount: 100_000,
  startingSavings: 0,
  years: 10,
  annualRate: 0.05,
  compoundPeriodsPerYear: 12,
  contribPeriodsPerYear: 12,
  inflationRate: 0,
  periodicGrowth: 0,
  timing: 'end',
  currency: 'PKR',
  contributionFrequency: 'monthly',
});
const withInflation = calculateSavingsGoal({
  goalAmount: 100_000,
  startingSavings: 0,
  years: 10,
  annualRate: 0.05,
  compoundPeriodsPerYear: 12,
  contribPeriodsPerYear: 12,
  inflationRate: 0.02,
  periodicGrowth: 0,
  timing: 'end',
  currency: 'PKR',
  contributionFrequency: 'monthly',
});
assert.ok(noInflation && withInflation);
assert.ok(withInflation.requiredContribution > noInflation.requiredContribution);

// Periodic rate helper
const i = periodicRateFromCompounding(0.04, 12, 12);
assert.ok(i !== null);
assert.ok(Math.abs(i - 0.04 / 12) < 1e-15);

// Ordinary annuity factor at i=g=0
const factor = growingAnnuityFactor({
  periods: 12,
  periodicRate: 0,
  periodicGrowth: 0,
  timing: 'end',
});
assert.equal(factor, 12);

console.log('savings-goal calculation.test.ts: all assertions passed');
