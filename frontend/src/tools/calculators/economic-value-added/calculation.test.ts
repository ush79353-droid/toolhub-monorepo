import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateEva,
  calculateInvestedCapital,
  formatEvaMoney,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateEvaInput } from './validation';

function nearly(actual: number | null | undefined, expected: number, eps = 1e-9) {
  assert.ok(actual != null, `expected ~${expected}, got ${actual}`);
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateEva', () => {
  it('positive EVA → 650000', () => {
    const r = calculateEva({
      nopat: 750_000,
      investedCapital: 1_000_000,
      waccPercent: 10,
    })!;
    nearly(r.capitalCharge, 100_000);
    nearly(r.eva, 650_000);
    nearly(r.waccDecimal, 0.1);
  });

  it('negative EVA → -40000', () => {
    const r = calculateEva({
      nopat: 80_000,
      investedCapital: 1_000_000,
      waccPercent: 12,
    })!;
    nearly(r.eva, -40_000);
  });

  it('zero EVA', () => {
    const r = calculateEva({
      nopat: 100_000,
      investedCapital: 1_000_000,
      waccPercent: 10,
    })!;
    nearly(r.eva, 0);
  });

  it('zero WACC → EVA = NOPAT', () => {
    const r = calculateEva({
      nopat: 200_000,
      investedCapital: 1_000_000,
      waccPercent: 0,
    })!;
    nearly(r.eva, 200_000);
    nearly(r.capitalCharge, 0);
  });

  it('zero invested capital → EVA = NOPAT', () => {
    const r = calculateEva({
      nopat: 50_000,
      investedCapital: 0,
      waccPercent: 10,
    })!;
    nearly(r.eva, 50_000);
  });

  it('decimal WACC 7.5% → 350000', () => {
    const r = calculateEva({
      nopat: 500_000,
      investedCapital: 2_000_000,
      waccPercent: 7.5,
    })!;
    nearly(r.eva, 350_000);
  });

  it('rejects negative IC and out-of-range WACC', () => {
    assert.equal(
      calculateEva({
        nopat: 1,
        investedCapital: -1,
        waccPercent: 10,
      }),
      null
    );
    assert.equal(
      calculateEva({
        nopat: 1,
        investedCapital: 1,
        waccPercent: -1,
      }),
      null
    );
    assert.equal(
      calculateEva({
        nopat: 1,
        investedCapital: 1,
        waccPercent: 101,
      }),
      null
    );
  });
});

describe('calculateInvestedCapital', () => {
  it('OA − OL → 1.8M', () => {
    nearly(calculateInvestedCapital(2_500_000, 700_000), 1_800_000);
  });

  it('rejects negative OA/OL and negative IC', () => {
    assert.equal(calculateInvestedCapital(-1, 0), null);
    assert.equal(calculateInvestedCapital(100, 200), null);
  });
});

describe('validateEvaInput', () => {
  it('defaults → 650000', () => {
    const v = validateEvaInput(createDefaultInput());
    assert.equal(v.isValid, true);
    nearly(v.result!.eva, 650_000);
    assert.match(v.result!.formattedEva, /650,000/);
  });

  it('empty → invalid', () => {
    assert.equal(validateEvaInput(createEmptyInput()).isValid, false);
  });

  it('helper computes IC without blocking EVA', () => {
    const input = createDefaultInput();
    input.operatingAssets = '2500000';
    input.operatingLiabilities = '700000';
    const v = validateEvaInput(input);
    assert.equal(v.isValid, true);
    nearly(v.helperInvestedCapital, 1_800_000);
  });

  it('negative invested capital errors', () => {
    const input = createDefaultInput();
    input.investedCapital = '-1';
    assert.equal(validateEvaInput(input).isValid, false);
  });

  it('money format uses 2 decimals', () => {
    assert.equal(formatEvaMoney(650000, 'USD'), '650,000.00');
  });
});
