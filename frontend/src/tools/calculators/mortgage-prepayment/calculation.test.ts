import assert from 'node:assert/strict';
import {
  amortizingPayment,
  calculateMortgagePrepayment,
  periodRate,
} from './calculation';

{
  const r = periodRate(6, 'monthly_us_uk', 12);
  assert.ok(Math.abs(r - 0.005) < 1e-12);
  const pmt = amortizingPayment(100000, r, 360);
  assert.ok(pmt !== null);
  assert.ok(Math.abs(pmt! - 599.550527) < 0.01);
}

{
  const result = calculateMortgagePrepayment({
    mortgageAmount: 100000,
    annualRatePercent: 6,
    termPeriods: 360,
    interestMethod: 'monthly_us_uk',
    paymentFrequency: 'monthly',
    dueDate: '2026-11-17',
    periodicPrepayment: 0,
    periodicStartDate: '2026-11-17',
    lumpSumPrepayment: 0,
    lumpSumDate: '2026-11-17',
    currency: 'PKR',
  });
  assert.ok(result);
  assert.equal(result!.hasPrepayments, false);
  assert.equal(result!.baseline.paymentCount, 360);
  assert.ok(Math.abs(result!.baseline.totalInterest - 115838.19) < 0.5);
  assert.ok(Math.abs(result!.baseline.totalPayment - 215838.19) < 0.5);
}

{
  const result = calculateMortgagePrepayment({
    mortgageAmount: 100000,
    annualRatePercent: 6,
    termPeriods: 360,
    interestMethod: 'monthly_us_uk',
    paymentFrequency: 'monthly',
    dueDate: '2026-11-17',
    periodicPrepayment: 100,
    periodicStartDate: '2026-11-17',
    lumpSumPrepayment: 0,
    lumpSumDate: '2026-11-17',
    currency: 'PKR',
  });
  assert.ok(result);
  assert.equal(result!.hasPrepayments, true);
  assert.ok(result!.prepaid);
  assert.ok(result!.prepaid!.paymentCount < result!.baseline.paymentCount);
  assert.ok(result!.prepaid!.totalInterest < result!.baseline.totalInterest);
}

console.log('mortgage-prepayment calculation.test.ts: ok');
