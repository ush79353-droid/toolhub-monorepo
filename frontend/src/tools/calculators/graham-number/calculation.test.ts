import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateDerivedBvps,
  calculateDerivedEps,
  calculateGrahamNumber,
  formatGrahamMoney,
  formatGrahamPercent,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateGrahamNumberInput } from './validation';

function nearly(actual: number | null | undefined, expected: number, eps = 1e-6) {
  assert.ok(actual != null, `expected ~${expected}, got ${actual}`);
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateGrahamNumber', () => {
  it('EPS 5 · BVPS 20 → ≈ 47.43', () => {
    const r = calculateGrahamNumber({
      earningsPerShare: 5,
      bookValuePerShare: 20,
    })!;
    nearly(r.grahamNumber, Math.sqrt(2250));
    nearly(r.grahamNumber, 47.4341649, 1e-4);
  });

  it('EPS 8 · BVPS 20 → 60', () => {
    const r = calculateGrahamNumber({
      earningsPerShare: 8,
      bookValuePerShare: 20,
    })!;
    nearly(r.grahamNumber, 60);
  });

  it('price 40 → below · ≈ 15.67%', () => {
    const r = calculateGrahamNumber({
      earningsPerShare: 5,
      bookValuePerShare: 20,
      currentPrice: 40,
    })!;
    assert.equal(r.valuationStatus, 'below');
    nearly(r.priceDifferencePercentage!, ((r.grahamNumber - 40) / r.grahamNumber) * 100);
    nearly(r.priceDifferencePercentage!, 15.67, 0.01);
  });

  it('price 60 → above', () => {
    const r = calculateGrahamNumber({
      earningsPerShare: 5,
      bookValuePerShare: 20,
      currentPrice: 60,
    })!;
    assert.equal(r.valuationStatus, 'above');
  });

  it('price equals GN → equal · 0%', () => {
    const r = calculateGrahamNumber({
      earningsPerShare: 8,
      bookValuePerShare: 20,
      currentPrice: 60,
    })!;
    assert.equal(r.valuationStatus, 'equal');
    nearly(r.priceDifferencePercentage!, 0);
  });

  it('zero/negative EPS or BVPS → null', () => {
    assert.equal(
      calculateGrahamNumber({ earningsPerShare: 0, bookValuePerShare: 20 }),
      null
    );
    assert.equal(
      calculateGrahamNumber({ earningsPerShare: -1, bookValuePerShare: 20 }),
      null
    );
    assert.equal(
      calculateGrahamNumber({ earningsPerShare: 5, bookValuePerShare: 0 }),
      null
    );
    assert.equal(
      calculateGrahamNumber({ earningsPerShare: 5, bookValuePerShare: -2 }),
      null
    );
  });

  it('zero current price → null', () => {
    assert.equal(
      calculateGrahamNumber({
        earningsPerShare: 5,
        bookValuePerShare: 20,
        currentPrice: 0,
      }),
      null
    );
  });

  it('missing price still calculates GN', () => {
    const r = calculateGrahamNumber({
      earningsPerShare: 5,
      bookValuePerShare: 20,
    })!;
    nearly(r.grahamNumber, Math.sqrt(2250));
    assert.equal(r.valuationStatus, undefined);
  });

  it('Company Alpha example ≈ 58.09', () => {
    const r = calculateGrahamNumber({
      earningsPerShare: 6,
      bookValuePerShare: 25,
      currentPrice: 50,
    })!;
    nearly(r.grahamNumber, Math.sqrt(3375));
    nearly(r.grahamNumber, 58.09475, 1e-4);
    assert.equal(r.valuationStatus, 'below');
    nearly(r.priceDifferencePercentage!, 13.93, 0.01);
  });
});

describe('derived EPS / BVPS', () => {
  it('EPS from NI − preferred / shares', () => {
    nearly(
      calculateDerivedEps({
        netIncome: 1_000_000,
        preferredDividends: 100_000,
        weightedShares: 180_000,
      }),
      5
    );
  });

  it('BVPS from equity − preferred / shares', () => {
    nearly(
      calculateDerivedBvps({
        totalEquity: 2_100_000,
        preferredEquity: 100_000,
        commonShares: 100_000,
      }),
      20
    );
  });

  it('zero shares → null', () => {
    assert.equal(
      calculateDerivedEps({
        netIncome: 100,
        preferredDividends: 0,
        weightedShares: 0,
      }),
      null
    );
  });
});

describe('validateGrahamNumberInput', () => {
  it('defaults → ≈ 47.43 below', () => {
    const v = validateGrahamNumberInput(createDefaultInput());
    assert.equal(v.isValid, true);
    nearly(v.result!.grahamNumber, Math.sqrt(2250));
    assert.equal(v.result!.valuationStatus, 'below');
    assert.match(v.result!.formattedPriceDifference ?? '', /15\.6/);
  });

  it('empty → invalid', () => {
    const v = validateGrahamNumberInput(createEmptyInput());
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });

  it('GN without current price', () => {
    const v = validateGrahamNumberInput({
      ...createDefaultInput(),
      currentPrice: '',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.valuationStatus, null);
    nearly(v.result!.grahamNumber, Math.sqrt(2250));
  });

  it('formats money', () => {
    assert.equal(formatGrahamMoney(47.434, 'USD'), '47.43');
    assert.equal(formatGrahamPercent(15.666), '15.67');
  });
});
