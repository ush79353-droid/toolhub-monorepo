import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAverageInventory,
  calculateInventoryDays,
  calculateInventoryTurnover,
} from './calculation';
import { createDefaultInput } from './types';
import { validateInventoryTurnoverInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-9) {
  assert.ok(actual !== null, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateAverageInventory', () => {
  it('averages beginning and ending', () => {
    nearly(calculateAverageInventory(100_000, 140_000), 120_000);
  });
});

describe('calculateInventoryTurnover', () => {
  it('computes 5.00×', () => {
    nearly(calculateInventoryTurnover(600_000, 120_000), 5);
  });

  it('high turnover 10×', () => {
    nearly(calculateInventoryTurnover(1_000_000, 100_000), 10);
  });

  it('zero COGS → 0', () => {
    nearly(calculateInventoryTurnover(0, 100_000), 0);
  });

  it('zero average → undefined', () => {
    assert.equal(calculateInventoryTurnover(100_000, 0), null);
  });
});

describe('calculateInventoryDays', () => {
  it('computes 73 days', () => {
    nearly(calculateInventoryDays(600_000, 120_000, 365), 73);
  });

  it('quarterly 36 days', () => {
    nearly(calculateInventoryDays(150_000, 60_000, 90), 36);
  });

  it('zero average with positive COGS → 0 days', () => {
    nearly(calculateInventoryDays(100_000, 0, 365), 0);
  });

  it('zero COGS → unavailable', () => {
    assert.equal(calculateInventoryDays(0, 100_000, 365), null);
  });
});

describe('validateInventoryTurnoverInput', () => {
  it('validates Company Alpha', () => {
    const { isValid, result } = validateInventoryTurnoverInput({
      ...createDefaultInput(),
      costOfGoodsSold: '600000',
      beginningInventory: '100000',
      endingInventory: '140000',
      days: '365',
    });
    assert.equal(isValid, true);
    nearly(result!.averageInventory, 120_000);
    nearly(result!.inventoryTurnover!, 5);
    nearly(result!.inventoryDays!, 73);
  });

  it('flags both zero', () => {
    const { isValid, result } = validateInventoryTurnoverInput({
      ...createDefaultInput(),
      costOfGoodsSold: '0',
      beginningInventory: '0',
      endingInventory: '0',
      days: '365',
    });
    assert.equal(isValid, false);
    assert.equal(result!.status, 'undefinedTurnover');
  });

  it('rejects zero days', () => {
    const { isValid, errors } = validateInventoryTurnoverInput({
      ...createDefaultInput(),
      costOfGoodsSold: '100',
      beginningInventory: '50',
      endingInventory: '50',
      days: '0',
    });
    assert.equal(isValid, false);
    assert.ok(errors.days);
  });

  it('rejects negative COGS', () => {
    const { isValid, errors } = validateInventoryTurnoverInput({
      ...createDefaultInput(),
      costOfGoodsSold: '-100',
      beginningInventory: '50',
      endingInventory: '50',
      days: '365',
    });
    assert.equal(isValid, false);
    assert.ok(errors.costOfGoodsSold);
  });

  it('returns incomplete when blank', () => {
    const { isValid, result } = validateInventoryTurnoverInput({
      ...createDefaultInput(),
      days: '',
    });
    assert.equal(isValid, false);
    assert.equal(result, null);
  });
});
