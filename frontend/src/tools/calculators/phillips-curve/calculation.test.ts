import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateNewClassicalInflation,
  calculateNewClassicalUnemployment,
  calculateNewKeynesianInflation,
  calculateTraditionalPhillipsCurve,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
} from './types';
import { validatePhillipsCurveInput } from './validation';

describe('phillips math', () => {
  it('traditional wage growth 3.5%', () => {
    assert.equal(calculateTraditionalPhillipsCurve(4, 1, 0.5), 3.5);
  });

  it('new classical inflation 2.5%', () => {
    assert.equal(
      calculateNewClassicalInflation({
        expectedInflation: 3,
        unemploymentRate: 6,
        naturalUnemploymentRate: 5,
        slope: 0.5,
        supplyShock: 0,
      }),
      2.5
    );
  });

  it('new classical positive supply shock → 4%', () => {
    assert.equal(
      calculateNewClassicalInflation({
        expectedInflation: 3,
        unemploymentRate: 5,
        naturalUnemploymentRate: 5,
        slope: 0.5,
        supplyShock: 1,
      }),
      4
    );
  });

  it('new keynesian inflation 3.97%', () => {
    const pi = calculateNewKeynesianInflation({
      expectedInflation: 3,
      discountFactor: 0.99,
      outputGap: 2,
      slope: 0.25,
      supplyShock: 0.5,
    });
    assert.ok(pi != null && Math.abs(pi - 3.97) < 1e-10);
  });

  it('new classical inverse unemployment 6%', () => {
    assert.equal(
      calculateNewClassicalUnemployment({
        inflation: 2.5,
        expectedInflation: 3,
        naturalUnemploymentRate: 5,
        slope: 0.5,
        supplyShock: 0,
      }),
      6
    );
  });

  it('zero slope blocked', () => {
    assert.equal(calculateTraditionalPhillipsCurve(4, 1, 0), null);
    assert.equal(
      calculateNewClassicalInflation({
        expectedInflation: 3,
        unemploymentRate: 6,
        naturalUnemploymentRate: 5,
        slope: 0,
      }),
      null
    );
  });

  it('accepts negative inflation', () => {
    assert.equal(
      calculateNewClassicalInflation({
        expectedInflation: -1,
        unemploymentRate: 5,
        naturalUnemploymentRate: 5,
        slope: 0.5,
        supplyShock: 0,
      }),
      -1
    );
  });

  it('accepts negative output gap', () => {
    assert.equal(
      calculateNewKeynesianInflation({
        expectedInflation: 2,
        discountFactor: 1,
        outputGap: -2,
        slope: 0.5,
        supplyShock: 0,
      }),
      1
    );
  });
});

describe('validatePhillipsCurveInput', () => {
  it('empty invalid', () => {
    assert.equal(validatePhillipsCurveInput(createEmptyInput()).isValid, false);
    assert.equal(
      validatePhillipsCurveInput(createDefaultInput()).isValid,
      false
    );
  });

  it('traditional example → 3.5%', () => {
    const v = validatePhillipsCurveInput(createExampleInput('traditional'));
    assert.equal(v.isValid, true);
    assert.equal(v.result?.primaryValue, 3.5);
  });

  it('new classical example → 2.5%', () => {
    const v = validatePhillipsCurveInput(createExampleInput('new-classical'));
    assert.equal(v.isValid, true);
    assert.equal(v.result?.primaryValue, 2.5);
  });

  it('new keynesian example → 3.97%', () => {
    const v = validatePhillipsCurveInput(createExampleInput('new-keynesian'));
    assert.equal(v.isValid, true);
    assert.ok(
      v.result != null && Math.abs(v.result.primaryValue - 3.97) < 1e-10
    );
  });

  it('rejects zero slope', () => {
    const v = validatePhillipsCurveInput({
      ...createExampleInput('new-classical'),
      classicalSlope: '0',
    });
    assert.equal(v.isValid, false);
  });

  it('rejects unemployment > 100', () => {
    const v = validatePhillipsCurveInput({
      ...createExampleInput('new-classical'),
      unemploymentRate: '120',
    });
    assert.equal(v.isValid, false);
  });

  it('rejects discount factor > 1', () => {
    const v = validatePhillipsCurveInput({
      ...createExampleInput('new-keynesian'),
      discountFactor: '1.1',
    });
    assert.equal(v.isValid, false);
  });
});
