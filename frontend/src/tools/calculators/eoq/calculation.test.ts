import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAnnualHoldingCost,
  calculateAnnualOrderingCost,
  calculateAverageCycleInventory,
  calculateDaysBetweenOrders,
  calculateEoq,
  calculateOptimalIntegerEoq,
  calculateOrdersPerYear,
  calculateTotalVariableInventoryCost,
} from './calculation';
import { createDefaultInput } from './types';
import { validateEoqInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-4) {
  assert.ok(actual !== null, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateEoq', () => {
  it('computes standard EOQ 500', () => {
    nearly(calculateEoq(50_000, 10, 4), 500);
  });

  it('computes reference EOQ ~1581.14', () => {
    nearly(calculateEoq(500_000, 10, 4), Math.sqrt(2_500_000));
  });

  it('computes second example ~707.11', () => {
    nearly(calculateEoq(10_000, 50, 2), Math.sqrt(500_000));
  });

  it('higher ordering cost increases EOQ', () => {
    nearly(calculateEoq(20_000, 100, 5), Math.sqrt(800_000));
  });

  it('higher holding cost decreases EOQ', () => {
    nearly(calculateEoq(20_000, 25, 10), Math.sqrt(100_000));
  });

  it('rejects zero holding cost', () => {
    assert.equal(calculateEoq(50_000, 10, 0), null);
  });

  it('rejects zero demand', () => {
    assert.equal(calculateEoq(0, 10, 4), null);
  });
});

describe('cost and frequency helpers', () => {
  it('annual ordering cost', () => {
    nearly(calculateAnnualOrderingCost(50_000, 500, 10), 1000);
  });

  it('annual holding cost', () => {
    nearly(calculateAnnualHoldingCost(500, 4), 1000);
  });

  it('total variable cost', () => {
    nearly(calculateTotalVariableInventoryCost(50_000, 500, 10, 4), 2000);
  });

  it('orders per year', () => {
    nearly(calculateOrdersPerYear(50_000, 500), 100);
  });

  it('days between orders', () => {
    nearly(calculateDaysBetweenOrders(500, 50_000, 365), 3.65);
  });

  it('average cycle inventory', () => {
    nearly(calculateAverageCycleInventory(500), 250);
  });
});

describe('calculateOptimalIntegerEoq', () => {
  it('returns 500 for exact EOQ', () => {
    assert.equal(calculateOptimalIntegerEoq(50_000, 10, 4, 500), 500);
  });
});

describe('validateEoqInput', () => {
  it('validates standard inputs', () => {
    const { isValid, result } = validateEoqInput({
      ...createDefaultInput(),
      yearlyDemand: '50000',
      orderCost: '10',
      annualHoldingCostPerUnit: '4',
    });
    assert.equal(isValid, true);
    nearly(result!.economicOrderQuantity, 500);
    nearly(result!.totalAnnualVariableCost, 2000);
  });

  it('rejects negative demand', () => {
    const { isValid, errors } = validateEoqInput({
      ...createDefaultInput(),
      yearlyDemand: '-100',
      orderCost: '10',
      annualHoldingCostPerUnit: '4',
    });
    assert.equal(isValid, false);
    assert.ok(errors.yearlyDemand);
  });

  it('rejects zero holding cost', () => {
    const { isValid, errors } = validateEoqInput({
      ...createDefaultInput(),
      yearlyDemand: '50000',
      orderCost: '10',
      annualHoldingCostPerUnit: '0',
    });
    assert.equal(isValid, false);
    assert.ok(errors.annualHoldingCostPerUnit);
  });

  it('returns incomplete when blank', () => {
    const { isValid, result } = validateEoqInput(createDefaultInput());
    assert.equal(isValid, false);
    assert.equal(result, null);
  });
});
