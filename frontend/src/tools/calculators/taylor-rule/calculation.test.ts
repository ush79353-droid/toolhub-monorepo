import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateApproximateRealRate,
  calculateInflationGap,
  calculateOutputGap,
  calculateTaylorRuleRate,
  toBaseUnits,
} from './calculation';
import { createExampleInput } from './types';
import { validateTaylorRuleInput } from './validation';

describe('Taylor Rule calculation', () => {
  it('inflation gap: 4 − 2 = 2', () => {
    assert.equal(calculateInflationGap(4, 2), 2);
  });

  it('positive output gap: 21/20 → 5%', () => {
    assert.equal(calculateOutputGap(21, 20), 5);
  });

  it('negative output gap: 19/20 → −5%', () => {
    assert.equal(calculateOutputGap(19, 20), -5);
  });

  it('standard Taylor rule → 9.5%', () => {
    const rate = calculateTaylorRuleRate(2, 4, 2, 5, 0.5, 0.5);
    assert.equal(rate, 9.5);
  });

  it('zero inflation gap', () => {
    assert.equal(calculateInflationGap(2, 2), 0);
  });

  it('zero output gap', () => {
    assert.equal(calculateOutputGap(20, 20), 0);
  });

  it('can return negative theoretical rate', () => {
    const rate = calculateTaylorRuleRate(0, 0, -4, -10, 0.5, 0.5);
    // i = 0 + 0 + 0.5(-4) + 0.5(-10) = -2 - 5 = -7
    assert.equal(rate, -7);
  });

  it('invalid potential GDP 0 → null', () => {
    assert.equal(calculateOutputGap(21, 0), null);
  });

  it('custom coefficients', () => {
    // i = 2 + 4 + 1.0*2 + 0.25*5 = 6 + 2 + 1.25 = 9.25
    assert.equal(calculateTaylorRuleRate(2, 4, 2, 5, 1, 0.25), 9.25);
  });

  it('approximate ex-ante real rate', () => {
    assert.equal(calculateApproximateRealRate(9.5, 4), 5.5);
  });

  it('example input validates to 9.5%', () => {
    const v = validateTaylorRuleInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result!.inflationGap, 2);
    assert.equal(v.result!.outputGap, 5);
    assert.equal(v.result!.standardRate, 9.5);
    assert.equal(v.result!.customRate, 9.5);
    assert.equal(
      v.result!.actualGdpBase,
      toBaseUnits(21, 'trillions')
    );
  });

  it('potential GDP 0 fails validation', () => {
    const v = validateTaylorRuleInput({
      ...createExampleInput(),
      potentialGdp: '0',
    });
    assert.equal(v.isValid, false);
    assert.match(v.errors.potentialGdp ?? '', /greater than zero/i);
  });

  it('deflation (negative inflation) allowed', () => {
    assert.equal(calculateInflationGap(-1, 2), -3);
  });

  it('missing data fails validation', () => {
    const v = validateTaylorRuleInput({
      ...createExampleInput(),
      currentInflation: '',
    });
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });
});
