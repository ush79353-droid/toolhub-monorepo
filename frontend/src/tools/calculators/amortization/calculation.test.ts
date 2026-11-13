import assert from 'node:assert/strict';
import {
  buildAmortizationCsv,
  buildAmortizationSummaryText,
  calculateAmortization,
  computeEffectiveAnnualRate,
  computePeriodicRate,
} from './calculation';
import { createDefaultAmortizationInput } from './types';
import { validateAmortizationInput } from './validation';

function approxEqual(actual: number, expected: number, tolerance = 0.02, message = ''): void {
  const diff = Math.abs(actual - expected);
  assert.ok(
    diff <= tolerance,
    `${message} Expected ~${expected}, got ${actual} (diff: ${diff.toFixed(4)})`
  );
}

console.log('--- Running Amortization Calculation Tests ---');

// Test 1: Standard Monthly Amortization (Example from Prompt Section 8)
{
  const input = createDefaultAmortizationInput('2026-01-01');
  // 10,000 loan, 10 years (120 mo), 12.5% nominal interest, monthly compounding & payment
  const result = calculateAmortization(input);

  assert.equal(result.loanAmount, 10000);
  assert.equal(result.scheduledPaymentsCount, 120);
  assert.equal(result.actualPaymentsCount, 120);
  assert.equal(result.paymentsSaved, 0);

  // Expected ~146.38 monthly payment
  approxEqual(result.regularPayment, 146.38, 0.02, 'Regular payment');

  // Sum of principal paid across all rows must equal original loan principal exactly
  const totalPrincipalFromSchedule = result.schedule.reduce(
    (sum, row) => sum + row.principalPaid + row.extraPayment,
    0
  );
  approxEqual(totalPrincipalFromSchedule, 10000, 0.01, 'Schedule total principal');

  // Total interest reconciliation
  const totalInterestFromSchedule = result.schedule.reduce(
    (sum, row) => sum + row.interestPaid,
    0
  );
  approxEqual(totalInterestFromSchedule, result.totalInterestPaid, 0.01, 'Interest reconciliation');

  // Final balance must equal zero
  assert.equal(result.schedule[result.schedule.length - 1].closingBalance, 0);

  console.log('✓ Test 1: Standard Monthly Amortization passed');
}

// Test 2: Zero-Interest Loan
{
  const input = {
    ...createDefaultAmortizationInput('2026-01-01'),
    loanAmount: 12000,
    termYears: 1,
    termMonths: 0,
    interestRate: 0,
    extraPayment: 0,
  };
  const result = calculateAmortization(input);

  assert.equal(result.regularPayment, 1000);
  assert.equal(result.totalInterestPaid, 0);
  assert.equal(result.totalAmountPaid, 12000);
  assert.equal(result.schedule.length, 12);
  assert.equal(result.schedule[11].closingBalance, 0);

  // Each row has 0 interest and 1000 principal
  for (const row of result.schedule) {
    assert.equal(row.interestPaid, 0);
    assert.equal(row.principalPaid, 1000);
  }

  console.log('✓ Test 2: Zero-Interest Loan passed');
}

// Test 3: Quarterly Payments with Annual Compounding
{
  const input = {
    ...createDefaultAmortizationInput('2026-01-01'),
    loanAmount: 20000,
    termYears: 5,
    termMonths: 0,
    interestRate: 6.0,
    compoundingFrequency: 'annually' as const,
    paymentFrequency: 'quarterly' as const,
  };
  const result = calculateAmortization(input);

  assert.equal(result.scheduledPaymentsCount, 20); // 5 years * 4 quarters
  assert.equal(result.schedule.length, 20);
  assert.ok(result.regularPayment > 0);
  assert.equal(result.schedule[19].closingBalance, 0);

  const totalPrincipal = result.schedule.reduce((sum, r) => sum + r.principalPaid, 0);
  approxEqual(totalPrincipal, 20000, 0.01, 'Quarterly total principal');

  console.log('✓ Test 3: Quarterly Payments with Annual Compounding passed');
}

// Test 4: Weekly Payments with Daily Compounding
{
  const input = {
    ...createDefaultAmortizationInput('2026-01-01'),
    loanAmount: 5000,
    termYears: 1,
    termMonths: 0,
    interestRate: 8.0,
    compoundingFrequency: 'daily' as const,
    paymentFrequency: 'weekly' as const,
  };
  const result = calculateAmortization(input);

  assert.equal(result.scheduledPaymentsCount, 52); // 1 year * 52 weeks
  assert.equal(result.schedule.length, 52);
  assert.equal(result.schedule[51].closingBalance, 0);

  const totalPrincipal = result.schedule.reduce((sum, r) => sum + r.principalPaid, 0);
  approxEqual(totalPrincipal, 5000, 0.01, 'Weekly total principal');

  console.log('✓ Test 4: Weekly Payments with Daily Compounding passed');
}

