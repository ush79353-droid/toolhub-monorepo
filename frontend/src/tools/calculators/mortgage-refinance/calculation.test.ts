import assert from 'node:assert/strict';
import {
  addCalendarMonths,
  amortizingPayment,
  breakEvenMonthCount,
  calculateMortgageRefinance,
  effectiveMonthlyRate,
  elapsedWholeMonths,
  formatTermYears,
  remainingBalance,
} from './calculation';
import { createDefaultInput } from './types';
import { validateMortgageRefinanceInput } from './validation';

// Screenshot defaults: 300,000 · 2021-09-02 · 30 yrs · 3.5% monthly
// vs 2026-11-16 · 25 yrs · 2.5% monthly · 1 point · 1,500 costs · 2,500 cash out.
{
  const elapsed = elapsedWholeMonths('2021-09-02', '2026-11-16');
  assert.equal(elapsed, 62);

  const monthly = effectiveMonthlyRate(3.5, 'monthly');
  assert.ok(monthly !== null);
  assert.ok(Math.abs((monthly as number) - 0.035 / 12) < 1e-15);

  const balance = remainingBalance({
    principal: 300_000,
    monthlyRate: monthly as number,
    totalMonths: 360,
    paymentsMade: 62,
  });
  assert.ok(balance !== null);
  assert.ok(Math.abs((balance as number) - 267_965.01) < 0.01);

  const cmp = calculateMortgageRefinance({
    originalPrincipal: 300_000,
    originalTermMonths: 360,
    elapsedMonths: 62,
    currentAnnualRatePercent: 3.5,
    currentCompounding: 'monthly',
    newTermMonths: 300,
    newAnnualRatePercent: 2.5,
    newCompounding: 'monthly',
    pointsPercent: 1,
    closingCosts: 1_500,
    cashInOut: 2_500,
  });
  assert.ok(cmp);
  assert.ok(Math.abs(cmp.current.principal - 267_965.01) < 0.01);
  assert.ok(Math.abs(cmp.neu.principal - (cmp.current.principal + 2_500)) < 1e-6);
  assert.ok(Math.abs(cmp.neu.principal - 270_465.01) < 0.01);
  assert.ok(Math.abs(cmp.current.monthlyPayment - 1_347.13) < 0.01);
  assert.ok(Math.abs(cmp.neu.monthlyPayment - 1_213.35) < 0.01);
  assert.ok(Math.abs(cmp.current.totalInterest - 133_480.94) < 0.02);
  assert.ok(Math.abs(cmp.current.totalPayments - 401_445.95) < 0.02);
  assert.ok(Math.abs(cmp.neu.totalInterest - 93_540.38) < 0.02);
  assert.ok(Math.abs(cmp.refinancingCost - 4_204.65) < 0.01);
  // Upfront points + costs are in new total payments, not in the principal.
  assert.ok(Math.abs(cmp.neu.totalPayments - 368_210.04) < 0.02);
  assert.ok(cmp.pointsCost < cmp.neu.principal * 0.011);
  assert.ok(Math.abs(cmp.monthlySavings - 133.78) < 0.01);
  assert.equal(cmp.breakEvenMonths, 32);
  assert.equal(formatTermYears(cmp.current.termMonths), '24.8 yrs');
  assert.equal(formatTermYears(cmp.neu.termMonths), '25 yrs');
  assert.equal(addCalendarMonths('2026-11-16', 32), '2029-07-16');
}

// Points stay upfront: principal rises only by cash out.
{
  const cmp = calculateMortgageRefinance({
    originalPrincipal: 100_000,
    originalTermMonths: 120,
    elapsedMonths: 0,
    currentAnnualRatePercent: 6,
    currentCompounding: 'monthly',
    newTermMonths: 120,
    newAnnualRatePercent: 6,
    newCompounding: 'monthly',
    pointsPercent: 2,
    closingCosts: 500,
    cashInOut: 1_000,
  });
  assert.ok(cmp);
  assert.ok(Math.abs(cmp.neu.principal - 101_000) < 1e-6);
  assert.ok(Math.abs(cmp.pointsCost - 2_020) < 1e-6);
  assert.ok(Math.abs(cmp.refinancingCost - 2_520) < 1e-6);
  assert.ok(Math.abs(cmp.neu.totalPayments - (cmp.neu.monthlyPayment * 120 + 2_520)) < 1e-6);
}

