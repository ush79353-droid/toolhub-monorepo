import assert from 'node:assert/strict';
import { calculateSavingsInterestRate, futureValueAtRate } from './calculation';

// Screenshot example: goal 100k, P=0, 30y, monthly/monthly, PMT=100, end
const example = calculateSavingsInterestRate({
  savingsGoal: 100_000,
  initialBalance: 0,
  termYears: 30,
  compounding: 'monthly',
  depositAmount: 100,
  depositFrequency: 'monthly',
  depositTiming: 'end',
  currency: 'PKR',
});
assert.ok(example);
assert.ok(Math.abs(example.requiredRatePercent - 5.976) < 0.02);
assert.equal(example.totalDeposited, 36_000);
assert.ok(Math.abs(example.finalBalance - 100_000) < 1);

// Zero-rate reachability
const reachable = calculateSavingsInterestRate({
  savingsGoal: 10_000,
  initialBalance: 5_000,
  termYears: 5,
  compounding: 'monthly',
  depositAmount: 100,
  depositFrequency: 'monthly',
  depositTiming: 'end',
  currency: 'PKR',
});
assert.ok(reachable);
assert.equal(reachable.requiredRatePercent, 0);
assert.equal(reachable.alreadyReachableAtZero, true);

// Beginning vs end differs with positive rate
const endFv = futureValueAtRate({
  principal: 0,
  annualNominal: 0.06,
  years: 10,
  compoundM: 12,
  depositAmount: 100,
  depositF: 12,
  timing: 'end',
});
const beginFv = futureValueAtRate({
  principal: 0,
  annualNominal: 0.06,
  years: 10,
  compoundM: 12,
  depositAmount: 100,
  depositF: 12,
  timing: 'beginning',
});
assert.ok(endFv !== null && beginFv !== null);
assert.ok(beginFv! > endFv!);

// Impossible: no capital, positive goal
assert.equal(
  calculateSavingsInterestRate({
    savingsGoal: 1000,
    initialBalance: 0,
    termYears: 10,
    compounding: 'monthly',
    depositAmount: 0,
    depositFrequency: 'monthly',
    depositTiming: 'end',
    currency: 'PKR',
  }),
  null
);

console.log('savings-interest-rate/calculation.test.ts: ok');