// Test 5: Canadian Mortgage Convention (Semi-annual compounding with monthly payments)
{
  const rate = computePeriodicRate(5.0, 'semiannually', 'monthly');
  // (1 + 0.05/2)^(2/12) - 1 = (1.025)^(1/6) - 1
  const expectedRate = Math.pow(1.025, 1 / 6) - 1;
  approxEqual(rate, expectedRate, 1e-8, 'Canadian periodic rate formula');

  const input = {
    ...createDefaultAmortizationInput('2026-01-01'),
    loanAmount: 300000,
    termYears: 25,
    termMonths: 0,
    interestRate: 5.0,
    compoundingFrequency: 'semiannually' as const,
    paymentFrequency: 'monthly' as const,
  };
  const result = calculateAmortization(input);
  assert.equal(result.scheduledPaymentsCount, 300);
  assert.equal(result.schedule[299].closingBalance, 0);

  console.log('✓ Test 5: Canadian Mortgage Convention passed');
}

// Test 6: Recurring Extra Payments & Term Reduction
{
  const input = {
    ...createDefaultAmortizationInput('2026-01-01'),
    loanAmount: 10000,
    termYears: 10,
    termMonths: 0,
    interestRate: 12.5,
    extraPayment: 50, // Extra $50/month
  };
  const result = calculateAmortization(input);

  assert.ok(result.actualPaymentsCount < result.scheduledPaymentsCount);
  assert.ok(result.paymentsSaved > 0);
  assert.ok(result.interestSavings > 0);
  assert.ok(result.totalExtraPaymentAmount > 0);
  assert.ok(result.timeSavedDescription.includes('saved'));
  assert.equal(result.schedule[result.schedule.length - 1].closingBalance, 0);

  // Total principal paid must still equal 10,000
  const totalPrincipal = result.schedule.reduce(
    (sum, r) => sum + r.principalPaid + r.extraPayment,
    0
  );
  approxEqual(totalPrincipal, 10000, 0.01, 'Extra payment principal match');

  console.log('✓ Test 6: Recurring Extra Payments passed');
}

// Test 7: One-Time Extra Payment
{
  const input = {
    ...createDefaultAmortizationInput('2026-01-01'),
    loanAmount: 10000,
    termYears: 5,
    termMonths: 0,
    interestRate: 10.0,
    extraPayment: 0,
    oneTimeExtraAmount: 2000,
    oneTimeExtraPeriod: 12,
  };
  const result = calculateAmortization(input);

  assert.ok(result.actualPaymentsCount < result.scheduledPaymentsCount);
  assert.ok(result.interestSavings > 0);
  assert.equal(result.schedule[11].extraPayment, 2000); // 12th period (0-indexed 11)
  assert.equal(result.schedule[result.schedule.length - 1].closingBalance, 0);

  console.log('✓ Test 7: One-Time Extra Payment passed');
}

// Test 8: Early Payoff with Large Extra Payment
{
  const input = {
    ...createDefaultAmortizationInput('2026-01-01'),
    loanAmount: 10000,
    termYears: 10,
    termMonths: 0,
    interestRate: 10.0,
    extraPayment: 0,
    oneTimeExtraAmount: 9000,
    oneTimeExtraPeriod: 2,
  };
  const result = calculateAmortization(input);

  // Loan should pay off early (around period 9 instead of 120)
  assert.ok(result.actualPaymentsCount <= 10);
  assert.ok(result.paymentsSaved >= 110);
  assert.equal(result.schedule[result.schedule.length - 1].closingBalance, 0);

  const totalPrincipal = result.schedule.reduce(
    (sum, r) => sum + r.principalPaid + r.extraPayment,
    0
  );
  approxEqual(totalPrincipal, 10000, 0.01, 'Early payoff total principal');

  console.log('✓ Test 8: Early Payoff with Large Extra Payment passed');
}

// Test 9: Very Small Interest Rate (Numerical Stability)
{
  const input = {
    ...createDefaultAmortizationInput('2026-01-01'),
    loanAmount: 100000,
    termYears: 30,
    termMonths: 0,
    interestRate: 0.0001, // 0.0001%
  };
  const result = calculateAmortization(input);

  assert.ok(Number.isFinite(result.regularPayment));
  assert.ok(result.regularPayment > 0);
  assert.equal(result.schedule[result.schedule.length - 1].closingBalance, 0);

  console.log('✓ Test 9: Very Small Interest Rate passed');
}

