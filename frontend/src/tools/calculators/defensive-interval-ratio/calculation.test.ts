import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAverageDailyCashExpenditure,
  calculateDefensiveAssets,
  calculateDefensiveIntervalDays,
  calculateDefensiveIntervalRatio,
  calculateMaximumDailyExpenditure,
  calculateRequiredDefensiveAssets,
} from './calculation';
import {
  createExampleInput,
  type DefensiveIntervalRatioInput,
} from './types';
import { validateDefensiveIntervalRatioInput } from './validation';

function base(
  patch: Partial<DefensiveIntervalRatioInput> = {},
): DefensiveIntervalRatioInput {
  return { ...createExampleInput(), ...patch };
}

describe('defensive interval forward formula', () => {
  it('Test 1: Company Alpha → 160 days', () => {
    assert.equal(calculateDefensiveAssets(10_000_000, 5_000_000, 17_000_000), 32_000_000);
    assert.equal(
      calculateAverageDailyCashExpenditure(110_000_000, 37_000_000),
      200_000,
    );
    assert.equal(calculateDefensiveIntervalDays(32_000_000, 200_000), 160);

    const result = calculateDefensiveIntervalRatio(createExampleInput());
    assert.ok(result);
    assert.equal(result.defensiveAssets, 32_000_000);
    assert.equal(result.annualCashOperatingExpenditure, 73_000_000);
    assert.equal(result.averageDailyCashExpenditure, 200_000);
    assert.equal(result.defensiveIntervalDays, 160);
  });

  it('Test 2: simple 100 days', () => {
    const result = calculateDefensiveIntervalRatio(
      base({
        cashAndCashEquivalents: '50000',
        marketableSecurities: '20000',
        accountsReceivable: '30000',
        annualOperatingExpenses: '365000',
        annualNonCashCharges: '0',
      }),
    );
    assert.ok(result);
    assert.equal(result.defensiveAssets, 100_000);
    assert.equal(result.averageDailyCashExpenditure, 1_000);
    assert.equal(result.defensiveIntervalDays, 100);
  });

  it('Test 3: zero defensive assets → 0 days', () => {
    const result = calculateDefensiveIntervalRatio(
      base({
        cashAndCashEquivalents: '0',
        marketableSecurities: '0',
        accountsReceivable: '0',
      }),
    );
    assert.ok(result);
    assert.equal(result.defensiveIntervalDays, 0);
  });
});

describe('defensive interval edge cases', () => {
  it('Test 4: zero cash expenditure → no numeric DIR', () => {
    const v = validateDefensiveIntervalRatioInput(
      base({
        annualOperatingExpenses: '100000',
        annualNonCashCharges: '100000',
      }),
    );
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
    assert.match(
      v.errors.form ?? '',
      /average daily cash expenditure is zero/i,
    );
  });

  it('Test 5: NCE exceeds OE → validation error', () => {
    const v = validateDefensiveIntervalRatioInput(
      base({
        annualOperatingExpenses: '50000',
        annualNonCashCharges: '60000',
      }),
    );
    assert.equal(v.isValid, false);
    assert.match(
      v.errors.annualNonCashCharges ?? '',
      /cannot exceed annual operating expenses/i,
    );
  });
});

describe('defensive interval reverse solves', () => {
  it('Test 6: required assets 90 × 50,000 = 4,500,000', () => {
    assert.equal(calculateRequiredDefensiveAssets(90, 50_000), 4_500_000);
    const result = calculateDefensiveIntervalRatio(
      base({
        solveTarget: 'requiredAssets',
        targetDays: '90',
        dailyCashExpenditure: '50000',
      }),
    );
    assert.ok(result);
    assert.equal(result.defensiveAssets, 4_500_000);
  });

  it('Test 7: max daily 6,000,000 / 120 = 50,000', () => {
    assert.equal(calculateMaximumDailyExpenditure(6_000_000, 120), 50_000);
    const result = calculateDefensiveIntervalRatio(
      base({
        solveTarget: 'maxDailyExpenditure',
        defensiveAssetsDirect: '6000000',
        targetDays: '120',
      }),
    );
    assert.ok(result);
    assert.equal(result.averageDailyCashExpenditure, 50_000);
  });
});

describe('defensive interval invalid inputs', () => {
  it('rejects empty, negative, NaN, Infinity', () => {
    assert.equal(
      validateDefensiveIntervalRatioInput(
        base({ cashAndCashEquivalents: '' }),
      ).isValid,
      false,
    );
    assert.equal(
      validateDefensiveIntervalRatioInput(
        base({ cashAndCashEquivalents: '-1' }),
      ).isValid,
      false,
    );
    assert.equal(
      validateDefensiveIntervalRatioInput(
        base({ cashAndCashEquivalents: 'NaN' }),
      ).isValid,
      false,
    );
    assert.equal(
      validateDefensiveIntervalRatioInput(
        base({ cashAndCashEquivalents: 'Infinity' }),
      ).isValid,
      false,
    );
    assert.equal(calculateDefensiveAssets(-1, 0, 0), null);
    assert.equal(calculateAverageDailyCashExpenditure(10, 20), null);
    assert.equal(calculateDefensiveIntervalDays(100, 0), null);
  });
});
