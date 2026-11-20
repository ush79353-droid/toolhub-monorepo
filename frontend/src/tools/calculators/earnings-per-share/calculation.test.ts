import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateEps, formatEpsPerShare } from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateEpsInput } from './validation';

function nearly(actual: number | null | undefined, expected: number, eps = 1e-9) {
  assert.ok(actual != null, `expected ~${expected}, got ${actual}`);
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateEps', () => {
  it('reference example → ≈ 38.75', () => {
    const r = calculateEps({
      netIncome: 13_120_000_000,
      preferredDividends: 200_000_000,
      commonShares: 333_400_000,
    })!;
    nearly(r.earningsAvailableToCommon, 12_920_000_000);
    nearly(r.earningsPerShare, 12_920_000_000 / 333_400_000);
    assert.equal(formatEpsPerShare(r.earningsPerShare, 'USD').slice(0, 5), '38.75');
  });

  it('no preferred dividends → 5.00', () => {
    const r = calculateEps({
      netIncome: 5_000_000,
      preferredDividends: 0,
      commonShares: 1_000_000,
    })!;
    nearly(r.earningsPerShare, 5);
  });

  it('negative NI → negative EPS', () => {
    const r = calculateEps({
      netIncome: -2_000_000,
      preferredDividends: 0,
      commonShares: 1_000_000,
    })!;
    nearly(r.earningsPerShare, -2);
  });

  it('zero NI → zero EPS', () => {
    const r = calculateEps({
      netIncome: 0,
      preferredDividends: 0,
      commonShares: 1_000_000,
    })!;
    nearly(r.earningsPerShare, 0);
  });

  it('preferred > NI → negative EPS', () => {
    const r = calculateEps({
      netIncome: 100_000,
      preferredDividends: 150_000,
      commonShares: 10_000,
    })!;
    nearly(r.earningsPerShare, -5);
  });

  it('rejects zero/negative shares and negative preferred', () => {
    assert.equal(
      calculateEps({
        netIncome: 1,
        preferredDividends: 0,
        commonShares: 0,
      }),
      null
    );
    assert.equal(
      calculateEps({
        netIncome: 1,
        preferredDividends: 0,
        commonShares: -1,
      }),
      null
    );
    assert.equal(
      calculateEps({
        netIncome: 1,
        preferredDividends: -1,
        commonShares: 1,
      }),
      null
    );
  });

  it('rejects non-finite inputs', () => {
    assert.equal(
      calculateEps({
        netIncome: Number.NaN,
        preferredDividends: 0,
        commonShares: 1,
      }),
      null
    );
    assert.equal(
      calculateEps({
        netIncome: 1,
        preferredDividends: 0,
        commonShares: Number.POSITIVE_INFINITY,
      }),
      null
    );
  });

  it('1.2M NI / 100k pref / 300k shares → 3.666… then 1.2M → 3.666…', () => {
    const a = calculateEps({
      netIncome: 1_000_000,
      preferredDividends: 100_000,
      commonShares: 300_000,
    })!;
    nearly(a.earningsPerShare, 3);
    const b = calculateEps({
      netIncome: 1_200_000,
      preferredDividends: 100_000,
      commonShares: 300_000,
    })!;
    nearly(b.earningsPerShare, 1_100_000 / 300_000);
  });
});

describe('validateEpsInput', () => {
  it('defaults → ≈ 38.75', () => {
    const v = validateEpsInput(createDefaultInput());
    assert.equal(v.isValid, true);
    nearly(v.result!.earningsPerShare, 12_920_000_000 / 333_400_000, 1e-6);
    assert.match(v.result!.formattedEps, /38\.75/);
  });

  it('empty → invalid', () => {
    assert.equal(validateEpsInput(createEmptyInput()).isValid, false);
  });

  it('zero shares errors', () => {
    const input = createDefaultInput();
    input.commonShares = '0';
    const v = validateEpsInput(input);
    assert.equal(v.isValid, false);
    assert.match(v.errors.commonShares!, /greater than zero/i);
  });

  it('negative shares errors', () => {
    const input = createDefaultInput();
    input.commonShares = '-100';
    assert.equal(validateEpsInput(input).isValid, false);
  });

  it('negative preferred errors', () => {
    const input = createDefaultInput();
    input.preferredDividends = '-1';
    assert.equal(validateEpsInput(input).isValid, false);
  });

  it('preferred > NI warns', () => {
    const input = createDefaultInput();
    input.netIncome = '100000';
    input.preferredDividends = '150000';
    input.commonShares = '10000';
    const v = validateEpsInput(input);
    assert.equal(v.isValid, true);
    nearly(v.result!.earningsPerShare, -5);
    assert.match(v.result!.warningMessage!, /exceed/i);
  });
});
