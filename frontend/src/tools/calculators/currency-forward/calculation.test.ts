import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  accumulationFactor,
  calculateCurrencyForward,
  settlementPayoffQuote,
  yearFraction,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateCurrencyForwardInput } from './validation';

describe('yearFraction / accumulation', () => {
  it('90/365', () => {
    assert.ok(Math.abs((yearFraction(90, 365) ?? 0) - 90 / 365) < 1e-15);
  });

  it('simple / annual / continuous factors', () => {
    const t = 90 / 365;
    assert.ok(
      Math.abs((accumulationFactor(0.05, t, 'simple') ?? 0) - (1 + 0.05 * t)) <
        1e-15
    );
    assert.ok(
      Math.abs(
        (accumulationFactor(0.05, t, 'annual') ?? 0) - Math.pow(1.05, t)
      ) < 1e-15
    );
    assert.ok(
      Math.abs(
        (accumulationFactor(0.05, t, 'continuous') ?? 0) - Math.exp(0.05 * t)
      ) < 1e-15
    );
  });

  it('invalid simple accumulation when 1+rT ≤ 0', () => {
    assert.equal(accumulationFactor(-2, 1, 'simple'), null);
  });
});

describe('calculateCurrencyForward', () => {
  it('EUR/USD worked example ≈ 1.1054', () => {
    const r = calculateCurrencyForward(1.1, 0.03, 0.05, 90, 365, 'simple')!;
    const t = 90 / 365;
    const expected = 1.1 * ((1 + 0.05 * t) / (1 + 0.03 * t));
    assert.ok(Math.abs(r.forwardRate - expected) < 1e-12);
    assert.ok(Math.abs(r.forwardRate - 1.1054) < 5e-5);
    assert.ok(r.forwardPoints > 0);
    assert.ok(r.forwardPremiumPercent > 0);
  });

  it('equal rates → F ≈ S', () => {
    const r = calculateCurrencyForward(1.25, 0.04, 0.04, 180, 365, 'simple')!;
    assert.ok(Math.abs(r.forwardRate - 1.25) < 1e-12);
  });

  it('zero rates → F = S', () => {
    const r = calculateCurrencyForward(1.2, 0, 0, 90, 365, 'simple')!;
    assert.equal(r.forwardRate, 1.2);
  });

  it('negative rates allowed when factors valid', () => {
    const r = calculateCurrencyForward(1.1, -0.01, -0.005, 90, 365, 'simple')!;
    assert.ok(r.forwardRate > 0);
  });

  it('360-day basis differs from 365', () => {
    const a = calculateCurrencyForward(1.1, 0.03, 0.05, 90, 360, 'simple')!;
    const b = calculateCurrencyForward(1.1, 0.03, 0.05, 90, 365, 'simple')!;
    assert.notEqual(a.forwardRate, b.forwardRate);
  });

  it('annual compounding differs from simple', () => {
    const s = calculateCurrencyForward(1.1, 0.03, 0.05, 90, 365, 'simple')!;
    const a = calculateCurrencyForward(1.1, 0.03, 0.05, 90, 365, 'annual')!;
    assert.notEqual(s.forwardRate, a.forwardRate);
  });

  it('continuous compounding', () => {
    const r = calculateCurrencyForward(1.1, 0.03, 0.05, 90, 365, 'continuous')!;
    const t = 90 / 365;
    const expected = 1.1 * Math.exp((0.05 - 0.03) * t);
    assert.ok(Math.abs(r.forwardRate - expected) < 1e-12);
  });

  it('discount when base rate > quote rate', () => {
    const r = calculateCurrencyForward(1.1, 0.05, 0.03, 90, 365, 'simple')!;
    assert.ok(r.forwardRate < 1.1);
    assert.ok(r.forwardPremiumPercent < 0);
  });

  it('invalid spot / duration → null', () => {
    assert.equal(calculateCurrencyForward(0, 0.03, 0.05, 90, 365, 'simple'), null);
    assert.equal(
      calculateCurrencyForward(1.1, 0.03, 0.05, 0, 365, 'simple'),
      null
    );
  });

  it('pair reversal consistency of CIP form', () => {
    const eurUsd = calculateCurrencyForward(1.1, 0.03, 0.05, 90, 365, 'simple')!;
    const usdEur = calculateCurrencyForward(
      1 / 1.1,
      0.05,
      0.03,
      90,
      365,
      'simple'
    )!;
    assert.ok(Math.abs(eurUsd.forwardRate * usdEur.forwardRate - 1) < 1e-10);
  });
});

describe('settlementPayoffQuote', () => {
  it('long base gains when ST > F', () => {
    const p = settlementPayoffQuote(1000, 1.1, 1.2, true)!;
    assert.ok(Math.abs(p - 100) < 1e-12);
  });

  it('short base opposite sign', () => {
    const p = settlementPayoffQuote(1000, 1.1, 1.2, false)!;
    assert.ok(Math.abs(p + 100) < 1e-12);
  });
});

describe('validateCurrencyForwardInput', () => {
  it('defaults → ≈1.1054', () => {
    const v = validateCurrencyForwardInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.ok(Math.abs(v.result!.forwardRate - 1.1054) < 5e-5);
    assert.match(v.result!.formattedForwardRate, /USD per EUR/);
  });

  it('empty → invalid', () => {
    assert.equal(validateCurrencyForwardInput(createEmptyInput()).isValid, false);
  });

  it('same currency → invalid', () => {
    const v = validateCurrencyForwardInput({
      ...createDefaultInput(),
      quoteCurrency: 'EUR',
    });
    assert.equal(v.isValid, false);
  });

  it('optional notional + settlement', () => {
    const v = validateCurrencyForwardInput({
      ...createDefaultInput(),
      notionalBase: '1000',
      futureSpotRate: '1.12',
      longBase: true,
    });
    assert.equal(v.isValid, true);
    assert.ok(v.result!.quoteAmountAtForward != null);
    assert.ok(v.result!.settlementPayoffQuote != null);
  });
});
