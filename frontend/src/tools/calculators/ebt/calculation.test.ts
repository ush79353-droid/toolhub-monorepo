import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateEbt,
  calculateEbtMargin,
  calculateGrossProfit,
  calculateOperatingExpenses,
} from './calculation';
import { createDefaultInput } from './types';
import { validateEbtInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-9) {
  assert.ok(actual !== null, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateGrossProfit', () => {
  it('computes gross profit', () => {
    nearly(calculateGrossProfit(1_000_000, 300_000), 700_000);
  });

  it('allows negative gross profit', () => {
    nearly(calculateGrossProfit(100, 150), -50);
  });
});

describe('calculateOperatingExpenses', () => {
  it('sums SG&A and D&A', () => {
    nearly(calculateOperatingExpenses(150_000, 50_000), 200_000);
  });
});

describe('calculateEbt', () => {
  it('computes standard EBT', () => {
    nearly(calculateEbt(700_000, 200_000, 20_000, 10_000), 490_000);
  });

  it('handles negative other income', () => {
    nearly(calculateEbt(300_000, 100_000, 30_000, -20_000), 150_000);
  });

  it('handles zero EBT', () => {
    nearly(calculateEbt(200_000, 150_000, 50_000, 0), 0);
  });

  it('handles negative EBT', () => {
    nearly(calculateEbt(100_000, 150_000, 20_000, 0), -70_000);
  });

  it('handles zero revenue path', () => {
    nearly(calculateEbt(0, 60_000, 5_000, 0), -65_000);
  });
});

describe('calculateEbtMargin', () => {
  it('computes margin', () => {
    nearly(calculateEbtMargin(200_000, 1_000_000), 20);
  });

  it('computes negative margin', () => {
    nearly(calculateEbtMargin(-50_000, 500_000), -10);
  });

  it('is unavailable at zero revenue', () => {
    assert.equal(calculateEbtMargin(-65_000, 0), null);
  });
});

describe('validateEbtInput', () => {
  it('validates the worked example', () => {
    const { isValid, result } = validateEbtInput({
      ...createDefaultInput(),
      revenue: '1000000',
      costOfGoodsSold: '300000',
      sellingGeneralAdministrative: '150000',
      depreciationAmortization: '50000',
      interestExpenses: '20000',
      otherIncome: '10000',
    });
    assert.equal(isValid, true);
    nearly(result!.grossProfit, 700_000);
    nearly(result!.operatingExpenses, 200_000);
    nearly(result!.earningsBeforeTax, 490_000);
    nearly(result!.ebtMargin!, 49);
  });

  it('rejects negative revenue', () => {
    const { isValid, errors } = validateEbtInput({
      ...createDefaultInput(),
      revenue: '-100',
      costOfGoodsSold: '0',
      sellingGeneralAdministrative: '0',
      depreciationAmortization: '0',
      interestExpenses: '0',
      otherIncome: '0',
    });
    assert.equal(isValid, false);
    assert.ok(errors.revenue);
  });

  it('allows negative other income', () => {
    const { isValid, result } = validateEbtInput({
      ...createDefaultInput(),
      revenue: '400000',
      costOfGoodsSold: '100000',
      sellingGeneralAdministrative: '100000',
      depreciationAmortization: '0',
      interestExpenses: '30000',
      otherIncome: '-20000',
    });
    assert.equal(isValid, true);
    nearly(result!.earningsBeforeTax, 150_000);
  });

  it('returns incomplete when blank', () => {
    const { isValid, result } = validateEbtInput(createDefaultInput());
    assert.equal(isValid, false);
    assert.equal(result, null);
  });
});
