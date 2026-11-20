import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  allocateLifoInventory,
  calculateGrossProfit,
  calculateGrossProfitMargin,
  calculateRevenue,
} from './calculation';
import { createDefaultInput } from './types';
import { validateLifoInventoryInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-6) {
  assert.ok(actual !== null, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('allocateLifoInventory', () => {
  it('Company Alpha: sell 18 → COGS 255, ending 70', () => {
    const a = allocateLifoInventory(10, 10, 15, 15, 18)!;
    nearly(a.cogs, 255);
    nearly(a.endingInventory, 70);
    assert.equal(a.sold2, 15);
    assert.equal(a.sold1, 3);
    nearly(a.cogs + a.endingInventory, 325);
  });

  it('sell 5 newest only → COGS 75', () => {
    const a = allocateLifoInventory(10, 10, 15, 15, 5)!;
    nearly(a.cogs, 75);
    nearly(a.endingInventory, 250);
  });

  it('sell exactly second batch → COGS 225', () => {
    const a = allocateLifoInventory(10, 10, 15, 15, 15)!;
    nearly(a.cogs, 225);
    nearly(a.endingInventory, 100);
  });

  it('sell all → ending 0', () => {
    const a = allocateLifoInventory(10, 10, 15, 15, 25)!;
    nearly(a.cogs, 325);
    nearly(a.endingInventory, 0);
  });

  it('sell zero → COGS 0', () => {
    const a = allocateLifoInventory(10, 10, 15, 15, 0)!;
    nearly(a.cogs, 0);
    nearly(a.endingInventory, 325);
  });

  it('falling costs: sell 10 from newer $10 layer', () => {
    const a = allocateLifoInventory(10, 20, 10, 10, 10)!;
    nearly(a.cogs, 100);
    nearly(a.endingInventory, 200);
  });

  it('insufficient inventory → null', () => {
    assert.equal(allocateLifoInventory(10, 10, 15, 15, 30), null);
  });
});

describe('revenue and margin', () => {
  it('revenue and margin for Alpha', () => {
    nearly(calculateRevenue(18, 20), 360);
    nearly(calculateGrossProfit(360, 255), 105);
    nearly(calculateGrossProfitMargin(105, 360)!, (105 / 360) * 100);
  });

  it('zero revenue → margin null', () => {
    assert.equal(calculateGrossProfitMargin(0, 0), null);
  });
});

describe('validateLifoInventoryInput', () => {
  it('validates Company Alpha', () => {
    const { isValid, result } = validateLifoInventoryInput({
      ...createDefaultInput(),
      batch1Price: '10',
      batch1Qty: '10',
      batch2Price: '15',
      batch2Qty: '15',
      unitsSold: '18',
      sellingPrice: '20',
    });
    assert.equal(isValid, true);
    nearly(result!.lifoCogs, 255);
    nearly(result!.endingInventoryValue, 70);
    nearly(result!.revenue, 360);
    nearly(result!.grossProfit, 105);
  });

  it('rejects insufficient inventory', () => {
    const { isValid, errors } = validateLifoInventoryInput({
      ...createDefaultInput(),
      batch1Price: '10',
      batch1Qty: '10',
      batch2Price: '15',
      batch2Qty: '15',
      unitsSold: '30',
      sellingPrice: '20',
    });
    assert.equal(isValid, false);
    assert.ok(errors.unitsSold);
  });

  it('rejects fractional quantities', () => {
    const { isValid, errors } = validateLifoInventoryInput({
      ...createDefaultInput(),
      batch1Price: '10',
      batch1Qty: '10.5',
      batch2Price: '15',
      batch2Qty: '15',
      unitsSold: '5',
      sellingPrice: '20',
    });
    assert.equal(isValid, false);
    assert.ok(errors.batch1Qty);
  });

  it('FAQ: 10@10 + 10@15 sell 12 → COGS 170', () => {
    const { result } = validateLifoInventoryInput({
      ...createDefaultInput(),
      batch1Price: '10',
      batch1Qty: '10',
      batch2Price: '15',
      batch2Qty: '10',
      unitsSold: '12',
      sellingPrice: '20',
    });
    nearly(result!.lifoCogs, 170);
    nearly(result!.endingInventoryValue, 80);
  });

  it('returns incomplete when blank', () => {
    const { isValid, result } = validateLifoInventoryInput(createDefaultInput());
    assert.equal(isValid, false);
    assert.equal(result, null);
  });
});
