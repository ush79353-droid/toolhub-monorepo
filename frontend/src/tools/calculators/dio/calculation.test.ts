import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAverageInventory,
  calculateDaysInventoryOutstanding,
  calculateInventoryTurnover,
  formatDays,
} from './calculation';
import { createDefaultInput } from './types';
import { validateDioInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-9) {
  assert.ok(actual !== null, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateAverageInventory', () => {
  it('averages starting and ending inventory', () => {
    nearly(calculateAverageInventory(500_000, 750_000), 625_000);
  });

  it('allows zero balances', () => {
    nearly(calculateAverageInventory(0, 0), 0);
  });

  it('rejects negatives', () => {
    assert.equal(calculateAverageInventory(-1, 100), null);
  });
});

describe('calculateDaysInventoryOutstanding', () => {
  it('computes standard annual DIO', () => {
    nearly(
      calculateDaysInventoryOutstanding(625_000, 6_000_000, 365),
      38.0208333333,
      1e-6
    );
  });

  it('computes quarterly DIO', () => {
    nearly(calculateDaysInventoryOutstanding(100_000, 400_000, 90), 22.5);
  });

  it('returns 0 when average inventory is 0 and COGS positive', () => {
    nearly(calculateDaysInventoryOutstanding(0, 500_000, 365), 0);
  });

  it('returns null when COGS is 0', () => {
    assert.equal(calculateDaysInventoryOutstanding(100_000, 0, 365), null);
  });

  it('returns null when period is 0', () => {
    assert.equal(calculateDaysInventoryOutstanding(100_000, 500_000, 0), null);
  });
});

describe('calculateInventoryTurnover', () => {
  it('computes turnover', () => {
    nearly(calculateInventoryTurnover(6_000_000, 625_000), 9.6);
  });

  it('is unavailable when average inventory is 0', () => {
    assert.equal(calculateInventoryTurnover(500_000, 0), null);
  });

  it('relates to DIO via T / turnover', () => {
    const turnover = calculateInventoryTurnover(6_000_000, 625_000)!;
    nearly(365 / turnover, 38.0208333333, 1e-6);
  });
});

describe('validateDioInput', () => {
  it('validates the worked example', () => {
    const input = {
      ...createDefaultInput(),
      startingInventory: '500000',
      endingInventory: '750000',
      costOfGoodsSold: '6000000',
      accountingPeriodDays: '365',
    };
    const { isValid, result } = validateDioInput(input);
    assert.equal(isValid, true);
    assert.ok(result);
    nearly(result!.averageInventory, 625_000);
    nearly(result!.daysInventoryOutstanding, 38.0208333333, 1e-6);
    nearly(result!.inventoryTurnover!, 9.6);
    assert.equal(result!.formattedDaysInventoryOutstanding, formatDays(38.0208333333));
  });

  it('uses manual average without start/end', () => {
    const input = {
      ...createDefaultInput(),
      averageInventoryMode: 'manual' as const,
      manualAverageInventory: '100000',
      costOfGoodsSold: '400000',
      accountingPeriodDays: '90',
    };
    const { isValid, result } = validateDioInput(input);
    assert.equal(isValid, true);
    nearly(result!.averageInventory, 100_000);
    nearly(result!.daysInventoryOutstanding, 22.5);
  });

  it('rejects negative starting inventory', () => {
    const { isValid, errors, result } = validateDioInput({
      ...createDefaultInput(),
      startingInventory: '-1',
      endingInventory: '100',
      costOfGoodsSold: '1000',
    });
    assert.equal(isValid, false);
    assert.ok(errors.startingInventory);
    assert.equal(result, null);
  });

  it('rejects negative COGS', () => {
    const { isValid, errors } = validateDioInput({
      ...createDefaultInput(),
      startingInventory: '100',
      endingInventory: '100',
      costOfGoodsSold: '-5',
    });
    assert.equal(isValid, false);
    assert.ok(errors.costOfGoodsSold);
  });

  it('rejects zero period', () => {
    const { isValid, errors } = validateDioInput({
      ...createDefaultInput(),
      startingInventory: '100',
      endingInventory: '100',
      costOfGoodsSold: '1000',
      accountingPeriodDays: '0',
    });
    assert.equal(isValid, false);
    assert.ok(errors.accountingPeriodDays);
  });

  it('marks zero COGS as unavailable', () => {
    const { isValid, errors, result } = validateDioInput({
      ...createDefaultInput(),
      startingInventory: '100',
      endingInventory: '100',
      costOfGoodsSold: '0',
      accountingPeriodDays: '365',
    });
    assert.equal(isValid, false);
    assert.ok(errors.costOfGoodsSold);
    assert.equal(result, null);
  });

  it('returns incomplete when fields are blank', () => {
    const { isValid, result } = validateDioInput(createDefaultInput());
    assert.equal(isValid, false);
    assert.equal(result, null);
  });
});
