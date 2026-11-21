import assert from 'node:assert/strict';
import {
  calculateCreditCardInterestPayoff,
  monthInterest,
} from './calculation';

// Screenshot: 2,000 @ 18% APR, fixed 100, monthly compounding → 2y 0m
const screenshot = calculateCreditCardInterestPayoff({
  balance: 2000,
  annualRate: 0.18,
  repaymentMode: 'fixed',
  fixedPayment: 100,
  additionalPayment: 0,
  minPaymentFloor: 25,
  minPaymentPercent: 3,
  minPaymentMethod: 'flat_percent',
  compounding: 'monthly',
  currency: 'PKR',
});
assert.ok(screenshot);
assert.equal(screenshot.months, 24);
assert.equal(screenshot.years, 2);
assert.equal(screenshot.remainingMonths, 0);
assert.ok(Math.abs(screenshot.totalPaid - 2395.6535443312164) < 1e-6);
assert.ok(Math.abs(screenshot.totalInterest - 395.6535443312162) < 1e-6);
assert.equal(screenshot.neverPaysOff, false);

// 0% APR: paid equals principal, months = ceil(balance/payment)
const zeroApr = calculateCreditCardInterestPayoff({
  balance: 1000,
  annualRate: 0,
  repaymentMode: 'fixed',
  fixedPayment: 250,
  additionalPayment: 0,
  minPaymentFloor: 25,
  minPaymentPercent: 3,
  minPaymentMethod: 'flat_percent',
  compounding: 'monthly',
  currency: 'PKR',
});
assert.ok(zeroApr);
assert.equal(zeroApr.months, 4);
assert.ok(Math.abs(zeroApr.totalPaid - 1000) < 1e-9);
assert.ok(Math.abs(zeroApr.totalInterest) < 1e-9);

// Payment too small vs interest → never pays off
const stuck = calculateCreditCardInterestPayoff({
  balance: 2000,
  annualRate: 0.24,
  repaymentMode: 'fixed',
  fixedPayment: 20,
  additionalPayment: 0,
  minPaymentFloor: 25,
  minPaymentPercent: 3,
  minPaymentMethod: 'flat_percent',
  compounding: 'monthly',
  currency: 'PKR',
});
assert.ok(stuck);
assert.equal(stuck.neverPaysOff, true);

// Additional payment shortens payoff vs screenshot baseline
const withExtra = calculateCreditCardInterestPayoff({
  balance: 2000,
  annualRate: 0.18,
  repaymentMode: 'fixed',
  fixedPayment: 100,
  additionalPayment: 50,
  minPaymentFloor: 25,
  minPaymentPercent: 3,
  minPaymentMethod: 'flat_percent',
  compounding: 'monthly',
  currency: 'PKR',
});
assert.ok(withExtra && screenshot);
assert.ok(withExtra.months < screenshot.months);
assert.ok(withExtra.totalInterest < screenshot.totalInterest);

// Minimum flat percent uses max(floor, pct×balance); default 3% of 2000 = 60
const minMode = calculateCreditCardInterestPayoff({
  balance: 2000,
  annualRate: 0.18,
  repaymentMode: 'minimum',
  fixedPayment: 0,
  additionalPayment: 0,
  minPaymentFloor: 25,
  minPaymentPercent: 3,
  minPaymentMethod: 'flat_percent',
  compounding: 'monthly',
  currency: 'PKR',
});
assert.ok(minMode);
assert.equal(minMode.neverPaysOff, false);
assert.ok(minMode.months > 0);
assert.ok(Math.abs(minMode.firstPayment - 60) < 1e-9);

// Floor wins when percent×balance is smaller (3% of 500 = 15 < 25)
const floorWins = calculateCreditCardInterestPayoff({
  balance: 500,
  annualRate: 0.18,
  repaymentMode: 'minimum',
  fixedPayment: 0,
  additionalPayment: 0,
  minPaymentFloor: 25,
  minPaymentPercent: 3,
  minPaymentMethod: 'flat_percent',
  compounding: 'monthly',
  currency: 'PKR',
});
assert.ok(floorWins);
assert.ok(Math.abs(floorWins.firstPayment - 25) < 1e-9);

// Monthly interest helper
assert.ok(Math.abs(monthInterest(2000, 0.18, 'monthly') - 30) < 1e-12);

console.log('credit-card-interest calculation.test.ts: all assertions passed');
