import assert from 'node:assert/strict';
import {
  addMonthsIso,
  calculateCreditCardMinimumPayment,
  formatIsoDateDisplay,
  monthInterest,
} from './calculation';

// Screenshot: 1,500 @ 18% APR, min 25 / 3% flat, Daily (360), due 2026-11-18
// → 7y 2m, payoff 01/18/2034, total ≈ 2,510.83, interest ≈ 1,010.83
const screenshot = calculateCreditCardMinimumPayment({
  balance: 1500,
  annualRate: 0.18,
  dueDate: '2026-11-18',
  minPaymentFloor: 25,
  minPaymentPercent: 3,
  minPaymentMethod: 'flat_percent',
  monthlyFixPayment: 0,
  compounding: 'daily_360',
  currency: 'PKR',
});
assert.ok(screenshot);
assert.equal(screenshot.months, 86);
assert.equal(screenshot.years, 7);
assert.equal(screenshot.remainingMonths, 2);
assert.equal(screenshot.payoffDateIso, '2034-01-18');
assert.equal(screenshot.payoffDateDisplay, '01/18/2034');
assert.ok(Math.abs(screenshot.totalPaid - 2510.83) < 0.01);
assert.ok(Math.abs(screenshot.totalInterest - 1010.83) < 0.01);
assert.equal(screenshot.neverPaysOff, false);
assert.match(screenshot.summary, /7 year\(s\), and 2 month\(s\)/);

// Monthly compounding differs from Daily (360) totals
const monthly = calculateCreditCardMinimumPayment({
  balance: 1500,
  annualRate: 0.18,
  dueDate: '2026-11-18',
  minPaymentFloor: 25,
  minPaymentPercent: 3,
  minPaymentMethod: 'flat_percent',
  monthlyFixPayment: 0,
  compounding: 'monthly',
  currency: 'PKR',
});
assert.ok(monthly && screenshot);
assert.equal(monthly.months, 86);
assert.ok(Math.abs(monthly.totalPaid - screenshot.totalPaid) > 1);

// 0% APR: paid equals principal
const zeroApr = calculateCreditCardMinimumPayment({
  balance: 1000,
  annualRate: 0,
  dueDate: '2026-01-01',
  minPaymentFloor: 250,
  minPaymentPercent: 3,
  minPaymentMethod: 'flat_percent',
  monthlyFixPayment: 0,
  compounding: 'daily_360',
  currency: 'PKR',
});
assert.ok(zeroApr);
assert.equal(zeroApr.months, 4);
assert.ok(Math.abs(zeroApr.totalPaid - 1000) < 1e-9);
assert.ok(Math.abs(zeroApr.totalInterest) < 1e-9);

// Payment too small vs interest → never pays off
const stuck = calculateCreditCardMinimumPayment({
  balance: 5000,
  annualRate: 0.36,
  dueDate: '2026-11-18',
  minPaymentFloor: 10,
  minPaymentPercent: 0.1,
  minPaymentMethod: 'flat_percent',
  monthlyFixPayment: 0,
  compounding: 'daily_360',
  currency: 'PKR',
});
assert.ok(stuck);
assert.equal(stuck.neverPaysOff, true);

// Fixed add-on shortens payoff vs screenshot baseline
const withFix = calculateCreditCardMinimumPayment({
  balance: 1500,
  annualRate: 0.18,
  dueDate: '2026-11-18',
  minPaymentFloor: 25,
  minPaymentPercent: 3,
  minPaymentMethod: 'flat_percent',
  monthlyFixPayment: 50,
  compounding: 'daily_360',
  currency: 'PKR',
});
assert.ok(withFix && screenshot);
assert.ok(withFix.months < screenshot.months);
assert.ok(withFix.totalInterest < screenshot.totalInterest);

// Floor wins when percent×balance is smaller (3% of 500 = 15 < 25)
const floorWins = calculateCreditCardMinimumPayment({
  balance: 500,
  annualRate: 0.18,
  dueDate: '2026-11-18',
  minPaymentFloor: 25,
  minPaymentPercent: 3,
  minPaymentMethod: 'flat_percent',
  monthlyFixPayment: 0,
  compounding: 'daily_360',
  currency: 'PKR',
});
assert.ok(floorWins);
assert.equal(floorWins.neverPaysOff, false);
assert.ok(floorWins.months > 0);

// Percent + interest pays faster than flat %
const plusInt = calculateCreditCardMinimumPayment({
  balance: 1500,
  annualRate: 0.18,
  dueDate: '2026-11-18',
  minPaymentFloor: 25,
  minPaymentPercent: 3,
  minPaymentMethod: 'percent_plus_interest',
  monthlyFixPayment: 0,
  compounding: 'daily_360',
  currency: 'PKR',
});
assert.ok(plusInt && screenshot);
assert.ok(plusInt.months < screenshot.months);

// Helpers
assert.equal(formatIsoDateDisplay('2034-01-18'), '01/18/2034');
assert.equal(addMonthsIso('2026-11-18', 86), '2034-01-18');
assert.ok(
  Math.abs(monthInterest(1500, 0.18, 'daily_360') - 1500 * (Math.pow(1 + 0.18 / 360, 30) - 1)) <
    1e-12
);

console.log('credit-card-minimum-payment calculation.test.ts: all assertions passed');
