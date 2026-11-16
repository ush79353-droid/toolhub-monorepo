import assert from 'node:assert/strict';
import {
  calculatePeriodicInterestOnlyPayment,
  calculateTotalInterestOnlyPaid,
  parseInterestOnlyPeriodYears,
  paymentLabelFor,
} from './calculation';

// Omni example: $350,000 at 4% monthly → $1,166.666...
{
  const payment = calculatePeriodicInterestOnlyPayment({
    loanAmount: 350_000,
    annualInterestRatePercent: 4,
    paymentFrequency: 'monthly',
  });
  assert.ok(payment !== null);
  assert.ok(Math.abs(payment - 350_000 * 0.04 / 12) < 1e-9);
}

// Yearly / quarterly / daily divisors
assert.equal(
  calculatePeriodicInterestOnlyPayment({
    loanAmount: 100_000,
    annualInterestRatePercent: 12,
    paymentFrequency: 'yearly',
  }),
  12_000
);
assert.equal(
  calculatePeriodicInterestOnlyPayment({
    loanAmount: 100_000,
    annualInterestRatePercent: 12,
    paymentFrequency: 'quarterly',
  }),
  3_000
);
assert.equal(
  calculatePeriodicInterestOnlyPayment({
    loanAmount: 100_000,
    annualInterestRatePercent: 12,
    paymentFrequency: 'daily',
  }),
  100_000 * 0.12 / 365
);

// Zero interest → zero payment
assert.equal(
  calculatePeriodicInterestOnlyPayment({
    loanAmount: 50_000,
    annualInterestRatePercent: 0,
    paymentFrequency: 'monthly',
  }),
  0
);

// Total over 10 years matches Omni narrative
assert.equal(
  calculateTotalInterestOnlyPaid({
    loanAmount: 350_000,
    annualInterestRatePercent: 4,
    periodYears: 10,
  }),
  140_000
);

// yrs + mos
assert.equal(parseInterestOnlyPeriodYears('2', '6'), 2.5);
assert.equal(parseInterestOnlyPeriodYears('', '6'), 0.5);
assert.equal(parseInterestOnlyPeriodYears('', ''), null);
assert.equal(parseInterestOnlyPeriodYears('0', '0'), null);

// Payment label follows frequency (not always "Monthly payment")
assert.equal(paymentLabelFor('daily'), 'Daily payment');
assert.equal(paymentLabelFor('monthly'), 'Monthly payment');
assert.equal(paymentLabelFor('quarterly'), 'Quarterly payment');
assert.equal(paymentLabelFor('yearly'), 'Yearly payment');

assert.equal(
  calculatePeriodicInterestOnlyPayment({
    loanAmount: Number.NaN,
    annualInterestRatePercent: 4,
    paymentFrequency: 'monthly',
  }),
  null
);

console.log('interest-only-mortgage/calculation.test.ts: ok');
