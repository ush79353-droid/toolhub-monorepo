import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateActualGDP,
  calculateGDPGap,
  calculatePotentialGDP,
  toBaseUnits,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
} from './types';
import { validateGdpGapInput } from './validation';

describe('GDP gap formulas', () => {
  it('+10% when 22 / 20', () => {
    assert.equal(calculateGDPGap(22, 20), 10);
  });

  it('-10% when 18 / 20', () => {
    assert.equal(calculateGDPGap(18, 20), -10);
  });

  it('0% when equal', () => {
    assert.equal(calculateGDPGap(20, 20), 0);
  });

  it('+2.5% and -2.5%', () => {
    assert.equal(calculateGDPGap(20.5, 20), 2.5);
    assert.equal(calculateGDPGap(19.5, 20), -2.5);
  });

  it('magnitude mix → -10%', () => {
    const a = toBaseUnits(18, 'trillions');
    const p = toBaseUnits(20_000, 'billions');
    assert.equal(calculateGDPGap(a, p), -10);
  });

  it('actual from potential and gap', () => {
    assert.equal(calculateActualGDP(20, -10), 18);
  });

  it('potential from actual and gap', () => {
    assert.equal(calculatePotentialGDP(22, 10), 20);
  });

  it('rejects gap ≤ -100% for reverse', () => {
    assert.throws(() => calculateActualGDP(20, -100));
    assert.throws(() => calculatePotentialGDP(20, -100));
    assert.throws(() => calculateActualGDP(20, -101));
  });

  it('rejects zero potential', () => {
    assert.throws(() => calculateGDPGap(10, 0));
  });

  it('rejects negative actual', () => {
    assert.throws(() => calculateGDPGap(-10, 20));
  });
});

describe('validateGdpGapInput', () => {
  it('empty invalid', () => {
    assert.equal(validateGdpGapInput(createEmptyInput()).isValid, false);
    assert.equal(validateGdpGapInput(createDefaultInput()).isValid, false);
  });

  it('example → -10%', () => {
    const v = validateGdpGapInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result.gapPercent, -10);
    assert.equal(v.result.statusTitle, 'Negative Output Gap');
  });

  it('positive gap example', () => {
    const input = createExampleInput();
    input.actualGdp = '22';
    const v = validateGdpGapInput(input);
    assert.equal(v.result?.gapPercent, 10);
  });

  it('actual mode', () => {
    const input = createEmptyInput('actual');
    input.potentialGdp = '20';
    input.gapPercent = '-10';
    const v = validateGdpGapInput(input);
    assert.equal(v.isValid, true);
    assert.equal(v.result?.actualBase, toBaseUnits(18, 'trillions'));
  });

  it('potential mode', () => {
    const input = createEmptyInput('potential');
    input.actualGdp = '22';
    input.gapPercent = '10';
    const v = validateGdpGapInput(input);
    assert.equal(v.isValid, true);
    assert.equal(v.result?.potentialBase, toBaseUnits(20, 'trillions'));
  });

  it('gap -100 rejected in actual mode', () => {
    const input = createEmptyInput('actual');
    input.potentialGdp = '20';
    input.gapPercent = '-100';
    assert.equal(validateGdpGapInput(input).isValid, false);
  });

  it('zero potential rejected', () => {
    const input = createExampleInput();
    input.potentialGdp = '0';
    assert.equal(validateGdpGapInput(input).isValid, false);
  });
});
