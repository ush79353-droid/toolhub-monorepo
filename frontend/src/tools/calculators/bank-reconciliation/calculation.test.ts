import assert from 'node:assert/strict';
import {
  calculateAdjustedBankStatementBalance,
  calculateAdjustedCashbookBalance,
  calculateBankReconciliation,
} from './calculation';
import { validateBankReconciliationInput } from './validation';
import { createDefaultInput, createExampleInput } from './types';

// Test Case 1 — Fully reconciled example
{
  const r = calculateBankReconciliation({
    cashbookBalance: 10_000,
    bankStatementBalance: 8500,
    interestEarned: 100,
    bankCharges: 50,
    nsfChecks: 200,
    automaticPayments: 150,
    depositsInTransit: 2000,
    outstandingChecks: 600,
    cashbookExtras: [
      { description: 'credit', amount: 300, direction: 'add' },
      { description: 'correction', amount: 100, direction: 'subtract' },
    ],
    bankExtras: [
      { description: 'bank credit', amount: 100, direction: 'add' },
      { description: 'bank debit', amount: 100, direction: 'subtract' },
    ],
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.adjustedCashbookBalance, 9900);
  assert.equal(r.adjustedBankStatementBalance, 9900);
  assert.equal(r.unreconciledAmount, 0);
  assert.equal(r.status, 'reconciled');
  assert.equal(r.isReconciled, true);
}

// Test Case 2 — Unreconciled
{
  const r = calculateBankReconciliation({
    cashbookBalance: 10_000,
    bankStatementBalance: 9500,
    interestEarned: 0,
    bankCharges: 0,
    nsfChecks: 0,
    automaticPayments: 0,
    depositsInTransit: 0,
    outstandingChecks: 0,
    cashbookExtras: [],
    bankExtras: [],
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.unreconciledAmount, 500);
  assert.equal(r.status, 'unreconciled');
}

// Test Case 3 — Cashbook additions
{
  const cash = calculateAdjustedCashbookBalance(
    5000,
    { interestEarned: 100, bankCharges: 0, nsfChecks: 0, automaticPayments: 0 },
    [{ description: 'credits', amount: 200, direction: 'add' }],
    'USD',
  );
  assert.ok(cash);
  assert.equal(cash.adjusted, 5300);
}

// Test Case 4 — Cashbook deductions
{
  const cash = calculateAdjustedCashbookBalance(
    5000,
    { interestEarned: 0, bankCharges: 50, nsfChecks: 150, automaticPayments: 200 },
    [],
    'USD',
  );
  assert.ok(cash);
  assert.equal(cash.adjusted, 4600);
}

// Test Case 5 — Bank statement adjustments
{
  const bank = calculateAdjustedBankStatementBalance(
    8000,
    { depositsInTransit: 1000, outstandingChecks: 500 },
    [],
    'USD',
  );
  assert.ok(bank);
  assert.equal(bank.adjusted, 8500);
}

// Test Case 6 — Zero adjustments, equal balances
{
  const r = calculateBankReconciliation({
    cashbookBalance: 5000,
    bankStatementBalance: 5000,
    interestEarned: 0,
    bankCharges: 0,
    nsfChecks: 0,
    automaticPayments: 0,
    depositsInTransit: 0,
    outstandingChecks: 0,
    cashbookExtras: [],
    bankExtras: [],
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.adjustedCashbookBalance, 5000);
  assert.equal(r.adjustedBankStatementBalance, 5000);
  assert.equal(r.status, 'reconciled');
}

// Test Case 7 — Decimal adjustments
{
  const cash = calculateAdjustedCashbookBalance(
    1000.5,
    { interestEarned: 10.25, bankCharges: 5.75, nsfChecks: 0, automaticPayments: 0 },
    [],
    'USD',
  );
  assert.ok(cash);
  assert.equal(cash.adjusted, 1005);
}

// Test Case 8 — Negative starting balance preserved
{
  const cash = calculateAdjustedCashbookBalance(
    -200,
    { interestEarned: 50, bankCharges: 10, nsfChecks: 0, automaticPayments: 0 },
    [],
    'USD',
  );
  assert.ok(cash);
  assert.equal(cash.adjusted, -160);
}

// Validation incomplete / example
{
  const empty = validateBankReconciliationInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.incomplete, true);

  const example = validateBankReconciliationInput(createExampleInput());
  assert.equal(example.isValid, true);
  assert.ok(example.result);
  assert.equal(example.result.adjustedCashbookBalance, 9900);
  assert.equal(example.result.adjustedBankStatementBalance, 9900);
  assert.equal(example.result.status, 'reconciled');
}

console.log('bank-reconciliation/calculation.test.ts: all assertions passed');
