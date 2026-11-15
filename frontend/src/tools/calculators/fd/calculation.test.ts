import assert from 'node:assert/strict';
import { calculateFd } from './calculation';

// Example: 100,000 @ 8% for 2 years, monthly cumulative
{
  const r = calculateFd({
    depositType: 'cumulative',
    principal: 100_000,
    interestRatePercent: 8,
    termYears: 2,
    compounding: 'monthly',
    currency: 'PKR',
  });
  assert.ok(r);
  assert.equal(r.maturityAmount, 117288.79);
  assert.equal(r.totalInterest, 17288.79);
  assert.equal(r.payoutPerPeriod, 0);
  assert.equal(r.totalPayout, 117288.79);
}

// Simple FD: interest paid periodically
{
  const r = calculateFd({
    depositType: 'simple',
    principal: 100_000,
    interestRatePercent: 8,
    termYears: 2,
    compounding: 'monthly',
    currency: 'PKR',
  });
  assert.ok(r);
  assert.equal(r.maturityAmount, 100_000);
  assert.equal(r.totalInterest, 16_000);
  assert.equal(r.payoutPerPeriod, roundish(100_000 * 0.08 / 12));
  assert.equal(r.totalPayout, 116_000);
}

function roundish(v: number) {
  return Math.round(v * 100) / 100;
}

// Zero rate
{
  const r = calculateFd({
    depositType: 'cumulative',
    principal: 50_000,
    interestRatePercent: 0,
    termYears: 1,
    compounding: 'annually',
    currency: 'PKR',
  });
  assert.ok(r);
  assert.equal(r.maturityAmount, 50_000);
  assert.equal(r.totalInterest, 0);
}

assert.equal(
  calculateFd({
    depositType: 'cumulative',
    principal: 1000,
    interestRatePercent: 5,
    termYears: 0,
    compounding: 'monthly',
    currency: 'PKR',
  }),
  null,
);

console.log('fd/calculation.test.ts: ok');
