import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAccountsReceivableTurnover,
  calculateAverageAccountsReceivable,
  calculateDaysSalesOutstanding,
  formatDays,
} from './calculation';
import { createDefaultInput } from './types';
import { validateDsoInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-9) {
  assert.ok(actual !== null, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateAverageAccountsReceivable', () => {
  it('averages beginning and ending AR', () => {
    nearly(calculateAverageAccountsReceivable(20_000, 35_000), 27_500);
  });

  it('rejects negatives', () => {
    assert.equal(calculateAverageAccountsReceivable(-1, 100), null);
  });
});

describe('calculateDaysSalesOutstanding', () => {
  it('computes standard annual DSO', () => {
    nearly(calculateDaysSalesOutstanding(27_500, 500_000, 365), 20.075, 1e-9);
  });

  it('computes quarterly DSO', () => {
    nearly(calculateDaysSalesOutstanding(50_000, 250_000, 90), 18);
  });

  it('returns 0 when average AR is 0 and sales positive', () => {
    nearly(calculateDaysSalesOutstanding(0, 100_000, 365), 0);
  });

  it('returns null when sales are 0', () => {
    assert.equal(calculateDaysSalesOutstanding(10_000, 0, 365), null);
  });
});

describe('calculateAccountsReceivableTurnover', () => {
  it('computes turnover', () => {
    nearly(calculateAccountsReceivableTurnover(500_000, 25_000), 20);
  });

  it('is unavailable when average AR is 0', () => {
    assert.equal(calculateAccountsReceivableTurnover(100_000, 0), null);
  });
});

describe('validateDsoInput', () => {
  it('validates the worked example', () => {
    const input = {
      ...createDefaultInput(),
      beginningAccountsReceivable: '20000',
      endingAccountsReceivable: '35000',
      sales: '500000',
      accountingPeriodDays: '365',
    };
    const { isValid, result } = validateDsoInput(input);
    assert.equal(isValid, true);
    assert.ok(result);
    nearly(result!.averageAccountsReceivable, 27_500);
    nearly(result!.daysSalesOutstanding, 20.075);
    assert.equal(result!.formattedDaysSalesOutstanding, formatDays(20.075));
  });

  it('uses manual average without beg/end', () => {
    const input = {
      ...createDefaultInput(),
      averageReceivablesMode: 'manual' as const,
      manualAverageReceivables: '50000',
      sales: '250000',
      accountingPeriodDays: '90',
    };
    const { isValid, result } = validateDsoInput(input);
    assert.equal(isValid, true);
    nearly(result!.daysSalesOutstanding, 18);
  });

  it('supports net credit sales basis', () => {
    const input = {
      ...createDefaultInput(),
      averageReceivablesMode: 'manual' as const,
      manualAverageReceivables: '27500',
      salesBasis: 'netCreditSales' as const,
      sales: '500000',
      accountingPeriodDays: '365',
    };
    const { isValid, result } = validateDsoInput(input);
    assert.equal(isValid, true);
    assert.equal(result!.salesBasis, 'netCreditSales');
    nearly(result!.daysSalesOutstanding, 20.075);
  });

  it('rejects zero sales', () => {
    const { isValid, errors, result } = validateDsoInput({
      ...createDefaultInput(),
      beginningAccountsReceivable: '100',
      endingAccountsReceivable: '100',
      sales: '0',
    });
    assert.equal(isValid, false);
    assert.ok(errors.sales);
    assert.equal(result, null);
  });

  it('rejects negative beginning AR', () => {
    const { isValid, errors } = validateDsoInput({
      ...createDefaultInput(),
      beginningAccountsReceivable: '-100',
      endingAccountsReceivable: '100',
      sales: '1000',
    });
    assert.equal(isValid, false);
    assert.ok(errors.beginningAccountsReceivable);
  });

  it('rejects zero period', () => {
    const { isValid, errors } = validateDsoInput({
      ...createDefaultInput(),
      beginningAccountsReceivable: '100',
      endingAccountsReceivable: '100',
      sales: '1000',
      accountingPeriodDays: '0',
    });
    assert.equal(isValid, false);
    assert.ok(errors.accountingPeriodDays);
  });

  it('returns incomplete when fields are blank', () => {
    const { isValid, result } = validateDsoInput(createDefaultInput());
    assert.equal(isValid, false);
    assert.equal(result, null);
  });
});
