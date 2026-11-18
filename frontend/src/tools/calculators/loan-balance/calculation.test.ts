import assert from 'node:assert/strict';
import {
  calculateLoanBalanceInLoanCurrency,
  calculateMonthlyPayment,
  calculateRemainingBalance,
  durationToMonths,
} from './calculation';

{
  assert.equal(durationToMonths(10, 0), 120);
  assert.equal(durationToMonths(3, 0), 36);
  assert.equal(durationToMonths(0, 6), 6);
  assert.equal(durationToMonths(1, 12), null);
}

{
  const r = 0.06 / 100 / 12;
  const m = calculateMonthlyPayment(100_000, r, 120);
  assert.ok(m !== null);
  assert.ok(Math.abs(m! - 1_110.205019416512) < 1e-9);

  const b0 = calculateRemainingBalance({
    principal: 100_000,
    monthlyRate: r,
    termMonths: 120,
    elapsedMonths: 0,
    monthlyPayment: m!,
  });
  assert.equal(b0, 100_000);

  const bEnd = calculateRemainingBalance({
    principal: 100_000,
    monthlyRate: r,
    termMonths: 120,
    elapsedMonths: 120,
    monthlyPayment: m!,
  });
  assert.equal(bEnd, 0);

  const result = calculateLoanBalanceInLoanCurrency({
    loanAmount: 100_000,
    interestRatePercent: 6,
    termYears: 10,
    termMonths: 0,
    periodYears: 3,
    periodMonths: 0,
  });
  assert.ok(result);
  assert.equal(result!.termMonthsTotal, 120);
  assert.equal(result!.elapsedMonths, 36);
  assert.ok(Math.abs(result!.loanRemaining - 75_996.9113062557) < 0.01);
}

{
  const zero = calculateLoanBalanceInLoanCurrency({
    loanAmount: 12_000,
    interestRatePercent: 0,
    termYears: 1,
    termMonths: 0,
    periodYears: 0,
    periodMonths: 6,
  });
  assert.ok(zero);
  assert.equal(zero!.loanRemaining, 6_000);
}

{
  const over = calculateLoanBalanceInLoanCurrency({
    loanAmount: 10_000,
    interestRatePercent: 5,
    termYears: 1,
    termMonths: 0,
    periodYears: 2,
    periodMonths: 0,
  });
  assert.equal(over, null);
}

console.log('loan-balance/calculation.test.ts: ok');
