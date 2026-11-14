import assert from 'node:assert/strict';
import { calculateExpenseRatio } from './calculation';

// Zero fees: net FV equals gross FV
{
  const r = calculateExpenseRatio({
    initialInvestment: 1000,
    yearlyInvestment: 100,
    durationYears: 5,
    expectedReturnPercent: 0,
    expenseRatioPercent: 0,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r!.grossFutureValue, 1500);
  assert.equal(r!.netFutureValue, 1500);
  assert.equal(r!.totalEtfCost, 0);
}

// With fees: net < gross and fees > 0
{
  const r = calculateExpenseRatio({
    initialInvestment: 10000,
    yearlyInvestment: 1000,
    durationYears: 10,
    expectedReturnPercent: 8,
    expenseRatioPercent: 0.5,
    currency: 'USD',
  });
  assert.ok(r);
  assert.ok(r!.grossFutureValue > r!.netFutureValue);
  assert.ok(r!.totalEtfCost > 0);
}

// Invalid duration
{
  assert.equal(
    calculateExpenseRatio({
      initialInvestment: 1000,
      yearlyInvestment: 0,
      durationYears: 0,
      expectedReturnPercent: 5,
      expenseRatioPercent: 0.2,
      currency: 'USD',
    }),
    null
  );
}

console.log('expense-ratio calculation.test.ts: ok');