// Cash in reduces principal. Zero rate uses principal / months.
{
  const pay = amortizingPayment(12_000, 0, 24);
  assert.ok(pay !== null && Math.abs(pay - 500) < 1e-9);
  const cmp = calculateMortgageRefinance({
    originalPrincipal: 12_000,
    originalTermMonths: 24,
    elapsedMonths: 0,
    currentAnnualRatePercent: 0,
    currentCompounding: 'monthly',
    newTermMonths: 12,
    newAnnualRatePercent: 0,
    newCompounding: 'annually',
    pointsPercent: 0,
    closingCosts: 0,
    cashInOut: -2_000,
  });
  assert.ok(cmp);
  assert.ok(Math.abs(cmp.current.principal - 12_000) < 1e-6);
  assert.ok(Math.abs(cmp.neu.principal - 10_000) < 1e-6);
  assert.ok(Math.abs(cmp.neu.monthlyPayment - 10_000 / 12) < 1e-6);
  assert.equal(cmp.breakEvenMonths, 0);
}

// Higher new payment never breaks even.
{
  const months = breakEvenMonthCount(4_000, -10);
  assert.equal(months, null);
  const cmp = calculateMortgageRefinance({
    originalPrincipal: 200_000,
    originalTermMonths: 360,
    elapsedMonths: 0,
    currentAnnualRatePercent: 3,
    currentCompounding: 'monthly',
    newTermMonths: 360,
    newAnnualRatePercent: 8,
    newCompounding: 'monthly',
    pointsPercent: 1,
    closingCosts: 1_000,
    cashInOut: 0,
  });
  assert.ok(cmp);
  assert.ok(cmp.monthlySavings < 0);
  assert.equal(cmp.breakEvenMonths, null);
}

// Semi-annual and continuous nominal rates are not APR/12.
{
  const monthly = effectiveMonthlyRate(6, 'monthly');
  const semi = effectiveMonthlyRate(6, 'semiannually');
  const continuous = effectiveMonthlyRate(6, 'continuously');
  assert.ok(monthly !== null && semi !== null && continuous !== null);
  assert.ok(Math.abs((monthly as number) - 0.005) < 1e-12);
  // Same nominal APR: more frequent compounding raises the equivalent monthly rate.
  assert.ok((semi as number) < (monthly as number));
  assert.ok((continuous as number) > (monthly as number));
}

// Paid-off and negative principal are rejected. Same-currency defaults validate.
{
  assert.equal(
    calculateMortgageRefinance({
      originalPrincipal: 50_000,
      originalTermMonths: 12,
      elapsedMonths: 12,
      currentAnnualRatePercent: 5,
      currentCompounding: 'monthly',
      newTermMonths: 12,
      newAnnualRatePercent: 4,
      newCompounding: 'monthly',
      pointsPercent: 0,
      closingCosts: 0,
      cashInOut: 0,
    }),
    null
  );
  const tooMuchCashIn = calculateMortgageRefinance({
    originalPrincipal: 10_000,
    originalTermMonths: 12,
    elapsedMonths: 0,
    currentAnnualRatePercent: 5,
    currentCompounding: 'monthly',
    newTermMonths: 12,
    newAnnualRatePercent: 4,
    newCompounding: 'monthly',
    pointsPercent: 0,
    closingCosts: 0,
    cashInOut: -10_000,
  });
  assert.equal(tooMuchCashIn, null);

  const validated = validateMortgageRefinanceInput(createDefaultInput(), null);
  assert.equal(validated.isValid, true);
  assert.ok(validated.result);
  assert.equal(validated.result?.breakEvenMonths, 32);
  assert.equal(validated.result?.breakEvenDateIso, '2029-07-16');
}

console.log('mortgage-refinance calculation.test.ts: all assertions passed');
