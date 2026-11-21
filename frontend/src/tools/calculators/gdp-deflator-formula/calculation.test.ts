import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateDeflatorInflation,
  calculateGDPDeflator,
  calculateNominalGDP,
  calculateRealGDP,
  toBaseUnits,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
} from './types';
import { validateGdpDeflatorInput } from './validation';

describe('GDP deflator formulas', () => {
  it('basic deflator 25/20 → 125', () => {
    assert.equal(calculateGDPDeflator(25, 20), 125);
  });

  it('equal GDP → 100', () => {
    assert.equal(calculateGDPDeflator(100, 100), 100);
  });

  it('lower nominal → 90', () => {
    assert.equal(calculateGDPDeflator(90, 100), 90);
  });

  it('nominal from real and deflator', () => {
    assert.equal(calculateNominalGDP(20, 125), 25);
  });

  it('real from nominal and deflator', () => {
    assert.equal(calculateRealGDP(25, 125), 20);
  });

  it('different magnitudes → 125', () => {
    const n = toBaseUnits(25, 'trillions');
    const r = toBaseUnits(20_000, 'billions');
    assert.equal(calculateGDPDeflator(n, r), 125);
  });

  it('inflation 120 → 126 = 5%', () => {
    assert.equal(calculateDeflatorInflation(120, 126), 5);
  });

  it('rejects zero real GDP', () => {
    assert.throws(() => calculateGDPDeflator(25, 0));
  });

  it('rejects negative nominal', () => {
    assert.throws(() => calculateGDPDeflator(-25, 20));
  });

  it('rejects zero deflator for real GDP', () => {
    assert.throws(() => calculateRealGDP(25, 0));
  });
});

describe('validateGdpDeflatorInput', () => {
  it('empty → invalid', () => {
    assert.equal(validateGdpDeflatorInput(createEmptyInput()).isValid, false);
    assert.equal(validateGdpDeflatorInput(createDefaultInput()).isValid, false);
  });

  it('example → 125', () => {
    const v = validateGdpDeflatorInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result.deflator, 125);
    assert.ok(v.result.priceLevelInterpretation.includes('25'));
    assert.equal(v.result.inflationRate, 5);
  });

  it('magnitude mix via validation', () => {
    const input = createExampleInput();
    input.nominalGdp = '25';
    input.nominalMagnitude = 'trillions';
    input.realGdp = '20000';
    input.realMagnitude = 'billions';
    const v = validateGdpDeflatorInput(input);
    assert.equal(v.isValid, true);
    assert.equal(v.result?.deflator, 125);
  });

  it('nominal mode', () => {
    const input = createEmptyInput('nominal');
    input.realGdp = '20';
    input.realMagnitude = 'trillions';
    input.deflator = '125';
    const v = validateGdpDeflatorInput(input);
    assert.equal(v.isValid, true);
    assert.equal(v.result?.nominalBase, toBaseUnits(25, 'trillions'));
  });

  it('real mode', () => {
    const input = createEmptyInput('real');
    input.nominalGdp = '25';
    input.nominalMagnitude = 'trillions';
    input.deflator = '125';
    const v = validateGdpDeflatorInput(input);
    assert.equal(v.isValid, true);
    assert.equal(v.result?.realBase, toBaseUnits(20, 'trillions'));
  });

  it('zero real rejected', () => {
    const input = createExampleInput();
    input.realGdp = '0';
    assert.equal(validateGdpDeflatorInput(input).isValid, false);
  });

  it('negative nominal rejected', () => {
    const input = createExampleInput();
    input.nominalGdp = '-25';
    assert.equal(validateGdpDeflatorInput(input).isValid, false);
  });

  it('zero deflator in real mode rejected', () => {
    const input = createEmptyInput('real');
    input.nominalGdp = '25';
    input.deflator = '0';
    assert.equal(validateGdpDeflatorInput(input).isValid, false);
  });
});
