import assert from 'node:assert/strict';
import {
  calculateEarlyRetirement,
  monthlyDepositFromIncome,
  monthlyRateFromAnnualPercent,
  monthsToReachTargetExact,
  requiredBalanceFromWithdrawal,
} from './calculation';

// Monthly deposit
assert.equal(monthlyDepositFromIncome(60_000, 30_000), 2_500);
assert.equal(monthlyDepositFromIncome(20_000, 30_000), 0);

// Required balance / withdrawal rate
assert.equal(requiredBalanceFromWithdrawal(30_000, 4), 750_000);
assert.equal(requiredBalanceFromWithdrawal(30_000, 0), null);

// Worked example: 60k / 30k / 0 / 5% / 4%
const example = calculateEarlyRetirement({
  netIncome: 60_000,
  expenses: 30_000,
  initialBalance: 0,
  annualReturnPercent: 5,
  withdrawalRatePercent: 4,
});
assert.ok(example);
assert.equal(example!.monthlyDeposit, 2_500);
assert.equal(example!.requiredBalance, 750_000);
assert.equal(example!.unreachable, false);
assert.equal(example!.monthsWhole, 197);
assert.ok(example!.monthsExact > 196 && example!.monthsExact < 197);
assert.equal(example!.totalContribution, 2_500 * 197);
assert.ok(example!.finalBalance >= 750_000);

// Already independent
const done = calculateEarlyRetirement({
  netIncome: 60_000,
  expenses: 30_000,
  initialBalance: 800_000,
  annualReturnPercent: 5,
  withdrawalRatePercent: 4,
});
assert.ok(done);
assert.equal(done!.alreadyIndependent, true);
assert.equal(done!.monthsWhole, 0);
assert.equal(done!.totalContribution, 0);

// Zero savings + zero return → unreachable when short
const stuck = calculateEarlyRetirement({
  netIncome: 30_000,
  expenses: 30_000,
  initialBalance: 10_000,
  annualReturnPercent: 0,
  withdrawalRatePercent: 4,
});
assert.ok(stuck);
assert.equal(stuck!.unreachable, true);

// Zero return with positive savings
const zeroR = monthsToReachTargetExact(0, 1_000, 0, 12_000);
assert.equal(zeroR.unreachable, false);
assert.equal(zeroR.months, 12);

// Invalid withdrawal handled in calculateEarlyRetirement
const badWr = calculateEarlyRetirement({
  netIncome: 50_000,
  expenses: 20_000,
  initialBalance: 0,
  annualReturnPercent: 5,
  withdrawalRatePercent: 0,
});
assert.ok(badWr);
assert.equal(badWr!.unreachable, true);

const rm = monthlyRateFromAnnualPercent(5);
assert.ok(Math.abs(rm - (Math.pow(1.05, 1 / 12) - 1)) < 1e-12);

console.log('early-retirement calculation.test.ts: ok');
