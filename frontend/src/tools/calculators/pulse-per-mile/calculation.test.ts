import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculatePulsesPerMile,
  calculatePulsesPerMileCombined,
  calculateSensorFrequencyHz,
  calculateWheelRotationsPerMile,
  convertTireDiameter,
  toInches,
} from './calculation';
import { createEmptyInput } from './types';
import { validatePulsePerMileInputs } from './validation';

const approx = (actual: number, expected: number, tol = 0.6) => {
  assert.ok(
    Math.abs(actual - expected) < tol,
    `expected ≈ ${expected}, got ${actual}`,
  );
};

describe('Pulse per Mile Calculator engine', () => {
  it('20 in → WRM ≈ 1008.4', () => {
    approx(calculateWheelRotationsPerMile(20), 1008.4, 0.2);
  });
  it('24 in → WRM ≈ 840.3', () => {
    approx(calculateWheelRotationsPerMile(24), 840.3, 0.2);
  });
  it('26 in → WRM ≈ 775.7', () => {
    approx(calculateWheelRotationsPerMile(26), 775.7, 0.2);
  });
  it('30 in → WRM ≈ 672.3', () => {
    approx(calculateWheelRotationsPerMile(30), 672.3, 0.2);
  });
  it('32 in → WRM ≈ 630.3', () => {
    approx(calculateWheelRotationsPerMile(32), 630.3, 0.2);
  });

  it('3.42 × 20 × 26 in → PPM ≈ 53058', () => {
    const wrm = calculateWheelRotationsPerMile(26);
    const ppm = calculatePulsesPerMile(wrm, 3.42, 20);
    approx(ppm, 53058, 1);
    approx(calculatePulsesPerMileCombined(3.42, 20, 26), ppm, 1e-9);
  });

  it('4.10 × 40 × 30 in → PPM ≈ 110261', () => {
    approx(calculatePulsesPerMileCombined(4.1, 40, 30), 110261, 15);
  });

  it('3.73 × 20 × 28 in → PPM ≈ 53739', () => {
    approx(calculatePulsesPerMileCombined(3.73, 20, 28), 53739, 15);
  });

  it('3.08 × 16 × 24 in → PPM ≈ 41407', () => {
    approx(calculatePulsesPerMileCombined(3.08, 16, 24), 41407, 15);
  });

  it('26 in = 66.04 cm', () => {
    approx(convertTireDiameter(26, 'in', 'cm'), 66.04, 1e-9);
  });

  it('26 in = 660.4 mm', () => {
    approx(convertTireDiameter(26, 'in', 'mm'), 660.4, 1e-9);
  });

  it('1 ft = 12 in', () => {
    assert.equal(toInches(1, 'ft'), 12);
  });

  it('round-trip in → cm → in', () => {
    const back = convertTireDiameter(
      convertTireDiameter(26, 'in', 'cm'),
      'cm',
      'in',
    );
    approx(back, 26, 1e-12);
  });

  it('equivalent diameter units → same PPM', () => {
    const a = calculatePulsesPerMileCombined(3.42, 20, 26);
    const cm = convertTireDiameter(26, 'in', 'cm');
    const b = calculatePulsesPerMileCombined(
      3.42,
      20,
      toInches(cm, 'cm'),
    );
    approx(a, b, 1e-9);
  });

  it('default fixture validates', () => {
    const v = validatePulsePerMileInputs(createEmptyInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    approx(v.result!.wheelRotationsPerMile, 775.7, 0.2);
    approx(v.result!.pulsesPerMile, 53058, 1);
  });

  it('negative axle ratio invalid', () => {
    const v = validatePulsePerMileInputs({
      ...createEmptyInput(),
      axleRatio: '-1',
    });
    assert.ok(v.errors.axleRatio);
    assert.equal(v.result, null);
  });

  it('zero tire diameter invalid', () => {
    const v = validatePulsePerMileInputs({
      ...createEmptyInput(),
      tireDiameter: '0',
    });
    assert.ok(v.errors.tireDiameter);
    assert.equal(v.result, null);
  });

  it('decimal reluctor teeth invalid', () => {
    const v = validatePulsePerMileInputs({
      ...createEmptyInput(),
      reluctorTeeth: '20.5',
    });
    assert.ok(v.errors.reluctorTeeth);
    assert.equal(v.result, null);
  });

  it('empty inputs → no result', () => {
    const v = validatePulsePerMileInputs({
      ...createEmptyInput(),
      axleRatio: '',
      reluctorTeeth: '',
      tireDiameter: '',
    });
    assert.equal(v.result, null);
  });

  it('sensor frequency 40000 PPM at 60 mph → 666.67 Hz', () => {
    approx(calculateSensorFrequencyHz(40_000, 60), 666.6666667, 1e-6);
  });
});
