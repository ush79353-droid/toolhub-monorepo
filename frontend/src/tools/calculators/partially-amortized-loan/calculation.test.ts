import assert from 'node:assert/strict';
import {
  calculateBalloonPayment,
  calculateMonthlyPayment,
  calculatePartiallyAmortizedLoan,
  durationToMonths,
} from './calculation';

{
  assert.equal(durationToMonths(20, 0), 240);
  assert.equal(durationToMonths(5, 0), 60);
  assert.equal(durationToMonths(1, 12), null);
}

{
  const r = 0.06 / 100 / 12;
  const m = calculateMonthlyPayment(100_000, r, 240);
  assert.ok(m !== null);
  assert.ok(Math.abs(m! - 716.4310584781728) < 1e-9);

  const balloon = calculateBalloonPayment({
    principal: 100_000,
    monthlyRate: r,
    amortMonths: 240,
    paymentMonths: 60,
    monthlyPayment: m!,
  });
  assert.ok(balloon !== null);
  assert.ok(Math.abs(balloon! - 84_899.59844669625) < 0.01);

  const full = calculatePartiallyAmortizedLoan({
    fullLoan: 100_000,
    annualInterestRatePercent: 6,
    amortYears: 20,
    amortMonths: 0,
    paymentYears: 5,
    paymentMonths: 0,
  });
  assert.ok(full);
  assert.equal(full!.amortMonthsTotal, 240);
  assert.equal(full!.paymentMonthsTotal, 60);
  assert.ok(Math.abs(full!.monthlyPayment - 716.4310584781728) < 1e-9);
  assert.ok(Math.abs(full!.totalPaid - full!.monthlyPayment * 60) < 1e-9);
  assert.ok(Math.abs(full!.total - (full!.totalPaid + full!.balloon)) < 1e-9);
}

{
  const zero = calculatePartiallyAmortizedLoan({
    fullLoan: 12_000,
    annualInterestRatePercent: 0,
    amortYears: 2,
    amortMonths: 0,
    paymentYears: 1,
    paymentMonths: 0,
  });
  assert.ok(zero);
  assert.equal(zero!.monthlyPayment, 500);
  assert.equal(zero!.totalPaid, 6_000);
  assert.equal(zero!.balloon, 6_000);
  assert.equal(zero!.total, 12_000);
}

{
  const fullTerm = calculatePartiallyAmortizedLoan({
    fullLoan: 10_000,
    annualInterestRatePercent: 5,
    amortYears: 1,
    amortMonths: 0,
    paymentYears: 1,
    paymentMonths: 0,
  });
  assert.ok(fullTerm);
  assert.equal(fullTerm!.balloon, 0);

  const over = calculatePartiallyAmortizedLoan({
    fullLoan: 10_000,
    annualInterestRatePercent: 5,
    amortYears: 1,
    amortMonths: 0,
    paymentYears: 2,
    paymentMonths: 0,
  });
  assert.equal(over, null);
}

console.log('partially-amortized-loan/calculation.test.ts: ok');
