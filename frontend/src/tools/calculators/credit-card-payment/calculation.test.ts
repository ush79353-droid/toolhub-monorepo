import assert from 'node:assert/strict';
import {
  addDaysIso,
  amortizingMonthlyPayment,
  calculateCreditCardPayment,
  DAYS_PER_PAYBACK_MONTH,
  periodRate,
} from './calculation';

// Screenshot: 1,000 @ 18% APR, 1y 0m, Daily 360 → ≈ 91.74 / 1,100.91 / 100.91 / Oct 20, 2027
const sample = calculateCreditCardPayment({
  balance: 1000,
  annualRate: 0.18,
  dueDate: '2026-11-18',
  termYears: 1,
  termMonths: 0,
  minPaymentFloor: 25,
  minPaymentPercent: 3,
  minPaymentMethod: 'flat_percent',
  compounding: 'daily_360',
  currency: 'PKR',
});

assert.ok(sample);
assert.equal(sample!.monthlyPayment, 91.74);
assert.equal(sample!.years, 1);
assert.equal(sample!.remainingMonths, 0);
assert.equal(sample!.payoffDateIso, '2027-10-20');
assert.equal(sample!.payoffDateDisplay, 'Oct 20, 2027');
assert.ok(Math.abs(sample!.totalPaid - 1100.91) < 0.01);
assert.ok(Math.abs(sample!.totalInterest - 100.91) < 0.01);
assert.equal(sample!.paymentRaisedToMinimum, false);

assert.equal(addDaysIso('2026-11-18', 12 * DAYS_PER_PAYBACK_MONTH), '2027-10-20');

const monthlyRate = periodRate(0.18, 'monthly');
assert.ok(Math.abs(monthlyRate - 0.015) < 1e-12);
const zeroApr = amortizingMonthlyPayment(1200, 0, 12);
assert.equal(zeroApr, 100);

const zeroAprResult = calculateCreditCardPayment({
  balance: 1200,
  annualRate: 0,
  dueDate: '2026-11-18',
  termYears: 1,
  termMonths: 0,
  minPaymentFloor: 25,
  minPaymentPercent: 3,
  minPaymentMethod: 'flat_percent',
  compounding: 'monthly',
  currency: 'PKR',
});
assert.ok(zeroAprResult);
assert.equal(zeroAprResult!.monthlyPayment, 100);
assert.ok(Math.abs(zeroAprResult!.totalInterest) < 1e-9);

console.log('credit-card-payment calculation.test.ts: ok');
