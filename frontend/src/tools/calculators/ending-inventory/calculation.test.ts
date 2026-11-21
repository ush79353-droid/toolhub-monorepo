import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAverageInventory,
  calculateCogsFromTurnover,
  calculateEndingInventory,
  calculateInventoryTurnover,
} from './calculation';
import { createDefaultInput } from './types';
import { validateEndingInventoryInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-6) {
  assert.ok(actual !== null, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateEndingInventory', () => {
  it('computes standard ending inventory', () => {
    nearly(calculateEndingInventory(25_000, 35_000, 45_000), 15_000);
  });

  it('handles zero ending inventory', () => {
    nearly(calculateEndingInventory(20_000, 30_000, 50_000), 0);
  });

  it('handles inventory growth', () => {
    nearly(calculateEndingInventory(100_000, 80_000, 60_000), 120_000);
  });

  it('returns negative when costs exceed inventory', () => {
    nearly(calculateEndingInventory(10_000, 20_000, 40_000), -10_000);
  });
});

describe('calculateAverageInventory', () => {
  it('averages starting and ending', () => {
    nearly(calculateAverageInventory(25_000, 15_000), 20_000);
  });
});

describe('calculateInventoryTurnover', () => {
  it('computes turnover', () => {
    nearly(calculateInventoryTurnover(45_000, 20_000), 2.25);
  });

  it('is unavailable at zero average', () => {
    assert.equal(calculateInventoryTurnover(0, 0), null);
  });
});

describe('calculateCogsFromTurnover', () => {
  it('derives COGS from turnover', () => {
    nearly(calculateCogsFromTurnover(25_000, 35_000, 2.25), 45_000);
  });

  it('returns zero COGS for zero turnover with inventory', () => {
    nearly(calculateCogsFromTurnover(10_000, 0, 0), 0);
  });

  it('rejects positive turnover when B and P are zero', () => {
    assert.equal(calculateCogsFromTurnover(0, 0, 2), null);
  });
});

describe('validateEndingInventoryInput', () => {
  it('validates COGS-known mode', () => {
    const { isValid, result } = validateEndingInventoryInput({
      ...createDefaultInput(),
      startingInventory: '25000',
      netPurchases: '35000',
      costOfGoodsSold: '45000',
    });
    assert.equal(isValid, true);
    nearly(result!.endingInventory, 15_000);
    nearly(result!.inventoryTurnover!, 2.25);
  });

  it('validates COGS-unknown mode', () => {
    const { isValid, result } = validateEndingInventoryInput({
      ...createDefaultInput(),
      cogsKnown: 'no',
      startingInventory: '25000',
      netPurchases: '35000',
      inventoryTurnover: '2.25',
    });
    assert.equal(isValid, true);
    nearly(result!.costOfGoodsSold, 45_000);
    nearly(result!.endingInventory, 15_000);
  });

  it('flags negative ending inventory', () => {
    const { isValid, result, errors } = validateEndingInventoryInput({
      ...createDefaultInput(),
      startingInventory: '10000',
      netPurchases: '20000',
      costOfGoodsSold: '40000',
    });
    assert.equal(isValid, false);
    assert.equal(result!.status, 'negativeEndingInventory');
    assert.ok(errors.form);
  });

  it('rejects negative starting inventory', () => {
    const { isValid, errors } = validateEndingInventoryInput({
      ...createDefaultInput(),
      startingInventory: '-100',
      netPurchases: '0',
      costOfGoodsSold: '0',
    });
    assert.equal(isValid, false);
    assert.ok(errors.startingInventory);
  });

  it('returns incomplete when blank', () => {
    const { isValid, result } = validateEndingInventoryInput(
      createDefaultInput()
    );
    assert.equal(isValid, false);
    assert.equal(result, null);
  });
});
