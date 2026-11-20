import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateEpsGrowth, formatGrowthPercent } from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateEpsGrowthInput } from './validation';

function nearly(actual: number | null | undefined, expected: number, eps = 1e-6) {
  assert.ok(actual != null, `expected ~${expected}, got ${actual}`);
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateEpsGrowth', () => {
  it('positive growth 2.50→4.00 over 3 → 60% · ≈16.99% CAGR', () => {
    const r = calculateEpsGrowth({
      initialEps: 2.5,
      finalEps: 4,
      numberOfPeriods: 3,
    })!;
    nearly(r.absoluteEpsChange, 1.5);
    nearly(r.totalGrowthPercentage, 60);
    nearly(r.compoundGrowthRate!, (Math.pow(4 / 2.5, 1 / 3) - 1) * 100);
    assert.equal(formatGrowthPercent(r.totalGrowthPercentage!), '60.00');
    assert.equal(
      formatGrowthPercent(r.compoundGrowthRate!).slice(0, 4),
      '16.9'
    );
  });

  it('decline 5→4 over 2 → -20% · ≈-10.56% CAGR', () => {
    const r = calculateEpsGrowth({
      initialEps: 5,
      finalEps: 4,
      numberOfPeriods: 2,
    })!;
    nearly(r.totalGrowthPercentage, -20);
    nearly(r.compoundGrowthRate!, (Math.pow(4 / 5, 0.5) - 1) * 100);
    assert.equal(formatGrowthPercent(r.compoundGrowthRate!), '-10.56');
  });

  it('no growth → 0%', () => {
    const r = calculateEpsGrowth({
      initialEps: 3,
      finalEps: 3,
      numberOfPeriods: 5,
    })!;
    nearly(r.totalGrowthPercentage, 0);
    nearly(r.compoundGrowthRate!, 0);
  });

  it('zero final → -100% total and CAGR', () => {
    const r = calculateEpsGrowth({
      initialEps: 2,
      finalEps: 0,
      numberOfPeriods: 3,
    })!;
    nearly(r.totalGrowthPercentage, -100);
    nearly(r.compoundGrowthRate!, -100);
  });

  it('zero initial → undefined growth/CAGR', () => {
    const r = calculateEpsGrowth({
      initialEps: 0,
      finalEps: 3,
      numberOfPeriods: 2,
    })!;
    assert.equal(r.totalGrowthPercentage, null);
    assert.equal(r.compoundGrowthRate, null);
    assert.match(r.warning!, /zero/i);
  });

  it('negative initial → no conventional growth/CAGR', () => {
    const r = calculateEpsGrowth({
      initialEps: -2,
      finalEps: 1,
      numberOfPeriods: 3,
    })!;
    nearly(r.absoluteEpsChange, 3);
    assert.equal(r.totalGrowthPercentage, null);
    assert.equal(r.compoundGrowthRate, null);
    assert.match(r.warning!, /negative/i);
  });

  it('positive to negative → total % ok, CAGR unavailable', () => {
    const r = calculateEpsGrowth({
      initialEps: 2,
      finalEps: -1,
      numberOfPeriods: 2,
    })!;
    nearly(r.totalGrowthPercentage, -150);
    assert.equal(r.compoundGrowthRate, null);
    assert.match(r.warning!, /negative|loss/i);
  });

  it('rejects non-positive periods and non-finite', () => {
    assert.equal(
      calculateEpsGrowth({
        initialEps: 1,
        finalEps: 2,
        numberOfPeriods: 0,
      }),
      null
    );
    assert.equal(
      calculateEpsGrowth({
        initialEps: 1,
        finalEps: 2,
        numberOfPeriods: -1,
      }),
      null
    );
    assert.equal(
      calculateEpsGrowth({
        initialEps: Number.NaN,
        finalEps: 2,
        numberOfPeriods: 1,
      }),
      null
    );
  });
});

describe('validateEpsGrowthInput', () => {
  it('defaults → 60% total', () => {
    const v = validateEpsGrowthInput(createDefaultInput());
    assert.equal(v.isValid, true);
    nearly(v.result!.totalGrowthPercentage!, 60);
    assert.equal(v.result!.formattedTotalGrowth, '60.00%');
    assert.ok(v.result!.formattedCagr);
  });

  it('empty → invalid', () => {
    assert.equal(validateEpsGrowthInput(createEmptyInput()).isValid, false);
  });

  it('zero periods errors', () => {
    const input = createDefaultInput();
    input.numberOfPeriods = '0';
    assert.equal(validateEpsGrowthInput(input).isValid, false);
  });

  it('period change updates CAGR only', () => {
    const a = validateEpsGrowthInput(createDefaultInput());
    const bInput = createDefaultInput();
    bInput.numberOfPeriods = '1';
    const b = validateEpsGrowthInput(bInput);
    nearly(a.result!.totalGrowthPercentage!, b.result!.totalGrowthPercentage!);
    assert.notEqual(
      a.result!.compoundGrowthRate,
      b.result!.compoundGrowthRate
    );
  });
});
