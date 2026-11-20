import assert from 'node:assert/strict';
import {
  calculateAnnualPmi,
  calculateDownPaymentAmount,
  calculateDownPaymentPercentage,
  calculateLoanToValueRatio,
  calculateMonthlyPmi,
  calculateMortgageAmount,
  evaluatePmiApplicability,
} from './calculation';
import { createDefaultInput } from './types';
import { validatePmiInput } from './validation';

// Test 1: Mortgage amount
assert.equal(calculateMortgageAmount(400_000, 40_000), 360_000);

// Test 2: Down payment percentage
assert.equal(calculateDownPaymentPercentage(400_000, 40_000), 10);

// Test 3: Down payment amount
assert.equal(calculateDownPaymentAmount(400_000, 20), 80_000);

// Test 4: LTV
assert.equal(calculateLoanToValueRatio(360_000, 400_000), 90);

// Test 5: Annual PMI
assert.equal(calculateAnnualPmi(360_000, 0.5), 1_800);

// Test 6: Monthly PMI
assert.equal(calculateMonthlyPmi(1_800), 150);

// Test 7: Complete PMI calculation
{
  const v = validatePmiInput({
    ...createDefaultInput(),
    homePrice: '350000',
    downPaymentMode: 'amount',
    downPaymentAmount: '35000',
    annualPmiRate: '0.6',
  });
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  assert.equal(v.result!.mortgageAmount, 315_000);
  assert.equal(v.result!.loanToValueRatio, 90);
  assert.equal(v.result!.annualPmi, 1_890);
  assert.equal(v.result!.monthlyPmi, 157.5);
}

// Test 8: Zero down payment
{
  const loan = calculateMortgageAmount(300_000, 0)!;
  assert.equal(loan, 300_000);
  assert.equal(calculateLoanToValueRatio(loan, 300_000), 100);
}

// Test 9: Twenty percent down — generally not required
{
  const v = validatePmiInput({
    ...createDefaultInput(),
    homePrice: '300000',
    downPaymentMode: 'amount',
    downPaymentAmount: '60000',
    annualPmiRate: '0.5',
  });
  assert.equal(v.result!.loanToValueRatio, 80);
  assert.equal(v.result!.applicability, 'generallyNotRequired');
  // Entered rate still produces a mathematical estimate
  assert.equal(v.result!.annualPmi, 1_200);
}

// Test 10: Full down payment
{
  const v = validatePmiInput({
    ...createDefaultInput(),
    homePrice: '300000',
    downPaymentMode: 'percentage',
    downPaymentPercentage: '100',
    annualPmiRate: '0.5',
  });
  assert.equal(v.result!.mortgageAmount, 0);
  assert.equal(v.result!.loanToValueRatio, 0);
  assert.equal(v.result!.annualPmi, 0);
  assert.equal(v.result!.monthlyPmi, 0);
}

// Test 11: Invalid down payment
{
  const v = validatePmiInput({
    ...createDefaultInput(),
    homePrice: '300000',
    downPaymentAmount: '350000',
    annualPmiRate: '0.5',
  });
  assert.ok(v.errors.downPaymentAmount);
}

// Test 12: Negative home price
{
  const v = validatePmiInput({
    ...createDefaultInput(),
    homePrice: '-1',
    downPaymentAmount: '0',
    annualPmiRate: '0.5',
  });
  assert.ok(v.errors.homePrice);
}

// Test 13: Negative PMI rate
{
  const v = validatePmiInput({
    ...createDefaultInput(),
    homePrice: '300000',
    downPaymentAmount: '30000',
    annualPmiRate: '-0.1',
  });
  assert.ok(v.errors.annualPmiRate);
}

// Test 14: Zero PMI rate
assert.equal(calculateAnnualPmi(300_000, 0), 0);
assert.equal(calculateMonthlyPmi(0), 0);

// Test 15: Decimal PMI rate
assert.equal(calculateAnnualPmi(250_000, 0.75), 1_875);
assert.equal(calculateMonthlyPmi(1_875), 156.25);

// Test 16: Missing required inputs
{
  const v = validatePmiInput(createDefaultInput());
  assert.equal(v.result, null);
}

// Test 17: Percentage mode sync
{
  const v = validatePmiInput({
    ...createDefaultInput(),
    homePrice: '400000',
    downPaymentMode: 'percentage',
    downPaymentPercentage: '10',
    annualPmiRate: '0.5',
  });
  assert.equal(v.result!.downPaymentAmount, 40_000);
  assert.equal(v.result!.mortgageAmount, 360_000);
  assert.equal(v.result!.monthlyPmi, 150);
}

// Test 18: Clearing home price
{
  const v = validatePmiInput({
    ...createDefaultInput(),
    homePrice: '',
    downPaymentAmount: '40000',
    annualPmiRate: '0.5',
  });
  assert.equal(v.result, null);
}

// Test 19: Reset defaults
{
  const d = createDefaultInput();
  assert.equal(d.downPaymentMode, 'amount');
  assert.equal(d.currency, 'PKR');
  assert.equal(d.homePrice, '');
  assert.equal(d.annualPmiRate, '');
}

// Test 20: Large numbers
{
  const v = validatePmiInput({
    ...createDefaultInput(),
    homePrice: '20000000',
    downPaymentMode: 'percentage',
    downPaymentPercentage: '10',
    annualPmiRate: '0.5',
  });
  assert.ok(v.result!.formattedMortgageAmount.includes(','));
  assert.equal(v.result!.mortgageAmount, 18_000_000);
  assert.equal(v.result!.annualPmi, 90_000);
  assert.equal(v.result!.monthlyPmi, 7_500);
}

// Test 21 / 23: Applicability thresholds
assert.equal(evaluatePmiApplicability(90), 'mayBeRequired');
assert.equal(evaluatePmiApplicability(80), 'generallyNotRequired');
assert.equal(evaluatePmiApplicability(79.9), 'generallyNotRequired');

// Worked example from spec
{
  const v = validatePmiInput({
    ...createDefaultInput(),
    homePrice: '400000',
    downPaymentMode: 'amount',
    downPaymentAmount: '40000',
    annualPmiRate: '0.5',
  });
  assert.equal(v.result!.mortgageAmount, 360_000);
  assert.equal(v.result!.loanToValueRatio, 90);
  assert.equal(v.result!.annualPmi, 1_800);
  assert.equal(v.result!.monthlyPmi, 150);
  assert.equal(v.result!.applicability, 'mayBeRequired');
}

console.log('pmi/calculation.test.ts: all assertions passed');
