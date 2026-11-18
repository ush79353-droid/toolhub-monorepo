import assert from 'node:assert/strict';
import {
  calculateCommission,
  formatCommissionPercent,
  formatCommissionUsd,
  solveCommission,
  solveCommissionRate,
  solveSalesPrice,
} from './calculation';
import { createDefaultInput } from './types';
import { validateCommissionInput } from './validation';

// Screenshot default: $200,000 × 3% → $6,000
{
  const commission = solveCommission(200_000, 3);
  assert.equal(commission, 6_000);
  assert.equal(formatCommissionUsd(commission!), '6,000.00');
}

{
  const rate = solveCommissionRate(200_000, 6_000);
  assert.equal(rate, 3);
  assert.equal(formatCommissionPercent(rate!), '3');
}

{
  const sales = solveSalesPrice(6_000, 3);
  assert.equal(sales, 200_000);
  assert.equal(formatCommissionUsd(sales!), '200,000.00');
}

// Zero is a valid entered value for commission from zero sales
{
  assert.equal(solveCommission(0, 5), 0);
  assert.equal(solveCommission(100, 0), 0);
}

// Zero denominators rejected
{
  assert.equal(solveCommissionRate(0, 100), null);
  assert.equal(solveSalesPrice(100, 0), null);
}

// Negatives rejected
{
  assert.equal(solveCommission(-1, 3), null);
  assert.equal(solveCommissionRate(100, -1), null);
  assert.equal(solveSalesPrice(-1, 3), null);
}

// Full calculate path
{
  const result = calculateCommission({
    solveFor: 'commission',
    salesPrice: 200_000,
    commissionRate: 3,
    commission: null,
  });
  assert.ok(result);
  assert.equal(result!.formattedCommission, '6,000.00');
  assert.match(result!.summaryText, /the commission is: \$6,000\.00/);
}

{
  const result = calculateCommission({
    solveFor: 'commissionRate',
    salesPrice: 50_000,
    commissionRate: null,
    commission: 1_250,
  });
  assert.ok(result);
  assert.equal(result!.commissionRate, 2.5);
  assert.equal(result!.formattedCommissionRate, '2.5');
}

{
  const result = calculateCommission({
    solveFor: 'salesPrice',
    salesPrice: null,
    commissionRate: 4,
    commission: 800,
  });
  assert.ok(result);
  assert.equal(result!.salesPrice, 20_000);
}

// Default input validates and solves commission
{
  const validation = validateCommissionInput(createDefaultInput());
  assert.equal(validation.isValid, true);
  assert.equal(validation.solveFor, 'commission');
  assert.equal(validation.result?.formattedCommission, '6,000.00');
}

// Zero entered for rate is filled, not blank — solves commission = 0
{
  const validation = validateCommissionInput({
    salesPrice: '1000',
    commissionRate: '0',
    commission: '',
  });
  assert.equal(validation.isValid, true);
  assert.equal(validation.solveFor, 'commission');
  assert.equal(validation.result?.commission, 0);
}

// Ambiguous: all filled
{
  const validation = validateCommissionInput({
    salesPrice: '100',
    commissionRate: '5',
    commission: '5',
  });
  assert.equal(validation.isValid, false);
  assert.ok(validation.errors.form);
}

// Ambiguous: two blanks
{
  const validation = validateCommissionInput({
    salesPrice: '100',
    commissionRate: '',
    commission: '',
  });
  assert.equal(validation.isValid, false);
  assert.ok(validation.errors.form);
}

// Zero sales when solving rate
{
  const validation = validateCommissionInput({
    salesPrice: '0',
    commissionRate: '',
    commission: '10',
  });
  assert.equal(validation.isValid, false);
  assert.ok(validation.errors.salesPrice);
}

// Zero rate when solving sales
{
  const validation = validateCommissionInput({
    salesPrice: '',
    commissionRate: '0',
    commission: '10',
  });
  assert.equal(validation.isValid, false);
  assert.ok(validation.errors.commissionRate);
}

console.log('commission calculation.test.ts: ok');
