import assert from 'node:assert/strict';
import { calculateImpermanentLoss } from './calculation';

// Example: 50/50, deposit 10,000; A doubles, B unchanged
{
  const r = calculateImpermanentLoss({
    weights: '50/50',
    initialDeposit: 10_000,
    initialPriceA: 1,
    futurePriceA: 2,
    initialPriceB: 1,
    futurePriceB: 1,
    currency: 'PKR',
  });
  assert.ok(r);
  assert.equal(r.hodlValue, 15_000);
  assert.equal(r.poolValue, 14_142.14);
  assert.equal(r.impermanentLossPercent, -5.72);
  assert.equal(r.netLossVsHolding, 857.86);
}

assert.equal(
  calculateImpermanentLoss({
    weights: '50/50',
    initialDeposit: 0,
    initialPriceA: 1,
    futurePriceA: 2,
    initialPriceB: 1,
    futurePriceB: 1,
    currency: 'PKR',
  }),
  null,
);

console.log('impermanent-loss/calculation.test.ts: ok');
