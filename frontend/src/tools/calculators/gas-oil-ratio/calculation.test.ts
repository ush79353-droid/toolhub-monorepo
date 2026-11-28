import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateGasOilFromInput,
  calculateGasOilRatio,
  calculateGasRequired,
  calculateOilFromTotalMixture,
  calculateOilPercentageOfGasoline,
  calculateOilPercentageOfMixture,
  calculateOilRequired,
  calculateTotalMixtureVolume,
  fromMilliliters,
  toMilliliters,
} from './calculation';
import {
  createEmptyInput,
  createExampleFiveLiters,
} from './types';
import { validateGasOilInputs } from './validation';

describe('Gas Oil Ratio Calculator engine', () => {
  it('1 L · 50:1 → 20 mL oil', () => {
    assert.equal(calculateOilRequired(1000, 50), 20);
  });

  it('5 L · 50:1 → 100 mL oil', () => {
    assert.equal(calculateOilRequired(5000, 50), 100);
  });

  it('10 L · 50:1 → 200 mL oil', () => {
    assert.equal(calculateOilRequired(10000, 50), 200);
  });

  it('1 L · 40:1 → 25 mL oil', () => {
    assert.equal(calculateOilRequired(1000, 40), 25);
  });

  it('5 L · 40:1 → 125 mL oil', () => {
    assert.equal(calculateOilRequired(5000, 40), 125);
  });

  it('1 L · 32:1 → 31.25 mL oil', () => {
    assert.equal(calculateOilRequired(1000, 32), 31.25);
  });

  it('5 L · 32:1 → 156.25 mL oil', () => {
    assert.equal(calculateOilRequired(5000, 32), 156.25);
  });

  it('1 L · 25:1 → 40 mL oil', () => {
    assert.equal(calculateOilRequired(1000, 25), 40);
  });

  it('5 L · 25:1 → 200 mL oil', () => {
    assert.equal(calculateOilRequired(5000, 25), 200);
  });

  it('100 mL oil · 50:1 → 5 L gas', () => {
    assert.equal(calculateGasRequired(100, 50), 5000);
  });

  it('150 mL oil · 40:1 → 6 L gas', () => {
    assert.equal(calculateGasRequired(150, 40), 6000);
  });

  it('4 L gas · 100 mL oil → 40:1', () => {
    assert.equal(calculateGasOilRatio(4000, 100), 40);
  });

  it('5 L gas · 100 mL oil → 5.1 L mixture', () => {
    assert.equal(calculateTotalMixtureVolume(5000, 100), 5100);
  });

  it('5 L total · 50:1 → ≈98.039 mL oil', () => {
    const oil = calculateOilFromTotalMixture(5000, 50)!;
    assert.ok(Math.abs(oil - 5000 / 51) < 1e-12);
  });

  it('1 US gal · 50:1 → 2.56 US fl oz oil', () => {
    const gasMl = toMilliliters(1, 'galUS');
    const oilMl = calculateOilRequired(gasMl, 50)!;
    assert.ok(Math.abs(fromMilliliters(oilMl, 'flOzUS') - 2.56) < 1e-9);
  });

  it('1 US gal · 40:1 → 3.2 US fl oz oil', () => {
    const gasMl = toMilliliters(1, 'galUS');
    const oilMl = calculateOilRequired(gasMl, 40)!;
    assert.ok(Math.abs(fromMilliliters(oilMl, 'flOzUS') - 3.2) < 1e-9);
  });

  it('1 US gal · 32:1 → 4 US fl oz oil', () => {
    const gasMl = toMilliliters(1, 'galUS');
    const oilMl = calculateOilRequired(gasMl, 32)!;
    assert.ok(Math.abs(fromMilliliters(oilMl, 'flOzUS') - 4) < 1e-9);
  });

  it('1 US gal · 25:1 → 5.12 US fl oz oil', () => {
    const gasMl = toMilliliters(1, 'galUS');
    const oilMl = calculateOilRequired(gasMl, 25)!;
    assert.ok(Math.abs(fromMilliliters(oilMl, 'flOzUS') - 5.12) < 1e-9);
  });

  it('50:1 oil % of mixture and gasoline', () => {
    assert.ok(
      Math.abs(calculateOilPercentageOfMixture(50)! - 100 / 51) < 1e-12,
    );
    assert.equal(calculateOilPercentageOfGasoline(50), 2);
  });

  it('example 5 L · 50:1 → 100 mL', () => {
    const r = calculateGasOilFromInput(createExampleFiveLiters())!;
    assert.equal(r.oilVolumeMl, 100);
    assert.equal(r.gasVolumeMl, 5000);
    assert.equal(r.totalMixtureMl, 5100);
  });

  it('ratio = 0 validation', () => {
    const input = createExampleFiveLiters();
    input.ratio = '0';
    assert.ok(validateGasOilInputs(input).errors.ratio);
  });

  it('negative gas validation', () => {
    const input = createExampleFiveLiters();
    input.gasVolume = '-1';
    assert.ok(validateGasOilInputs(input).errors.gasVolume);
  });

  it('negative oil validation', () => {
    const input = createEmptyInput();
    input.mode = 'calculateGas';
    input.oilVolume = '-1';
    assert.ok(validateGasOilInputs(input).errors.oilVolume);
  });

  it('missing gas → no result', () => {
    const v = validateGasOilInputs(createEmptyInput());
    assert.equal(v.result, null);
  });

  it('calculate ratio mode 4 L / 100 mL', () => {
    const input = createEmptyInput();
    input.mode = 'calculateRatio';
    input.gasVolume = '4';
    input.gasUnit = 'L';
    input.oilVolume = '100';
    input.oilUnit = 'mL';
    const r = calculateGasOilFromInput(input)!;
    assert.equal(r.ratio, 40);
  });

  it('unit convert L ↔ mL', () => {
    assert.equal(toMilliliters(5, 'L'), 5000);
    assert.equal(fromMilliliters(5000, 'L'), 5);
  });
});
