import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateGDPDeflator,
  calculateNominalGDP,
  calculateRealGDP,
  calculateRealGDPGrowth,
  toBaseUnits,
} from './calculation';
import { createExampleInput } from './types';
import { validateRealGdpInput } from './validation';

describe('Real GDP calculation', () => {
  it('standard: 25000 / 125 × 100 = 20000', () => {
    assert.equal(calculateRealGDP(25_000, 125), 20_000);
  });

  it('base-year deflator 100: real equals nominal', () => {
    assert.equal(calculateRealGDP(10_000, 100), 10_000);
  });

  it('deflator below 100: 8000 / 80 × 100 = 10000', () => {
    assert.equal(calculateRealGDP(8_000, 80), 10_000);
  });

  it('deflator above 100: 15000 / 150 × 100 = 10000', () => {
    assert.equal(calculateRealGDP(15_000, 150), 10_000);
  });

  it('calculate nominal: 20000 × 125 / 100 = 25000', () => {
    assert.equal(calculateNominalGDP(20_000, 125), 25_000);
  });

  it('calculate deflator: 25000 / 20000 × 100 = 125', () => {
    assert.equal(calculateGDPDeflator(25_000, 20_000), 125);
  });

  it('invalid deflator 0 returns null', () => {
    assert.equal(calculateRealGDP(25_000, 0), null);
  });

  it('negative nominal returns null', () => {
    assert.equal(calculateRealGDP(-1_000, 100), null);
  });

  it('real GDP growth 20000 → 21000 = 5%', () => {
    assert.equal(calculateRealGDPGrowth(20_000, 21_000), 5);
  });

  it('large values in trillions: 30T / 120 × 100 = 25T', () => {
    const nom = toBaseUnits(30, 'trillions');
    const real = calculateRealGDP(nom, 120);
    assert.ok(real != null);
    assert.equal(real / toBaseUnits(1, 'trillions'), 25);
  });

  it('example input validates to 20000 billions real GDP', () => {
    const v = validateRealGdpInput(createExampleInput('real'));
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result!.displayReal, '20,000');
    assert.equal(v.result!.deflator, 125);
  });

  it('zero deflator fails validation', () => {
    const v = validateRealGdpInput({
      ...createExampleInput('real'),
      deflator: '0',
    });
    assert.equal(v.isValid, false);
    assert.match(v.errors.deflator ?? '', /greater than zero/i);
  });

  it('deflator mode from example', () => {
    const v = validateRealGdpInput(createExampleInput('deflator'));
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result!.deflator, 125);
  });

  it('decimal deflator accepted', () => {
    assert.equal(calculateRealGDP(100, 80.5) != null, true);
  });
});
