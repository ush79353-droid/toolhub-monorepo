import assert from 'node:assert/strict';
import {
  addCalendarMonths,
  calculateSavingsWithdrawal,
  formatSavingsWithdrawalMoney,
  parseIsoDate,
} from './calculation';

// Screenshot defaults: 100,000 @ 2%, withdraw 500/mo from 2026-11-18
{
  const result = calculateSavingsWithdrawal({
    balance: 100_000,
    withdrawalAmount: 500,
    annualInterestRatePercent: 2,
    firstWithdrawalDate: { y: 2026, m: 11, d: 18 },
  });
  assert.ok(result);
  assert.equal(result!.neverDepletes, false);
  assert.equal(result!.years, 20);
  assert.equal(result!.months, 4);
  assert.equal(result!.withdrawalCount, 244);
  assert.equal(result!.lastWithdrawalDate.y, 2047);
  assert.equal(result!.lastWithdrawalDate.m, 2);
  assert.equal(result!.lastWithdrawalDate.d, 18);
  assert.ok(Math.abs(result!.totalWithdrawal - 121_740.97451782675) < 1e-6);
  assert.ok(Math.abs(result!.interestEarned - 21_740.97451782675) < 1e-6);
  assert.equal(result!.balanceAfterLastWithdrawal, 0);
  assert.equal(
    formatSavingsWithdrawalMoney(result!.totalWithdrawal, 'PKR'),
    '121,740.97'
  );
}

// Zero interest: exact months + partial final withdrawal
{
  const result = calculateSavingsWithdrawal({
    balance: 1_000,
    withdrawalAmount: 300,
    annualInterestRatePercent: 0,
    firstWithdrawalDate: { y: 2026, m: 1, d: 15 },
  });
  assert.ok(result);
  assert.equal(result!.withdrawalCount, 4);
  assert.ok(Math.abs(result!.totalWithdrawal - 1_000) < 1e-9);
  assert.equal(result!.interestEarned, 0);
  assert.deepEqual(result!.lastWithdrawalDate, { y: 2026, m: 4, d: 15 });
}

// Non-depleting when monthly interest covers withdrawal
{
  const result = calculateSavingsWithdrawal({
    balance: 100_000,
    withdrawalAmount: 100,
    annualInterestRatePercent: 12,
    firstWithdrawalDate: { y: 2026, m: 1, d: 1 },
  });
  assert.ok(result);
  assert.equal(result!.neverDepletes, true);
}

// Invalid / unsafe inputs
assert.equal(
  calculateSavingsWithdrawal({
    balance: 0,
    withdrawalAmount: 100,
    annualInterestRatePercent: 2,
    firstWithdrawalDate: { y: 2026, m: 1, d: 1 },
  }),
  null
);
assert.equal(
  calculateSavingsWithdrawal({
    balance: 1000,
    withdrawalAmount: 100,
    annualInterestRatePercent: -1,
    firstWithdrawalDate: { y: 2026, m: 1, d: 1 },
  }),
  null
);

assert.deepEqual(parseIsoDate('2026-11-18'), { y: 2026, m: 11, d: 18 });
assert.equal(parseIsoDate('2026-02-30'), null);
assert.deepEqual(addCalendarMonths({ y: 2026, m: 11, d: 18 }, 243), {
  y: 2047,
  m: 2,
  d: 18,
});

console.log('savings-withdrawal calculation.test.ts: all assertions passed');
