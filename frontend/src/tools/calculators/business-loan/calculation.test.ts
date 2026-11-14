import assert from 'node:assert/strict';
import { calculateBusinessLoan } from './calculation';
import { validateBusinessLoanInput } from './validation';

// Test Case 1: Exact Reference Screenshot Parity
{
  const res = calculateBusinessLoan({
    knownRate: 'nominal',
    interestRate: 5,
    compoundFrequency: 'monthly',
    loanAmount: 100000,
    termYears: 10,
    termMonths: 0,
    paymentFrequency: 'monthly',
    prepaidFee: 500,
    loanedFee: 1000,
    originationFee: 8,
    originationFeeRepayment: 'from_loan',
    currency: 'PKR',
  });

  assert.ok(res !== null);
  // Net loan amount received
  assert.equal(res.netLoanReceived, 92000);
  // Periodic payment
  assert.equal(Number(res.periodicPayment.toFixed(2)), 1071.26);
  // Total interest payment
  assert.equal(Number(res.totalInterest.toFixed(2)), 27551.40);
  // Total payment
  assert.equal(Number(res.totalPayment.toFixed(2)), 129051.40);
  // Total finance charge
  assert.equal(Number(res.totalFinanceCharge.toFixed(2)), 37051.40);
  // APR (7.15%)
  assert.equal(Number(res.apr.toFixed(2)), 7.15);
  // Effective APR (7.39%)
  assert.equal(Number(res.effectiveApr.toFixed(2)), 7.39);
  // Callout message
  assert.ok(res.calloutMessage.includes('92,000'));
  assert.ok(res.calloutMessage.includes('8,000'));
}

// Test Case 2: Rolling Origination Fee into Loan
{
  const res = calculateBusinessLoan({
    knownRate: 'nominal',
    interestRate: 5,
    compoundFrequency: 'monthly',
    loanAmount: 100000,
    termYears: 10,
    termMonths: 0,
    paymentFrequency: 'monthly',
    prepaidFee: 500,
    loanedFee: 1000,
    originationFee: 8,
    originationFeeRepayment: 'rolling',
    currency: 'PKR',
  });

  assert.ok(res !== null);
  // Net loan received is full stated loan
  assert.equal(res.netLoanReceived, 100000);
  // Financed principal = 100k + 1k loaned fee + 8k origination = 109,000
  assert.equal(res.financedPrincipal, 109000);
  // Periodic payment on 109k
  const expectedPmt = 109000 * (0.05 / 12) / (1 - Math.pow(1 + 0.05 / 12, -120));
  assert.equal(Number(res.periodicPayment.toFixed(2)), Number(expectedPmt.toFixed(2)));
}

// Test Case 3: Out of Pocket Origination Fee
{
  const res = calculateBusinessLoan({
    knownRate: 'nominal',
    interestRate: 5,
    compoundFrequency: 'monthly',
    loanAmount: 100000,
    termYears: 10,
    termMonths: 0,
    paymentFrequency: 'monthly',
    prepaidFee: 500,
    loanedFee: 1000,
    originationFee: 8,
    originationFeeRepayment: 'out_of_pocket',
    currency: 'PKR',
  });

  assert.ok(res !== null);
  assert.equal(res.netLoanReceived, 100000);
  assert.equal(res.financedPrincipal, 101000);
  assert.equal(Number(res.periodicPayment.toFixed(2)), 1071.26);
  // Total payment includes out of pocket origination (8k) + prepaid (500)
  assert.equal(Number(res.totalPayment.toFixed(2)), Number((1071.261803 * 120 + 8500).toFixed(2)));
}

// Test Case 4: Zero Interest Loan
{
  const res = calculateBusinessLoan({
    knownRate: 'nominal',
    interestRate: 0,
    compoundFrequency: 'monthly',
    loanAmount: 12000,
    termYears: 1,
    termMonths: 0,
    paymentFrequency: 'monthly',
    prepaidFee: 0,
    loanedFee: 0,
    originationFee: 0,
    originationFeeRepayment: 'from_loan',
    currency: 'USD',
  });

  assert.ok(res !== null);
  assert.equal(res.periodicPayment, 1000);
  assert.equal(res.totalInterest, 0);
  assert.equal(res.apr, 0);
  assert.equal(res.effectiveApr, 0);
}

// Test Case 5: Validation
{
  const valid = validateBusinessLoanInput({
    knownRate: 'nominal',
    interestRate: '5',
    compoundFrequency: 'monthly',
    loanAmount: '100,000',
    termYears: '10',
    termMonths: '0',
    paymentFrequency: 'monthly',
    prepaidFee: '500',
    loanedFee: '1,000',
    originationFee: '8',
    originationFeeRepayment: 'from_loan',
    currency: 'PKR',
  });
  assert.equal(valid.isValid, true);
  assert.equal(valid.parsedValues?.loanAmount, 100000);
  assert.equal(valid.parsedValues?.loanedFee, 1000);
}

console.log('Business loan calculation tests passed successfully.');
