import assert from 'node:assert/strict';
import {
  calculateCreditCardPayoff,
  formatPayoffMoney,
} from './calculation';
import { validateCreditCardPayoffInput } from './validation';
import { createDefaultInput } from './types';

// Default sample: 2,000 / 18% / 100 → 1y 11m 29d · total ≈ 2,395.65
// (23 full months + ~0.957 of final month ≈ 29 days; total matches sibling)
{
  const out = calculateCreditCardPayoff({
    balance: 2000,
    aprPercent: 18,
    monthlyPayment: 100,
    currency: 'PKR',
  });
  assert.ok(out);
  assert.equal(out.neverPaysOff, false);
  assert.equal(out.years, 1);
  assert.equal(out.months, 11);
  assert.equal(out.days, 29);
  assert.ok(Math.abs(out.totalPaid - 2395.65) < 0.02);
}

// 0% APR: exact months
{
  const out = calculateCreditCardPayoff({
    balance: 1200,
    aprPercent: 0,
    monthlyPayment: 100,
    currency: 'PKR',
  });
  assert.ok(out);
  assert.equal(out.years, 1);
  assert.equal(out.months, 0);
  assert.equal(out.days, 0);
  assert.equal(out.totalPaid, 1200);
}

// 0% APR with fractional month → days
{
  const out = calculateCreditCardPayoff({
    balance: 150,
    aprPercent: 0,
    monthlyPayment: 100,
    currency: 'PKR',
  });
  assert.ok(out);
  assert.equal(out.years, 0);
  assert.equal(out.months, 1);
  assert.equal(out.days, 15);
  assert.equal(out.totalPaid, 150);
}

// Payment ≤ interest → never pays off
{
  const out = calculateCreditCardPayoff({
    balance: 2000,
    aprPercent: 18,
    monthlyPayment: 20,
    currency: 'PKR',
  });
  assert.ok(out);
  assert.equal(out.neverPaysOff, true);
  assert.equal(out.totalPaid, 0);
}

// Partial final month produces days
{
  const out = calculateCreditCardPayoff({
    balance: 100,
    aprPercent: 12,
    monthlyPayment: 50,
    currency: 'PKR',
  });
  assert.ok(out);
  assert.equal(out.neverPaysOff, false);
  assert.ok(out.years === 0);
  assert.ok(out.months >= 1 || out.days > 0);
  assert.ok(out.totalPaid > 100);
}

// Rejects invalid inputs
{
  assert.equal(
    calculateCreditCardPayoff({
      balance: 0,
      aprPercent: 18,
      monthlyPayment: 100,
      currency: 'PKR',
    }),
    null
  );
  assert.equal(
    calculateCreditCardPayoff({
      balance: 1000,
      aprPercent: -1,
      monthlyPayment: 100,
      currency: 'PKR',
    }),
    null
  );
  assert.equal(
    calculateCreditCardPayoff({
      balance: 1000,
      aprPercent: 18,
      monthlyPayment: 0,
      currency: 'PKR',
    }),
    null
  );
}

// Display formatting
{
  assert.equal(formatPayoffMoney(2395.65, 'PKR'), '2,395.65');
  assert.equal(formatPayoffMoney(0, 'PKR'), '0.00');
}

// Validation: defaults produce a result (same-currency, no rates needed)
{
  const validated = validateCreditCardPayoffInput(createDefaultInput());
  assert.equal(validated.isValid, true);
  assert.ok(validated.result);
  assert.equal(validated.result.neverPaysOff, false);
  assert.equal(validated.result.years, 1);
  assert.equal(validated.result.months, 11);
  assert.equal(validated.result.days, 29);
}

// Validation: empty fields incomplete
{
  const empty = validateCreditCardPayoffInput({
    ...createDefaultInput(),
    balance: '',
  });
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

// Validation: mixed currency without rates blocks
{
  const mixed = validateCreditCardPayoffInput({
    ...createDefaultInput(),
    monthlyPaymentCurrency: 'USD',
  });
  assert.equal(mixed.isValid, false);
  assert.ok(mixed.errors.form);
}

console.log('credit-card-payoff calculation tests passed');
