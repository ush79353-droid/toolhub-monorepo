import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateDrivetrainRatio,
  calculateEngineRPM,
  calculateTireCircumference,
  calculateWheelRPMFromEngine,
  convertSpeed,
  convertTireDiameter,
  engineRpmFromMph,
  mphFromWheel,
  rpmToRps,
  solveRPMCalculator,
  toMeters,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateRpmInputs } from './validation';

const approx = (actual: number, expected: number, tol = 0.05) => {
  assert.ok(
    Math.abs(actual - expected) < tol,
    `expected ≈ ${expected}, got ${actual}`,
  );
};

describe('RPM Calculator engine', () => {
  it('3000 / 4 → 750 wheel RPM', () => {
    assert.equal(calculateWheelRPMFromEngine(3000, 4), 750);
  });
  it('2400 / 3 → 800', () => {
    assert.equal(calculateWheelRPMFromEngine(2400, 3), 800);
  });
  it('3600 / 4.5 → 800', () => {
    assert.equal(calculateWheelRPMFromEngine(3600, 4.5), 800);
  });
  it('2000 / 2.5 → 800', () => {
    assert.equal(calculateWheelRPMFromEngine(2000, 2.5), 800);
  });
  it('1200 / 1.5 → 800', () => {
    assert.equal(calculateWheelRPMFromEngine(1200, 1.5), 800);
  });

  it('750 × 4 → 3000 engine RPM', () => {
    assert.equal(calculateEngineRPM(750, 4), 3000);
  });
  it('800 × 3 → 2400', () => {
    assert.equal(calculateEngineRPM(800, 3), 2400);
  });
  it('900 × 3.5 → 3150', () => {
    assert.equal(calculateEngineRPM(900, 3.5), 3150);
  });
  it('1000 × 4 → 4000', () => {
    assert.equal(calculateEngineRPM(1000, 4), 4000);
  });

  it('3200 / 800 → ratio 4', () => {
    assert.equal(calculateDrivetrainRatio(3200, 800), 4);
  });

  it('26 in circumference ≈ 81.68 in', () => {
    approx(calculateTireCircumference(toMeters(26, 'in')) / 0.0254, 81.68, 0.02);
  });
  it('20 in circumference ≈ 62.83 in', () => {
    approx(calculateTireCircumference(toMeters(20, 'in')) / 0.0254, 62.83, 0.02);
  });
  it('24 in circumference ≈ 75.40 in', () => {
    approx(calculateTireCircumference(toMeters(24, 'in')) / 0.0254, 75.4, 0.02);
  });
  it('30 in circumference ≈ 94.25 in', () => {
    approx(calculateTireCircumference(toMeters(30, 'in')) / 0.0254, 94.25, 0.02);
  });

  it('750 WRPM × 26 in → ≈ 58.01 mph', () => {
    approx(mphFromWheel(750, 26), 58.01, 0.02);
  });
  it('800 WRPM × 26 in → ≈ 61.88 mph', () => {
    approx(mphFromWheel(800, 26), 61.88, 0.02);
  });
  it('1000 WRPM × 30 in → ≈ 89.25 mph', () => {
    approx(mphFromWheel(1000, 30), 89.25, 0.05);
  });

  it('60 mph · 26 in · 3.73 → ≈ 2894 ERPM', () => {
    approx(engineRpmFromMph(60, 26, 3.73), 2894, 1);
  });

  it('60 mph = 96.56064 km/h', () => {
    approx(convertSpeed(60, 'mph', 'km/h'), 96.56064, 1e-9);
  });
  it('100 km/h ≈ 62.1371 mph', () => {
    approx(convertSpeed(100, 'km/h', 'mph'), 62.1371, 0.001);
  });
  it('26 in = 66.04 cm', () => {
    approx(convertTireDiameter(26, 'in', 'cm'), 66.04, 1e-9);
  });
  it('26 in = 0.6604 m', () => {
    approx(convertTireDiameter(26, 'in', 'm'), 0.6604, 1e-9);
  });
  it('3600 RPM = 60 RPS', () => {
    assert.equal(rpmToRps(3600), 60);
  });

  it('solver: E+R+D → W and V', () => {
    const { solved, inconsistent } = solveRPMCalculator({
      engineRPM: 3000,
      drivetrainRatio: 4,
      wheelRPM: null,
      tireDiameterMeters: toMeters(26, 'in'),
      vehicleSpeedMps: null,
    });
    assert.equal(inconsistent, false);
    assert.equal(solved.wheelRPM, 750);
    assert.ok(solved.vehicleSpeedMps != null);
    approx(mphFromWheel(solved.wheelRPM!, 26), 58.01, 0.02);
  });

  it('default fixture validates', () => {
    const v = validateRpmInputs(createEmptyInput());
    assert.ok(v.result);
    assert.equal(v.result!.inconsistent, false);
    approx(v.result!.wheelRPM!, 750, 1e-9);
    approx(v.result!.vehicleSpeedDisplay!, 93.36, 0.05);
  });

  it('conflicting E/R/W flagged', () => {
    const v = validateRpmInputs({
      ...createBlankInput(),
      engineRPM: '3000',
      drivetrainRatio: '4',
      wheelRPM: '900',
    });
    assert.ok(v.result?.inconsistent || v.errors.form);
  });

  it('negative engine RPM invalid', () => {
    const v = validateRpmInputs({
      ...createEmptyInput(),
      engineRPM: '-10',
    });
    assert.ok(v.errors.engineRPM);
  });

  it('zero ratio invalid', () => {
    const v = validateRpmInputs({
      ...createEmptyInput(),
      drivetrainRatio: '0',
    });
    assert.ok(v.errors.drivetrainRatio);
  });

  it('blank inputs → no result', () => {
    const v = validateRpmInputs(createBlankInput());
    assert.equal(v.result, null);
  });
});
