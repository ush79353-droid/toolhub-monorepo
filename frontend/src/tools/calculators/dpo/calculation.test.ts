import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAverageAccountsPayable,
  calculateDaysPayableOutstanding,
  calculatePayablesTurnover,
  calculatePurchases,
  formatDays,
} from './calculation';
import { createDefaultInput } from './types';
import { validateDpoInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-9) {
  assert.ok(actual !== null, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateAverageAccountsPayable', () => {
  it('averages beginning and ending AP', () => {
    nearly(calculateAverageAccountsPayable(150_000, 200_000), 175_000);
  });

  it('rejects negatives', () => {
    assert.equal(calculateAverageAccountsPayable(-1, 100), null);
  });
});

describe('calculatePurchases', () => {
  it('computes purchases from inventory flow', () => {
    nearly(calculatePurchases(1_500_000, 400_000, 500_000), 1_400_000);
  });

  it('preserves negative estimated purchases', () => {
    nearly(calculatePurchases(100, 100, 500), -300);
  });
});

describe('calculateDaysPayableOutstanding', () => {
  it('computes standard annual DPO', () => {
    nearly(
      calculateDaysPayableOutstanding(175_000, 1_400_000, 365),
      45.625,
      1e-9
    );
  });

  it('computes quarterly DPO', () => {
    nearly(calculateDaysPayableOutstanding(25_000, 100_000, 90), 22.5);
  });

  it('returns 0 when average AP is 0 and purchases positive', () => {
    nearly(calculateDaysPayableOutstanding(0, 1_000, 365), 0);
  });

  it('returns null when purchases are 0', () => {
    assert.equal(calculateDaysPayableOutstanding(100_000, 0, 365), null);
  });

  it('returns null when purchases are negative', () => {
    assert.equal(calculateDaysPayableOutstanding(100_000, -10, 365), null);
  });
});

describe('calculatePayablesTurnover', () => {
  it('computes turnover', () => {
    nearly(calculatePayablesTurnover(1_400_000, 175_000), 8);
  });

  it('is unavailable when average AP is 0', () => {
    assert.equal(calculatePayablesTurnover(1_000, 0), null);
  });
});

describe('validateDpoInput', () => {
  it('validates the worked example', () => {
    const input = {
      ...createDefaultInput(),
      beginningAccountsPayable: '150000',
      endingAccountsPayable: '200000',
      beginningInventory: '500000',
      endingInventory: '400000',
      costOfGoodsSold: '1500000',
      accountingPeriodDays: '365',
    };
    const { isValid, result } = validateDpoInput(input);
    assert.equal(isValid, true);
    assert.ok(result);
    nearly(result!.averageAccountsPayable, 175_000);
    nearly(result!.purchases, 1_400_000);
    nearly(result!.daysPayableOutstanding, 45.625);
    nearly(result!.accountsPayableTurnover!, 8);
    assert.equal(
      result!.formattedDaysPayableOutstanding,
      formatDays(45.625)
    );
  });

  it('uses direct purchases without inventory', () => {
    const input = {
      ...createDefaultInput(),
      beginningAccountsPayable: '100000',
      endingAccountsPayable: '100000',
      purchasesSource: 'manual' as const,
      manualPurchases: '800000',
      accountingPeriodDays: '365',
    };
    const { isValid, result } = validateDpoInput(input);
    assert.equal(isValid, true);
    nearly(result!.daysPayableOutstanding, 45.625);
  });

  it('blocks negative estimated purchases', () => {
    const { isValid, errors, result } = validateDpoInput({
      ...createDefaultInput(),
      beginningAccountsPayable: '100',
      endingAccountsPayable: '100',
      beginningInventory: '500',
      endingInventory: '100',
      costOfGoodsSold: '100',
    });
    assert.equal(isValid, false);
    assert.ok(errors.form);
    assert.equal(result, null);
  });

  it('blocks zero purchases', () => {
    const { isValid, errors, result } = validateDpoInput({
      ...createDefaultInput(),
      averageApSource: 'manual',
      manualAverageAp: '100000',
      purchasesSource: 'manual',
      manualPurchases: '0',
    });
    assert.equal(isValid, false);
    assert.ok(errors.form);
    assert.equal(result, null);
  });

  it('rejects negative beginning AP', () => {
    const { isValid, errors } = validateDpoInput({
      ...createDefaultInput(),
      beginningAccountsPayable: '-100',
      endingAccountsPayable: '100',
      beginningInventory: '1',
      endingInventory: '1',
      costOfGoodsSold: '100',
    });
    assert.equal(isValid, false);
    assert.ok(errors.beginningAccountsPayable);
  });

  it('rejects zero period', () => {
    const { isValid, errors } = validateDpoInput({
      ...createDefaultInput(),
      beginningAccountsPayable: '100',
      endingAccountsPayable: '100',
      beginningInventory: '1',
      endingInventory: '1',
      costOfGoodsSold: '100',
      accountingPeriodDays: '0',
    });
    assert.equal(isValid, false);
    assert.ok(errors.accountingPeriodDays);
  });

  it('returns incomplete when fields are blank', () => {
    const { isValid, result } = validateDpoInput(createDefaultInput());
    assert.equal(isValid, false);
    assert.equal(result, null);
  });
});
