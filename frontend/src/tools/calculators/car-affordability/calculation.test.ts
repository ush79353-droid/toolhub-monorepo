import assert from 'node:assert/strict';
import {
  calculateCarAffordability,
  calculateMaximumLoanAmount,
  roundMoney,
} from './calculation';
import { validateCarAffordabilityInput } from './validation';
import { createDefaultInput, createExampleInput } from './types';

function approxEqual(actual: number, expected: number, tol = 0.02) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`,
  );
}

// Test Case 1 — Standard affordability
{
  const r = calculateCarAffordability({
    monthlyPayment: 500,
    availableMoney: 5000,
    tradeInValue: 3000,
    annualInterestRate: 6,
    loanTermMonths: 60,
    includeAdditionalCosts: false,
    salesTaxRatePercent: 0,
    dealerFees: 0,
    registrationFees: 0,
    otherUpfrontCosts: 0,
    downPayment: null,
    currency: 'USD',
  });
  assert.ok(r);
  approxEqual(r.loanAmount, 25862.78);
  approxEqual(r.maximumCarValue, 33862.78);
  approxEqual(r.totalInterestPaid, 4137.22);
}

// Test Case 2 — Zero interest
{
  const r = calculateCarAffordability({
    monthlyPayment: 500,
    availableMoney: 5000,
    tradeInValue: 0,
    annualInterestRate: 0,
    loanTermMonths: 60,
    includeAdditionalCosts: false,
    salesTaxRatePercent: 0,
    dealerFees: 0,
    registrationFees: 0,
    otherUpfrontCosts: 0,
    downPayment: null,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.loanAmount, 30_000);
  assert.equal(r.maximumCarValue, 35_000);
  assert.equal(r.totalInterestPaid, 0);
}

// Test Case 3 — No available money
{
  const loan = calculateMaximumLoanAmount(400, 5, 60);
  assert.ok(loan !== null);
  const r = calculateCarAffordability({
    monthlyPayment: 400,
    availableMoney: 0,
    tradeInValue: 0,
    annualInterestRate: 5,
    loanTermMonths: 60,
    includeAdditionalCosts: false,
    salesTaxRatePercent: 0,
    dealerFees: 0,
    registrationFees: 0,
    otherUpfrontCosts: 0,
    downPayment: null,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.maximumCarValue, r.loanAmount);
  approxEqual(r.loanAmount, roundMoney(loan as number, 'USD'));
}

// Test Case 4 — Trade-in + cash = $9,000 contribution
{
  const r = calculateCarAffordability({
    monthlyPayment: 400,
    availableMoney: 5000,
    tradeInValue: 4000,
    annualInterestRate: 5,
    loanTermMonths: 60,
    includeAdditionalCosts: false,
    salesTaxRatePercent: 0,
    dealerFees: 0,
    registrationFees: 0,
    otherUpfrontCosts: 0,
    downPayment: null,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.maximumCarValue, roundMoney(r.loanAmount + 9000, 'USD'));
}

// Test Case 5 — Longer term increases loan principal
{
  const m36 = calculateMaximumLoanAmount(500, 6, 36)!;
  const m60 = calculateMaximumLoanAmount(500, 6, 60)!;
  const m72 = calculateMaximumLoanAmount(500, 6, 72)!;
  assert.ok(m36 < m60 && m60 < m72);
}

// Test Case 6 — Higher rate reduces principal
{
  const low = calculateMaximumLoanAmount(500, 4, 60)!;
  const high = calculateMaximumLoanAmount(500, 8, 60)!;
  assert.ok(high < low);
}

// Test Case 7 — Sales tax reduces sticker price
{
  const base = calculateCarAffordability({
    monthlyPayment: 500,
    availableMoney: 5000,
    tradeInValue: 3000,
    annualInterestRate: 6,
    loanTermMonths: 60,
    includeAdditionalCosts: false,
    salesTaxRatePercent: 0,
    dealerFees: 0,
    registrationFees: 0,
    otherUpfrontCosts: 0,
    downPayment: null,
    currency: 'USD',
  })!;
  const taxed = calculateCarAffordability({
    monthlyPayment: 500,
    availableMoney: 5000,
    tradeInValue: 3000,
    annualInterestRate: 6,
    loanTermMonths: 60,
    includeAdditionalCosts: true,
    salesTaxRatePercent: 8,
    dealerFees: 0,
    registrationFees: 0,
    otherUpfrontCosts: 0,
    downPayment: null,
    currency: 'USD',
  })!;
  assert.ok(taxed.maximumCarValue < base.maximumCarValue);
  approxEqual(taxed.maximumCarValue + taxed.salesTaxAmount, base.maximumCarValue);
}

// Test Case 8 — Dealer fees reduce price
{
  const base = calculateCarAffordability({
    monthlyPayment: 500,
    availableMoney: 5000,
    tradeInValue: 0,
    annualInterestRate: 0,
    loanTermMonths: 60,
    includeAdditionalCosts: false,
    salesTaxRatePercent: 0,
    dealerFees: 0,
    registrationFees: 0,
    otherUpfrontCosts: 0,
    downPayment: null,
    currency: 'USD',
  })!;
  const fees = calculateCarAffordability({
    monthlyPayment: 500,
    availableMoney: 5000,
    tradeInValue: 0,
    annualInterestRate: 0,
    loanTermMonths: 60,
    includeAdditionalCosts: true,
    salesTaxRatePercent: 0,
    dealerFees: 1000,
    registrationFees: 0,
    otherUpfrontCosts: 0,
    downPayment: null,
    currency: 'USD',
  })!;
  assert.equal(fees.maximumCarValue, base.maximumCarValue - 1000);
}

// Test Case 9 — Zero monthly payment
{
  const r = calculateCarAffordability({
    monthlyPayment: 0,
    availableMoney: 4000,
    tradeInValue: 1000,
    annualInterestRate: 6,
    loanTermMonths: 60,
    includeAdditionalCosts: false,
    salesTaxRatePercent: 0,
    dealerFees: 0,
    registrationFees: 0,
    otherUpfrontCosts: 0,
    downPayment: null,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.loanAmount, 0);
  assert.equal(r.maximumCarValue, 5000);
  assert.equal(r.totalInterestPaid, 0);
}

// Test Case 10 — Decimals + down payment does not double-count
{
  const r = calculateCarAffordability({
    monthlyPayment: 500.5,
    availableMoney: 5000,
    tradeInValue: 0,
    annualInterestRate: 6.25,
    loanTermMonths: 48,
    includeAdditionalCosts: true,
    salesTaxRatePercent: 0,
    dealerFees: 0,
    registrationFees: 0,
    otherUpfrontCosts: 0,
    downPayment: 2000,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.cashContribution, 2000);
  assert.equal(r.usedDownPaymentAllocation, true);
  assert.equal(r.maximumCarValue, roundMoney(r.loanAmount + 2000, 'USD'));
}

// Validation: loan term No
{
  const input = createExampleInput();
  input.loanTermEnabled = false;
  const v = validateCarAffordabilityInput(input);
  assert.equal(v.isValid, false);
  assert.ok(v.errors.loanTermEnabled);
}

// Validation: example input
{
  const v = validateCarAffordabilityInput(createExampleInput());
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  approxEqual(v.result.loanAmount, 25862.78);
}

// Validation: empty defaults incomplete
{
  const v = validateCarAffordabilityInput(createDefaultInput());
  assert.equal(v.isValid, false);
}

console.log('car-affordability/calculation.test.ts: all assertions passed');
