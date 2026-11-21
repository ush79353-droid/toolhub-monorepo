import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  approximateDoublingTime,
  approximateIncreasePercent,
  calculateRuleOf72,
  exactDoublingPeriods,
} from './calculation';
import { createExampleInput, type RuleOf72Input } from './types';
import { validateRuleOf72Input } from './validation';

function base(patch: Partial<RuleOf72Input> = {}): RuleOf72Input {
  return { ...createExampleInput(), ...patch };
}

describe('Rule of 72', () => {
  it('8% → 9 periods (worked example)', () => {
    assert.equal(approximateDoublingTime(8), 9);
    const result = calculateRuleOf72(createExampleInput());
    assert.ok(result);
    assert.equal(result.doublingTime, 9);
    assert.equal(result.increasePercent, 8);
    assert.equal(result.source, 'increase');
  });

  it('reverse: 9 periods → 8%', () => {
    assert.equal(approximateIncreasePercent(9), 8);
    const result = calculateRuleOf72(
      base({ increasePercent: '', doublingTime: '9', lastEdited: 'doublingTime' }),
    );
    assert.ok(result);
    assert.equal(result.increasePercent, 8);
  });

  it('exact discrete compound near the rule for 8%', () => {
    const exact = exactDoublingPeriods(8);
    assert.ok(exact != null);
    assert.ok(Math.abs(exact! - Math.LN2 / Math.log(1.08)) < 1e-12);
    assert.ok(Math.abs(exact! - 9) < 0.01);
  });

  it('rejects zero, negative, and non-finite', () => {
    assert.equal(approximateDoublingTime(0), null);
    assert.equal(approximateDoublingTime(-5), null);
    assert.equal(
      calculateRuleOf72(base({ increasePercent: '0', lastEdited: 'increase' })),
      null,
    );
    assert.equal(
      calculateRuleOf72(
        base({ increasePercent: 'Infinity', lastEdited: 'increase' }),
      ),
      null,
    );
    const validation = validateRuleOf72Input(
      base({ increasePercent: '-1', lastEdited: 'increase' }),
    );
    assert.equal(validation.isValid, false);
  });
});
