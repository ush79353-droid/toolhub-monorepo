import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  AGE_BENCHMARKS,
  ALL_FAMILIES_BENCHMARK,
  INCOME_BENCHMARKS,
  WEALTH_BENCHMARKS,
  getNetWorthBenchmark,
} from './benchmarks';
import {
  calculateNetWorth,
  calculateTotalAssets,
  calculateTotalLiabilities,
  compareNetWorth,
  formatMoneyWithSymbol,
} from './calculation';
import { validateNetWorthInput } from './validation';
import {
  createBlankInput,
  createDefaultInput,
  createExampleInput,
} from './types';

const zeroAssets = {
  primaryHome: 0,
  holidayHome: 0,
  otherRealEstate: 0,
  stocksAndInvestments: 0,
  motorVehicles: 0,
  otherAssets: 0,
  savingsAccounts: 0,
  checkingAccounts: 0,
  otherInvestments: 0,
};

const zeroLiabilities = {
  mortgage: 0,
  carLoan: 0,
  personalLoan: 0,
  studentLoan: 0,
  leasePurchase: 0,
  consumerLoan: 0,
  creditCardDebt: 0,
  otherDebt: 0,
};

describe('net worth totals', () => {
  it('defaults to zero', () => {
    const result = calculateNetWorth({
      assets: zeroAssets,
      liabilities: zeroLiabilities,
      currency: 'USD',
      comparisonType: 'income',
      comparisonGroupId: 'inc-40-59',
    });
    assert.equal(result.totalAssets, 0);
    assert.equal(result.totalLiabilities, 0);
    assert.equal(result.netWorth, 0);
  });

  it('sums assets and liabilities', () => {
    const assets = {
      ...zeroAssets,
      primaryHome: 300_000,
      holidayHome: 50_000,
      stocksAndInvestments: 80_000,
      otherAssets: 10_000,
      savingsAccounts: 30_000,
      checkingAccounts: 10_000,
    };
    const liabilities = {
      ...zeroLiabilities,
      mortgage: 180_000,
      carLoan: 15_000,
      creditCardDebt: 5_000,
    };
    assert.equal(calculateTotalAssets(assets), 480_000);
    assert.equal(calculateTotalLiabilities(liabilities), 200_000);
    const result = calculateNetWorth({
      assets,
      liabilities,
      currency: 'USD',
      comparisonType: 'income',
      comparisonGroupId: 'inc-40-59',
    });
    assert.equal(result.netWorth, 280_000);
  });

  it('supports negative and zero net worth', () => {
    const negative = calculateNetWorth({
      assets: { ...zeroAssets, savingsAccounts: 100_000 },
      liabilities: { ...zeroLiabilities, mortgage: 150_000 },
      currency: 'USD',
      comparisonType: 'age',
      comparisonGroupId: 'age-lt35',
    });
    assert.equal(negative.netWorth, -50_000);

    const zero = calculateNetWorth({
      assets: { ...zeroAssets, savingsAccounts: 50_000 },
      liabilities: { ...zeroLiabilities, mortgage: 50_000 },
      currency: 'USD',
      comparisonType: 'age',
      comparisonGroupId: 'age-lt35',
    });
    assert.equal(zero.netWorth, 0);
  });
});

describe('scf benchmarks', () => {
  it('uses verified SCF 2022 age and income figures', () => {
    const under35 = getNetWorthBenchmark('age', 'age-lt35');
    assert.ok(under35);
    assert.equal(under35!.medianUsd, 39_000);
    assert.equal(under35!.meanUsd, 183_500);

    const midIncome = getNetWorthBenchmark('income', 'inc-40-59');
    assert.ok(midIncome);
    assert.equal(midIncome!.medianUsd, 159_300);
    assert.equal(midIncome!.meanUsd, 385_400);

    assert.equal(ALL_FAMILIES_BENCHMARK.medianUsd, 192_900);
    assert.equal(ALL_FAMILIES_BENCHMARK.meanUsd, 1_063_700);
    assert.ok(INCOME_BENCHMARKS.length >= 6);
    assert.ok(AGE_BENCHMARKS.length >= 6);
    assert.ok(WEALTH_BENCHMARKS.length >= 5);
  });

  it('compares against group mean', () => {
    const comparison = compareNetWorth(280_000, 'income', 'inc-40-59');
    assert.ok(comparison);
    assert.equal(comparison!.meanUsd, 385_400);
    assert.equal(comparison!.differenceFromMean, 280_000 - 385_400);
    assert.ok(comparison!.percentVsMean !== null);
  });
});

describe('formatting and validation', () => {
  it('formats currency', () => {
    assert.ok(formatMoneyWithSymbol(280_000, 'USD').includes('280,000'));
    assert.ok(formatMoneyWithSymbol(-50_000, 'USD').startsWith('-'));
  });

  it('validates defaults, example, blank, and negatives', () => {
    const defaults = validateNetWorthInput(createDefaultInput());
    assert.equal(defaults.isValid, true);
    assert.equal(defaults.result?.netWorth, 0);

    const example = validateNetWorthInput(createExampleInput());
    assert.equal(example.isValid, true);
    assert.equal(example.result?.netWorth, 280_000);

    const blank = validateNetWorthInput(createBlankInput());
    assert.equal(blank.incomplete, true);

    const bad = validateNetWorthInput({
      ...createDefaultInput(),
      assets: { ...createDefaultInput().assets, primaryHome: '-1' },
    });
    assert.equal(bad.isValid, false);
    assert.ok(bad.errors.assets);
  });
});
