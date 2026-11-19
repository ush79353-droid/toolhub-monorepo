import assert from 'node:assert/strict';
import {
  calculateMonthlyPayment,
  calculateRefinance,
  solvePaymentCountFromPayment,
} from './calculation';
import { validateRefinanceInput } from './validation';
import { createDefaultInput } from './types';

{
  const p = calculateMonthlyPayment({
    principal: 250_000,
    annualRatePercent: 6,
    paymentCount: 240,
  });
  assert.ok(p);
  assert.ok(p > 1700 && p < 1900);
}

{
  const n = solvePaymentCountFromPayment({
    principal: 250_000,
    annualRatePercent: 7,
    monthlyPayment: 1_800,
  });
  assert.ok(n);
  assert.ok(n > 200 && n < 400);
}

{
  const out = calculateRefinance({
    remainingBalance: 250_000,
    currentMonthlyPayment: 1_800,
    currentRatePercent: 7,
    newTermYears: 20,
    newRatePercent: 6,
    pointsPercent: 2,
    costsAndFees: 1_500,
    cashOutAmount: 0,
  });
  assert.ok(out);
  assert.equal(out.newLoanAmount, 250_000);
  assert.equal(out.pointsCost, 5_000);
  assert.equal(out.closingCosts, 6_500);
  assert.ok(out.newMonthlyPayment > 0);
  assert.ok(out.currentRemainingMonths > 0);
}

{
  const zeroRate = calculateMonthlyPayment({
    principal: 12_000,
    annualRatePercent: 0,
    paymentCount: 12,
  });
  assert.equal(zeroRate, 1_000);
}

{
  const bad = calculateRefinance({
    remainingBalance: 250_000,
    currentMonthlyPayment: 100,
    currentRatePercent: 7,
    newTermYears: 20,
    newRatePercent: 6,
    pointsPercent: 0,
    costsAndFees: 0,
    cashOutAmount: 0,
  });
  assert.equal(bad, null);
}

{
  const ok = validateRefinanceInput(createDefaultInput());
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.newLoanAmount, 250_000);
  assert.equal(ok.result.pointsCost, 5_000);
}

console.log('refinance calculation.test.ts: ok');
