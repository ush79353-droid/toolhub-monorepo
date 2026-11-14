import assert from 'node:assert/strict';
import { calculateBitcoinEtf } from './calculation';

{
  // 10% expected, 0% expense, 0 other, 1 year, 1000 invest
  const res = calculateBitcoinEtf({
    investmentAmount: 1000,
    durationYears: 1,
    expenseRatioPercent: 0,
    otherCosts: 0,
    expectedReturnPercent: 10,
    currency: 'PKR',
  });
  assert.ok(res);
  assert.equal(Number(res.effectiveReturnPercent.toFixed(6)), 10);
  assert.equal(Number(res.futureValue.toFixed(2)), 1100);
  assert.equal(Number(res.totalCost.toFixed(2)), 0);
}

{
  // 10% expected, 1% expense → effective = 1.10 * 0.99 - 1 = 0.089
  const res = calculateBitcoinEtf({
    investmentAmount: 10_000,
    durationYears: 1,
    expenseRatioPercent: 1,
    otherCosts: 0,
    expectedReturnPercent: 10,
    currency: 'PKR',
  });
  assert.ok(res);
  assert.equal(Number(res.effectiveReturnPercent.toFixed(4)), 8.9);
  assert.equal(Number(res.futureValue.toFixed(2)), 10_890);
  // fee = 10000 * 1.10 * 0.01 = 110
  assert.equal(Number(res.totalCost.toFixed(2)), 110);
}

{
  const res = calculateBitcoinEtf({
    investmentAmount: 65_000,
    durationYears: 5,
    expenseRatioPercent: 0.25,
    otherCosts: 100,
    expectedReturnPercent: 10,
    currency: 'PKR',
  });
  assert.ok(res);
  assert.ok(res.futureValue > 0);
  assert.ok(res.totalCost >= 100);
}

{
  assert.equal(
    calculateBitcoinEtf({
      investmentAmount: 0,
      durationYears: 1,
      expenseRatioPercent: 0,
      otherCosts: 0,
      expectedReturnPercent: 10,
      currency: 'PKR',
    }),
    null
  );
}

console.log('bitcoin-etf calculation.test ok');
