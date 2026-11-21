import assert from 'node:assert/strict';
import {
  calculateAccountingProfit,
  formatAccountingProfitMoney,
} from './calculation';
import { validateAccountingProfitInput } from './validation';
import { createDefaultInput } from './types';

// Screenshot defaults: 100k − (25k+12k+10k+15k) = 38k
{
  const out = calculateAccountingProfit({
    totalRevenue: 100_000,
    operationExpenses: 25_000,
    interest: 12_000,
    depreciation: 10_000,
    taxes: 15_000,
  });
  assert.ok(out);
  assert.equal(out.totalExplicitCosts, 62_000);
  assert.equal(out.accountingProfit, 38_000);
}

// Zero expenses → profit equals revenue
{
  const out = calculateAccountingProfit({
    totalRevenue: 50_000,
    operationExpenses: 0,
    interest: 0,
    depreciation: 0,
    taxes: 0,
  });
  assert.ok(out);
  assert.equal(out.totalExplicitCosts, 0);
  assert.equal(out.accountingProfit, 50_000);
}

// Loss allowed
{
  const out = calculateAccountingProfit({
    totalRevenue: 10_000,
    operationExpenses: 20_000,
    interest: 0,
    depreciation: 0,
    taxes: 0,
  });
  assert.ok(out);
  assert.equal(out.accountingProfit, -10_000);
}

// Reject negatives / non-finite
{
  assert.equal(
    calculateAccountingProfit({
      totalRevenue: -1,
      operationExpenses: 0,
      interest: 0,
      depreciation: 0,
      taxes: 0,
    }),
    null
  );
  assert.equal(
    calculateAccountingProfit({
      totalRevenue: 100,
      operationExpenses: -1,
      interest: 0,
      depreciation: 0,
      taxes: 0,
    }),
    null
  );
  assert.equal(
    calculateAccountingProfit({
      totalRevenue: Number.NaN,
      operationExpenses: 0,
      interest: 0,
      depreciation: 0,
      taxes: 0,
    }),
    null
  );
}

// Display formatting
{
  assert.equal(formatAccountingProfitMoney(38000, 'PKR'), '38,000.00');
  assert.equal(formatAccountingProfitMoney(-10000, 'PKR'), '-10,000.00');
}

// Validation: screenshot defaults
{
  const validated = validateAccountingProfitInput(createDefaultInput());
  assert.equal(validated.isValid, true);
  assert.ok(validated.result);
  assert.equal(validated.result.totalExplicitCostsCanonical, 62_000);
  assert.equal(validated.result.accountingProfitCanonical, 38_000);
  assert.equal(validated.result.formattedAccountingProfit, '38,000.00');
}

console.log('accounting-profit calculation tests passed');
