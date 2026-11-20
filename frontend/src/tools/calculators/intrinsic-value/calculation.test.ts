import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateIntrinsicValue,
  formatIvMoney,
  formatIvPercent,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateIntrinsicValueInput } from './validation';

function nearly(actual: number | null | undefined, expected: number, eps = 1e-6) {
  assert.ok(actual != null, `expected ~${expected}, got ${actual}`);
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateIntrinsicValue', () => {
  it('EPS 5 · g 6 · Y 4.4 → 102.50', () => {
    const r = calculateIntrinsicValue({
      earningsPerShare: 5,
      expectedGrowthRate: 6,
      corporateBondYield: 4.4,
    })!;
    nearly(r.intrinsicValue, 102.5);
  });

  it('EPS 5 · g 8 · Y 4.4 → 122.50', () => {
    const r = calculateIntrinsicValue({
      earningsPerShare: 5,
      expectedGrowthRate: 8,
      corporateBondYield: 4.4,
    })!;
    nearly(r.intrinsicValue, 122.5);
  });

  it('margin of safety ≈ 21.95%', () => {
    const r = calculateIntrinsicValue({
      earningsPerShare: 5,
      expectedGrowthRate: 6,
      corporateBondYield: 4.4,
      currentMarketPrice: 80,
    })!;
    nearly(r.intrinsicValue, 102.5);
    nearly(r.marginOfSafety!, 21.9512195, 1e-4);
    assert.equal(r.valuationStatus, 'below');
  });

  it('negative margin when price above V', () => {
    const r = calculateIntrinsicValue({
      earningsPerShare: 5,
      expectedGrowthRate: 6,
      corporateBondYield: 4.4,
      currentMarketPrice: 120,
    })!;
    // V=102.5; MS = (102.5-120)/102.5 ≈ -17.07%
    nearly(r.marginOfSafety!, ((102.5 - 120) / 102.5) * 100);
    assert.equal(r.valuationStatus, 'above');
  });

  it('equal price → 0% MS', () => {
    const r = calculateIntrinsicValue({
      earningsPerShare: 5,
      expectedGrowthRate: 6,
      corporateBondYield: 4.4,
      currentMarketPrice: 102.5,
    })!;
    nearly(r.marginOfSafety!, 0);
    assert.equal(r.valuationStatus, 'equal');
  });

  it('zero growth → V = EPS × 8.5', () => {
    const r = calculateIntrinsicValue({
      earningsPerShare: 5,
      expectedGrowthRate: 0,
      corporateBondYield: 4.4,
    })!;
    nearly(r.intrinsicValue, 5 * 8.5);
  });

  it('zero/negative EPS → null', () => {
    assert.equal(
      calculateIntrinsicValue({
        earningsPerShare: 0,
        expectedGrowthRate: 6,
        corporateBondYield: 4.4,
      }),
      null
    );
    assert.equal(
      calculateIntrinsicValue({
        earningsPerShare: -1,
        expectedGrowthRate: 6,
        corporateBondYield: 4.4,
      }),
      null
    );
  });

  it('zero/negative bond yield → null', () => {
    assert.equal(
      calculateIntrinsicValue({
        earningsPerShare: 5,
        expectedGrowthRate: 6,
        corporateBondYield: 0,
      }),
      null
    );
    assert.equal(
      calculateIntrinsicValue({
        earningsPerShare: 5,
        expectedGrowthRate: 6,
        corporateBondYield: -1,
      }),
      null
    );
  });

  it('growth making multiplier negative → null', () => {
    assert.equal(
      calculateIntrinsicValue({
        earningsPerShare: 5,
        expectedGrowthRate: -5,
        corporateBondYield: 4.4,
      }),
      null
    );
  });

  it('missing CMP still calculates V', () => {
    const r = calculateIntrinsicValue({
      earningsPerShare: 5,
      expectedGrowthRate: 6,
      corporateBondYield: 4.4,
    })!;
    nearly(r.intrinsicValue, 102.5);
    assert.equal(r.marginOfSafety, undefined);
  });

  it('explicit negative MS example 100 vs 120', () => {
    const r = calculateIntrinsicValue({
      earningsPerShare: 100 / 8.5,
      expectedGrowthRate: 0,
      corporateBondYield: 4.4,
      currentMarketPrice: 120,
    })!;
    nearly(r.intrinsicValue, 100);
    nearly(r.marginOfSafety!, -20);
  });
});

describe('validateIntrinsicValueInput', () => {
  it('defaults → 102.50 / ≈21.95%', () => {
    const v = validateIntrinsicValueInput(createDefaultInput());
    assert.equal(v.isValid, true);
    nearly(v.result!.intrinsicValue, 102.5);
    nearly(v.result!.marginOfSafety!, 21.9512195, 1e-4);
    assert.match(v.result!.formattedMarginOfSafety ?? '', /21\.95/);
  });

  it('empty → invalid', () => {
    const v = validateIntrinsicValueInput(createEmptyInput());
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });

  it('without CMP → V only', () => {
    const v = validateIntrinsicValueInput({
      ...createDefaultInput(),
      currentMarketPrice: '',
    });
    assert.equal(v.isValid, true);
    nearly(v.result!.intrinsicValue, 102.5);
    assert.equal(v.result!.marginOfSafety, null);
  });

  it('formats', () => {
    assert.equal(formatIvMoney(102.5, 'USD'), '102.50');
    assert.equal(formatIvPercent(21.9512), '21.95');
  });
});
