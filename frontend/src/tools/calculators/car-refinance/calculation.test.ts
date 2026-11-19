import assert from 'node:assert/strict';
import {
  buildNewPrincipal,
  calculateCarRefinance,
  calculateMonthlyPayment,
  formatTermLabel,
  solvePaymentCountFromPayment,
  termToMonths,
} from './calculation';

// Screenshot defaults: 32,000 · 6 yrs · 8.5% vs 5 yrs · 4.5%
{
  const currentPay = calculateMonthlyPayment({
    principal: 32_000,
    annualRatePercent: 8.5,
    paymentCount: 72,
  });
  assert.ok(currentPay !== null);
  assert.ok(Math.abs(currentPay - 568.91) < 0.01);

  const newPay = calculateMonthlyPayment({
    principal: 32_000,
    annualRatePercent: 4.5,
    paymentCount: 60,
  });
  assert.ok(newPay !== null);
  assert.ok(Math.abs(newPay - 596.58) < 0.01);

  const cmp = calculateCarRefinance({
    balance: 32_000,
    currentRatePercent: 8.5,
    currentPaymentCount: 72,
    newRatePercent: 4.5,
    newPaymentCount: 60,
    cashInOut: 0,
    fees: 0,
    financeFees: false,
  });
  assert.ok(cmp);
  assert.ok(Math.abs(cmp.current.totalInterest - 8961.4) < 0.05);
  assert.ok(Math.abs(cmp.neu.totalInterest - 3794.6) < 0.05);
  assert.ok(Math.abs(cmp.current.totalPayments - 40_961.4) < 0.05);
  assert.ok(Math.abs(cmp.neu.totalPayments - 35_794.6) < 0.05);
}

// Zero APR
{
  const pay = calculateMonthlyPayment({
    principal: 12_000,
    annualRatePercent: 0,
    paymentCount: 24,
  });
  assert.equal(pay, 500);
}

// Solve remaining term from payment
{
  const n = solvePaymentCountFromPayment({
    principal: 32_000,
    annualRatePercent: 8.5,
    monthlyPayment: 568.9083076886365,
  });
  assert.ok(n !== null);
  assert.ok(Math.abs(n - 72) < 1e-6);
}

// Non-amortizing payment rejected
{
  const n = solvePaymentCountFromPayment({
    principal: 10_000,
    annualRatePercent: 12,
    monthlyPayment: 50, // interest-only ≈ 100
  });
  assert.equal(n, null);
}

// Cash out increases principal; cash in reduces; financed fees add
{
  assert.equal(
    buildNewPrincipal({
      balance: 32_000,
      cashInOut: 2_000,
      fees: 500,
      financeFees: true,
    }),
    34_500
  );
  assert.equal(
    buildNewPrincipal({
      balance: 32_000,
      cashInOut: -2_000,
      fees: 500,
      financeFees: false,
    }),
    30_000
  );
}

assert.equal(termToMonths(6, 'yrs'), 72);
assert.equal(termToMonths(18, 'mos'), 18);
assert.equal(formatTermLabel(72), '6 yrs');
assert.equal(formatTermLabel(5), '5 mos');

console.log('car-refinance calculation.test.ts: all assertions passed');
