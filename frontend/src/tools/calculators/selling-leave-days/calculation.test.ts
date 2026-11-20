import assert from 'node:assert/strict';
import { calculateLeavePayout, formatLeaveMoney } from './calculation';

// Prompt example — monthly 60,000 · 5 days → 13,846.15
{
  const r = calculateLeavePayout({
    frequency: 'monthly',
    basePay: 60_000,
    leaveDays: 5,
  });
  assert.ok(r);
  assert.equal(r.dailyPay, (60_000 * 12) / 260);
  assert.equal(r.payout, ((60_000 * 12) / 260) * 5);
  assert.equal(formatLeaveMoney(r.payout, 'PKR'), '13,846.15');
}

{
  const r = calculateLeavePayout({
    frequency: 'annual',
    basePay: 720_000,
    leaveDays: 5,
  });
  assert.ok(r);
  assert.equal(r.payout, (720_000 / 260) * 5);
}

{
  const r = calculateLeavePayout({
    frequency: 'weekly',
    basePay: 10_000,
    leaveDays: 2,
  });
  assert.ok(r);
  assert.equal(r.dailyPay, 2_000);
  assert.equal(r.payout, 4_000);
}

{
  const r = calculateLeavePayout({
    frequency: 'hourly',
    basePay: 500,
    leaveDays: 1,
  });
  assert.ok(r);
  assert.equal(r.dailyPay, 4_000);
  assert.equal(r.payout, 4_000);
}

assert.equal(
  calculateLeavePayout({ frequency: 'monthly', basePay: -1, leaveDays: 1 }),
  null
);
assert.ok(
  calculateLeavePayout({ frequency: 'monthly', basePay: 0, leaveDays: 0 })
);

console.log('calculation.test.ts: ok');
