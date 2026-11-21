import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  annualizeForwardPremium,
  calculateForwardPremiumFromInput,
  deAnnualizeForwardPremium,
  formatPercentDisplay,
  forwardPremiumPercentFromRates,
  forwardRateFromPremium,
  resolveForwardPremiumMath,
} from './calculation';
import {
  FORWARD_PREMIUM_DAY_COUNT_BASIS,
  createExampleInput,
  type ForwardPremiumInput,
} from './types';
import { validateForwardPremiumInput } from './validation';

function base(patch: Partial<ForwardPremiumInput> = {}): ForwardPremiumInput {
  return { ...createExampleInput(), ...patch };
}

describe('forward premium', () => {
  it('Test 1: reference 1.25 / 1.28 → 2.4% period premium', () => {
    const p = forwardPremiumPercentFromRates(1.25, 1.28);
    assert.ok(p != null);
    assert.ok(Math.abs(p - 2.4) < 1e-12);
  });

  it('Test 2: annualize 2.4% over 90 days on 365 basis', () => {
    const a = annualizeForwardPremium(2.4, 90, 365);
    assert.ok(a != null);
    assert.ok(Math.abs(a - 2.4 * (365 / 90)) < 1e-12);
    assert.equal(formatPercentDisplay(a!), '9.7333%');
  });

  it('Test 3: example input resolves full result', () => {
    const r = calculateForwardPremiumFromInput(createExampleInput());
    assert.ok(r);
    assert.equal(r.dayCountBasis, FORWARD_PREMIUM_DAY_COUNT_BASIS);
    assert.ok(Math.abs(r.forwardPremiumPercent - 2.4) < 1e-12);
    assert.ok(Math.abs(r.annualizedForwardPremiumPercent - 2.4 * (365 / 90)) < 1e-12);
    assert.equal(r.isDiscount, false);
    const v = validateForwardPremiumInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
  });

  it('Test 4: forward discount when F < S', () => {
    const p = forwardPremiumPercentFromRates(1.2, 1.1);
    assert.ok(p != null);
    assert.ok(p < 0);
    const r = calculateForwardPremiumFromInput(
      base({
        spotRate: '1.2',
        forwardRate: '1.1',
        durationDays: '180',
        lastEdited: 'forwardRate',
      }),
    );
    assert.ok(r);
    assert.equal(r.isDiscount, true);
  });

  it('Test 5: zero premium when F = S', () => {
    const p = forwardPremiumPercentFromRates(1.5, 1.5);
    assert.equal(p, 0);
  });

  it('Test 6: reject non-positive spot or forward', () => {
    assert.equal(forwardPremiumPercentFromRates(0, 1.1), null);
    assert.equal(forwardPremiumPercentFromRates(1.1, 0), null);
    assert.equal(forwardPremiumPercentFromRates(-1, 1.1), null);
    const v = validateForwardPremiumInput(
      base({ spotRate: '0', lastEdited: 'spotRate' }),
    );
    assert.equal(v.isValid, false);
    assert.ok(v.errors.spotRate);
  });

  it('Test 7: reject non-positive duration', () => {
    assert.equal(annualizeForwardPremium(2.4, 0), null);
    assert.equal(annualizeForwardPremium(2.4, -10), null);
    const v = validateForwardPremiumInput(
      base({ durationDays: '0', lastEdited: 'durationDays' }),
    );
    assert.equal(v.isValid, false);
  });

  it('Test 8: reverse from premium updates forward', () => {
    const f = forwardRateFromPremium(1.25, 2.4);
    assert.ok(f != null);
    assert.ok(Math.abs(f - 1.28) < 1e-12);
    const math = resolveForwardPremiumMath(
      base({
        spotRate: '1.25',
        forwardRate: '',
        forwardPremiumPercent: '2.4',
        durationDays: '90',
        lastEdited: 'forwardPremiumPercent',
      }),
    );
    assert.ok(math);
    assert.ok(Math.abs(math.forwardRate - 1.28) < 1e-12);
  });

  it('Test 9: de-annualize then re-annualize round-trips', () => {
    const premium = deAnnualizeForwardPremium(9.7333333333, 90, 365);
    assert.ok(premium != null);
    const again = annualizeForwardPremium(premium, 90, 365);
    assert.ok(again != null);
    assert.ok(Math.abs(again - 9.7333333333) < 1e-8);
  });

  it('Test 10: blank / invalid inputs fail validation', () => {
    const blank = validateForwardPremiumInput(
      base({ spotRate: '', forwardRate: '', lastEdited: 'spotRate' }),
    );
    assert.equal(blank.isValid, false);
    const bad = validateForwardPremiumInput(
      base({ spotRate: 'NaN', lastEdited: 'spotRate' }),
    );
    assert.equal(bad.isValid, false);
  });
});
