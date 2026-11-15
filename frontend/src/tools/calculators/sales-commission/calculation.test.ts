import assert from 'node:assert/strict';
import {
  calculateSalesCommission,
  thresholdFromMarginAndBasePay,
} from './calculation';
import { createDefaultSalesCommissionInput, type SalesCommissionInput } from './types';
import { validateSalesCommission } from './validation';

function base(patch: Partial<SalesCommissionInput> = {}): SalesCommissionInput {
  return { ...createDefaultSalesCommissionInput(), ...patch };
}

{
  // Default path: gross margin and base pay target.
  // H = (750 × 0.5) / (0.1 × 0.6) = 6,250; base = 3,750; commission = 375.
  const h = thresholdFromMarginAndBasePay(10_000, 6_000, 750, 10, 50);
  assert.ok(h !== null);
  assert.equal(Math.round(h! * 100) / 100, 6250);
  const result = calculateSalesCommission(base());
  assert.equal(result.defined, true);
  assert.equal(result.grossProfit, 6000);
  assert.equal(result.discount, 0);
  assert.equal(result.salesThreshold, 6250);
  assert.equal(result.commissionBaseAmount, 3750);
  assert.equal(result.commission, 375);
  assert.equal(result.totalLaborCost, 1125);
  assert.equal(result.operationalCost, 1325);
  assert.equal(result.operationalProfit, 4675);
  assert.equal(result.grossSalesMargin, 5800);
  assert.equal(result.grossMarginRatePercent, 60);
}

{
  // Omni/Dash documented example with base salary 780 → threshold 6,500.
  const result = calculateSalesCommission(base({ baseSalary: 780 }));
  assert.equal(result.salesThreshold, 6500);
  assert.equal(result.commissionBaseAmount, 3500);
  assert.equal(result.commission, 350);
  assert.equal(result.totalLaborCost, 1130);
}

{
  const gross = calculateSalesCommission(base({ commissionBase: 'gross-sales' }));
  assert.equal(gross.commission, 1000);
  assert.equal(gross.salesThreshold, null);

  const profit = calculateSalesCommission(base({ commissionBase: 'sales-profit' }));
  // 10000 − 4000 − 200 − 750 − 0 = 5050 → 505
  assert.equal(profit.commission, 505);

  const quota = calculateSalesCommission(
    base({ commissionBase: 'excess-above-threshold', salesQuota: 6000 })
  );
  assert.equal(quota.commission, 400);
  assert.equal(quota.salesThreshold, 6000);
}

{
  assert.equal(validateSalesCommission(base({ revenue: Number.NaN })).isValid, false);
  assert.equal(validateSalesCommission(base({ revenue: -1 })).isValid, false);
  assert.equal(
    validateSalesCommission(
      base({ commissionBase: 'gross-margin-and-base-pay-target', basePayTargetPercent: 0 })
    ).isValid,
    false
  );
  assert.equal(validateSalesCommission(base()).isValid, true);
}

console.log('sales-commission calculation.test.ts: ok');
