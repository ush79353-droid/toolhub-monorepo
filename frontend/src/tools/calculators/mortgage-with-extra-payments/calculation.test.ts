import assert from 'node:assert/strict';
import {
  amortizingPayment,
  calculateMortgageWithExtraPayments,
  monthlyPeriodRate,
} from './calculation';

{
  const r = monthlyPeriodRate(4.5, 'monthly_us_uk');
  assert.ok(Math.abs(r - 0.00375) < 1e-12);
  const pmt = amortizingPayment(135_000, r, 240);
  assert.ok(pmt !== null);
  assert.ok(Math.abs(pmt! - 854.0766579) < 0.01);
}

{
  const result = calculateMortgageWithExtraPayments({
    mortgageAmount: 135_000,
    annualRatePercent: 4.5,
    termMonths: 240,
    interestMethod: 'monthly_us_uk',
    paymentFrequency: 'accelerated_biweekly',
    dueDate: '2026-11-18',
    periodicExtra: 0,
    periodicStartDate: '2026-11-18',
    lumpSum: 0,
    lumpSumDate: '2026-11-18',
    currency: 'PKR',
  });
  assert.ok(result);
  assert.equal(result!.original.paymentCount, 240);
  assert.equal(result!.original.termYears, 20);
  assert.equal(result!.original.termMonths, 0);
  assert.ok(Math.abs(result!.original.periodicPayment - 854.08) < 0.05);
  assert.ok(Math.abs(result!.withExtra.periodicPayment - 427.04) < 0.05);
  assert.equal(result!.withExtra.termYears, 17);
  assert.equal(result!.withExtra.termMonths, 7);
  assert.ok(result!.withExtra.totalInterest < result!.original.totalInterest);
  assert.ok(result!.withExtra.paymentCount < result!.original.paymentCount * 2);
}

{
  const result = calculateMortgageWithExtraPayments({
    mortgageAmount: 135_000,
    annualRatePercent: 4.5,
    termMonths: 240,
    interestMethod: 'monthly_us_uk',
    paymentFrequency: 'monthly',
    dueDate: '2026-11-18',
    periodicExtra: 100,
    periodicStartDate: '2026-11-18',
    lumpSum: 5000,
    lumpSumDate: '2026-11-18',
    currency: 'PKR',
  });
  assert.ok(result);
  assert.ok(result!.withExtra.paymentCount < result!.original.paymentCount);
  assert.ok(result!.withExtra.totalInterest < result!.original.totalInterest);
}

{
  const invalid = calculateMortgageWithExtraPayments({
    mortgageAmount: 0,
    annualRatePercent: 4.5,
    termMonths: 240,
    interestMethod: 'monthly_us_uk',
    paymentFrequency: 'monthly',
    dueDate: '2026-11-18',
    periodicExtra: 0,
    periodicStartDate: '2026-11-18',
    lumpSum: 0,
    lumpSumDate: '2026-11-18',
    currency: 'PKR',
  });
  assert.equal(invalid, null);
}

console.log('mortgage-with-extra-payments calculation.test.ts: ok');