// Test 10: Large Loan Amount
{
  const input = {
    ...createDefaultAmortizationInput('2026-01-01'),
    loanAmount: 50000000, // 50M
    termYears: 30,
    termMonths: 0,
    interestRate: 7.25,
  };
  const result = calculateAmortization(input);

  assert.ok(result.regularPayment > 0);
  assert.equal(result.schedule[result.schedule.length - 1].closingBalance, 0);
  const totalPrincipal = result.schedule.reduce((sum, r) => sum + r.principalPaid, 0);
  approxEqual(totalPrincipal, 50000000, 0.05, 'Large loan principal match');

  console.log('✓ Test 10: Large Loan Amount passed');
}

// Test 11: Yearly Schedule Aggregation Consistency
{
  const input = createDefaultAmortizationInput('2026-01-01');
  const result = calculateAmortization(input);

  assert.equal(result.yearlySchedule.length, 10);
  const yearlyPrincipalSum = result.yearlySchedule.reduce((sum, y) => sum + y.principalPaid, 0);
  approxEqual(yearlyPrincipalSum, 10000, 0.01, 'Yearly principal sum');

  const yearlyInterestSum = result.yearlySchedule.reduce((sum, y) => sum + y.interestPaid, 0);
  approxEqual(yearlyInterestSum, result.totalInterestPaid, 0.01, 'Yearly interest sum');

  console.log('✓ Test 11: Yearly Schedule Aggregation passed');
}

// Test 12: CSV Export and Summary Text
{
  const input = createDefaultAmortizationInput('2026-01-01');
  const result = calculateAmortization(input);

  const csv = buildAmortizationCsv(result);
  assert.ok(csv.includes('Payment #,Date,Opening Balance'));
  assert.ok(csv.includes('120,'));

  const summary = buildAmortizationSummaryText(input, result);
  assert.ok(summary.includes('Amortization Calculator Summary'));
  assert.ok(summary.includes('Regular Payment:'));

  console.log('✓ Test 12: CSV Export and Summary Text passed');
}

// Test 13: Validation Edge Cases
{
  const valid = validateAmortizationInput(createDefaultAmortizationInput());
  assert.equal(valid.isValid, true);

  // Negative loan amount
  const negLoan = validateAmortizationInput({
    ...createDefaultAmortizationInput(),
    loanAmount: -500,
  });
  assert.equal(negLoan.isValid, false);
  assert.ok(negLoan.errors.loanAmount);

  // Negative interest rate
  const negRate = validateAmortizationInput({
    ...createDefaultAmortizationInput(),
    interestRate: -2,
  });
  assert.equal(negRate.isValid, false);
  assert.ok(negRate.errors.interestRate);

  // Zero term
  const zeroTerm = validateAmortizationInput({
    ...createDefaultAmortizationInput(),
    termYears: 0,
    termMonths: 0,
  });
  assert.equal(zeroTerm.isValid, false);
  assert.ok(zeroTerm.errors.term);

  // Non-whole payment periods (e.g. 1 month with quarterly payments)
  const nonWhole = validateAmortizationInput({
    ...createDefaultAmortizationInput(),
    termYears: 0,
    termMonths: 1,
    paymentFrequency: 'quarterly',
  });
  assert.equal(nonWhole.isValid, false);
  assert.ok(nonWhole.errors.term);

  // Extra payment >= loan amount
  const tooLargeExtra = validateAmortizationInput({
    ...createDefaultAmortizationInput(),
    loanAmount: 10000,
    extraPayment: 15000,
  });
  assert.equal(tooLargeExtra.isValid, false);
  assert.ok(tooLargeExtra.errors.extraPayment);

  console.log('✓ Test 13: Validation Edge Cases passed');
}

// Test 14: Effective Annual Rate (EAR) Calculation
{
  // 12% nominal compounded monthly: EAR = (1 + 0.12/12)^12 - 1 = (1.01)^12 - 1 = 12.6825%
  const ear = computeEffectiveAnnualRate(12.0, 'monthly');
  approxEqual(ear * 100, 12.6825, 0.01, 'EAR 12% monthly');

  console.log('✓ Test 14: Effective Annual Rate passed');
}

console.log('=== All Amortization Calculator Tests Passed Successfully! ===');
