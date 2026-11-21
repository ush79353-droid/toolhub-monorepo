import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateForwardRate,
  calculateForwardRateDecimal,
  toYears,
} from './calculation';
import { createExampleInput, type ForwardRateInput } from './types';
import { validateForwardRateInput } from './validation';

function base(patch: Partial<ForwardRateInput> = {}): ForwardRateInput {
  return { ...createExampleInput(), ...patch };
}

describe('forward rate unit conversion', () => {
  it('converts months to years', () => {
    assert.equal(toYears(12, 'months'), 1);
    assert.equal(toYears(18, 'months'), 1.5);
    assert.equal(toYears(2, 'years'), 2);
  });
});

describe('forward rate annual formula', () => {
  it('Test 1: 1y 5% and 2y 6% → ≈ 7.0095238%', () => {
    const f = calculateForwardRateDecimal(1, 0.05, 2, 0.06);
    assert.ok(f != null);
    assert.ok(Math.abs(f - 0.070095238095238) < 1e-12);

    const result = calculateForwardRate(createExampleInput());
    assert.ok(result);
    assert.ok(Math.abs(result.forwardRatePercent - 7.0095238095238) < 1e-9);
  });

  it('Test 2: flat curve 3y 4% and 5y 4% → 4%', () => {
    const f = calculateForwardRateDecimal(3, 0.04, 5, 0.04);
    assert.ok(f != null);
    assert.ok(Math.abs(f - 0.04) < 1e-12);
  });

  it('Test 3: months units 12 mo @ 5% and 24 mo @ 6% match years', () => {
    const result = calculateForwardRate(
      base({
        n1: '12',
        n1Unit: 'months',
        s1Percent: '5',
        n2: '24',
        n2Unit: 'months',
        s2Percent: '6',
      }),
    );
    assert.ok(result);
    assert.equal(result.n1Years, 1);
    assert.equal(result.n2Years, 2);
    assert.ok(Math.abs(result.forwardRatePercent - 7.0095238095238) < 1e-9);
  });

  it('Test 4: n2 <= n1 returns null', () => {
    assert.equal(calculateForwardRateDecimal(2, 0.05, 2, 0.06), null);
    assert.equal(calculateForwardRateDecimal(3, 0.05, 1, 0.06), null);
  });

  it('Test 5: S <= -100% rejected (1+S <= 0)', () => {
    assert.equal(calculateForwardRateDecimal(1, -1, 2, 0.05), null);
    assert.equal(calculateForwardRateDecimal(1, 0.05, 2, -1.5), null);
  });
});

describe('forward rate validation', () => {
  it('rejects blank and n2 <= n1', () => {
    const blank = validateForwardRateInput(base({ n1: '', s1Percent: '' }));
    assert.equal(blank.isValid, false);
    assert.ok(blank.errors.n1 || blank.errors.s1Percent);

    const order = validateForwardRateInput(
      base({ n1: '5', n2: '2', s1Percent: '4', s2Percent: '5' }),
    );
    assert.equal(order.isValid, false);
    assert.ok(order.errors.n2);
  });

  it('accepts example input', () => {
    const v = validateForwardRateInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
  });
});
