import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateEquityRatio,
  calculateFinancialLeverage,
  calculateLiabilitiesToEquity,
  calculateTotalAssets,
  calculateTotalLiabilities,
} from './calculation';
import { createDefaultInput } from './types';
import { validateFinancialLeverageRatioInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-9) {
  assert.ok(actual !== null, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateTotalAssets', () => {
  it('sums current and non-current', () => {
    nearly(calculateTotalAssets(300_000, 1_000_000), 1_300_000);
  });
});

describe('calculateFinancialLeverage', () => {
  it('computes 2.60×', () => {
    nearly(calculateFinancialLeverage(1_300_000, 500_000), 2.6);
  });

  it('computes 1.00× when no liabilities', () => {
    nearly(calculateFinancialLeverage(500_000, 500_000), 1);
  });

  it('computes high leverage', () => {
    nearly(calculateFinancialLeverage(1_000_000, 100_000), 10);
  });

  it('is undefined at zero equity', () => {
    assert.equal(calculateFinancialLeverage(1_000_000, 0), null);
  });

  it('allows negative equity', () => {
    nearly(calculateFinancialLeverage(1_000_000, -200_000), -5);
  });
});

describe('derived metrics', () => {
  it('total liabilities', () => {
    nearly(calculateTotalLiabilities(1_300_000, 500_000), 800_000);
  });

  it('equity ratio percent', () => {
    nearly(calculateEquityRatio(400_000, 1_000_000), 40);
  });

  it('liabilities to equity', () => {
    nearly(calculateLiabilitiesToEquity(600_000, 400_000), 1.5);
  });
});

describe('validateFinancialLeverageRatioInput', () => {
  it('validates Company Alpha', () => {
    const { isValid, result } = validateFinancialLeverageRatioInput({
      ...createDefaultInput(),
      currentAssets: '300000',
      nonCurrentAssets: '1000000',
      totalEquity: '500000',
    });
    assert.equal(isValid, true);
    nearly(result!.totalAssets, 1_300_000);
    nearly(result!.financialLeverage!, 2.6);
  });

  it('flags zero equity', () => {
    const { isValid, result, errors } = validateFinancialLeverageRatioInput({
      ...createDefaultInput(),
      currentAssets: '1000000',
      nonCurrentAssets: '0',
      totalEquity: '0',
    });
    assert.equal(isValid, false);
    assert.equal(result!.status, 'zeroEquity');
    assert.ok(errors.form);
  });

  it('flags negative equity', () => {
    const { result } = validateFinancialLeverageRatioInput({
      ...createDefaultInput(),
      currentAssets: '1000000',
      nonCurrentAssets: '0',
      totalEquity: '-200000',
    });
    assert.equal(result!.status, 'negativeEquity');
    nearly(result!.financialLeverage!, -5);
  });

  it('rejects negative current assets', () => {
    const { isValid, errors } = validateFinancialLeverageRatioInput({
      ...createDefaultInput(),
      currentAssets: '-100',
      nonCurrentAssets: '0',
      totalEquity: '100',
    });
    assert.equal(isValid, false);
    assert.ok(errors.currentAssets);
  });

  it('returns incomplete when blank', () => {
    const { isValid, result } = validateFinancialLeverageRatioInput(
      createDefaultInput()
    );
    assert.equal(isValid, false);
    assert.equal(result, null);
  });
});
