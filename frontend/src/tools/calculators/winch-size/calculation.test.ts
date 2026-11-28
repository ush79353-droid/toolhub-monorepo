import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateRollingResistance,
  calculateSlopeResistance,
  calculateWeightBasedWinchGuideline,
  calculateWeightForce,
  convertSlopeToDegrees,
  convertWeightToKg,
  convertKgToWeight,
  computeWinchSize,
  convertNewtonsToKilonewtons,
  convertNewtonsToPoundsForce,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateWinchSizeInputs } from './validation';

function approx(actual: number, expected: number, tol = 1e-2) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Winch Size Calculator engine', () => {
  it('flat hard ground 2000 kg · 0.02 · 0° · SF1.5', () => {
    const Fr = calculateRollingResistance(2000, 0.02, 0);
    const Fs = calculateSlopeResistance(2000, 0);
    approx(Fr, 392.266, 1e-3);
    approx(Fs, 0);
    const adj = (Fr + Fs) * 1.5;
    approx(adj, 588.399, 1e-3);
  });

  it('muddy incline ≈ 10.17 kN · adj ≈ 15.25 kN', () => {
    const r = computeWinchSize({
      calculationMode: 'vehicle-recovery',
      massKg: 2000,
      resistanceCoefficient: 0.35,
      slopeDegrees: 10,
      safetyFactor: 1.5,
      resultUnit: 'lbf',
      linePullPercent: 100,
      lineMultiplier: 1,
    });
    approx(convertNewtonsToKilonewtons(r.totalPullingForceN), 10.1663, 0.02);
    approx(convertNewtonsToKilonewtons(r.adjustedPullingForceN), 15.2495, 0.03);
    approx(convertNewtonsToPoundsForce(r.adjustedPullingForceN), 3428, 5);
  });

  it('weight guideline 2000 kg × 1.5 ≈ 6614 lbf', () => {
    approx(calculateWeightBasedWinchGuideline(2000, 1.5), 6613.87, 0.5);
  });

  it('Fg for 2000 kg', () => {
    approx(calculateWeightForce(2000), 19613.3, 0.1);
  });

  it('1000 kg → ≈ 2204.62 lb', () => {
    approx(convertKgToWeight(1000, 'lb'), 2204.6226218, 1e-6);
  });

  it('0° slope → Fs = 0', () => {
    approx(calculateSlopeResistance(2000, 0), 0);
  });

  it('10% grade → ≈ 5.7106°', () => {
    approx(convertSlopeToDegrees(10, 'percent'), 5.710593137, 1e-6);
  });

  it('default fixture validates', () => {
    const v = validateWinchSizeInputs(createEmptyInput());
    assert.ok(v.result);
    approx(convertNewtonsToKilonewtons(v.result!.totalPullingForceN), 10.17, 0.05);
  });

  it('zero weight invalid', () => {
    const v = validateWinchSizeInputs({ ...createEmptyInput(), weight: '0' });
    assert.ok(v.errors.weight);
    assert.equal(v.result, null);
  });

  it('negative weight invalid', () => {
    const v = validateWinchSizeInputs({
      ...createEmptyInput(),
      weight: '-500',
    });
    assert.ok(v.errors.weight);
    assert.equal(v.result, null);
  });

  it('negative resistance invalid', () => {
    const v = validateWinchSizeInputs({
      ...createEmptyInput(),
      resistanceCoefficient: '-0.1',
    });
    assert.ok(v.errors.resistanceCoefficient);
    assert.equal(v.result, null);
  });

  it('blank → no result', () => {
    const v = validateWinchSizeInputs(createBlankInput());
    assert.equal(v.result, null);
  });

  it('lb weight converts to kg', () => {
    approx(convertWeightToKg(4409.245, 'lb'), 2000, 0.01);
  });
});
