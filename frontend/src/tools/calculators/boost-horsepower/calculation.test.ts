import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  calculateAdjustedHorsepower,
  calculateBoostHorsepowerFromInput,
  calculateBoostedHorsepower,
  calculateHorsepowerGain,
  calculateOriginalHorsepower,
  calculatePercentageIncrease,
  calculatePressureRatio,
  calculateRequiredBoost,
  convertBoostPressure,
  convertHorsepower,
  generateBoostComparisonData,
  PSI_TO_KPA,
} from './calculation';
import { createEmptyInput, createExampleInput } from './types';
import { validateBoostInputs } from './validation';

function approx(actual: number | null | undefined, expected: number, tol = 0.05) {
  assert.ok(actual != null, `expected ${expected}, got null`);
  assert.ok(
    Math.abs(actual! - expected) <= tol,
    `expected ~${expected}, got ${actual}`,
  );
}

describe('Boost Horsepower Calculator engine', () => {
  it('standard: 200 hp, 6 psi, 14.7 atm → ≈281.63 hp', () => {
    approx(calculateBoostedHorsepower(200, 6, 14.7), 281.63265, 0.01);
  });

  it('zero boost → original horsepower', () => {
    approx(calculateBoostedHorsepower(200, 0, 14.7), 200, 1e-9);
  });

  it('pressure ratio ≈ 1.40816', () => {
    approx(calculatePressureRatio(6, 14.7), 20.7 / 14.7, 1e-9);
  });

  it('horsepower gain ≈ 81.63', () => {
    const boosted = calculateBoostedHorsepower(200, 6, 14.7)!;
    approx(calculateHorsepowerGain(200, boosted), 81.63265, 0.01);
  });

  it('percentage increase ≈ 40.82%', () => {
    const boosted = calculateBoostedHorsepower(200, 6, 14.7)!;
    approx(calculatePercentageIncrease(200, boosted), 40.8163, 0.01);
  });

  it('reverse boost ≈ 6 psi', () => {
    const boosted = calculateBoostedHorsepower(200, 6, 14.7)!;
    approx(calculateRequiredBoost(200, boosted, 14.7), 6, 0.01);
  });

  it('reverse original ≈ 200 hp', () => {
    const boosted = calculateBoostedHorsepower(200, 6, 14.7)!;
    approx(calculateOriginalHorsepower(boosted, 6, 14.7), 200, 0.01);
  });

  it('power conversion 100 hp → ≈74.57 kW', () => {
    approx(convertHorsepower(100, 'hp', 'kW'), 74.5699872, 0.001);
  });

  it('pressure conversion 10 psi → ≈68.95 kPa', () => {
    approx(convertBoostPressure(10, 'psi', 'kPa'), 10 * PSI_TO_KPA, 0.01);
  });

  it('zero original power → 0 boosted', () => {
    approx(calculateBoostedHorsepower(0, 6, 14.7), 0, 1e-9);
  });

  it('negative power → null', () => {
    assert.equal(calculateBoostedHorsepower(-100, 6, 14.7), null);
  });

  it('negative boost → null', () => {
    assert.equal(calculateBoostedHorsepower(200, -6, 14.7), null);
  });

  it('zero atmospheric → null', () => {
    assert.equal(calculateBoostedHorsepower(200, 6, 0), null);
  });

  it('example input ≈ 281.63 hp', () => {
    const r = calculateBoostHorsepowerFromInput(createExampleInput())!;
    approx(r.boostedHorsepowerHp, 281.63, 0.02);
    approx(r.pressureRatio, 1.40816, 0.001);
  });

  it('validation: negative power', () => {
    const v = validateBoostInputs({
      ...createExampleInput(),
      originalHorsepower: '-100',
    });
    assert.equal(v.isValid, false);
  });

  it('validation: negative boost', () => {
    const v = validateBoostInputs({
      ...createExampleInput(),
      boostPressure: '-6',
    });
    assert.equal(v.isValid, false);
  });

  it('validation: zero atmosphere', () => {
    const v = validateBoostInputs({
      ...createExampleInput(),
      atmosphericPressure: '0',
    });
    assert.equal(v.isValid, false);
  });

  it('empty form yields no result', () => {
    assert.equal(validateBoostInputs(createEmptyInput()).result, null);
  });

  it('efficiency-adjusted horsepower', () => {
    const ideal = 281.63265;
    approx(calculateAdjustedHorsepower(200, ideal, 0.8), 200 + 0.8 * (ideal - 200), 0.01);
  });

  it('comparison series has 8 points', () => {
    const pts = generateBoostComparisonData(200, 14.7);
    assert.equal(pts.length, 8);
    approx(pts[0]!.boostedHp, 200, 0.01);
    approx(pts[2]!.boostedHp, 281.63, 0.05);
  });

  it('requiredBoost mode recovers ~6 psi', () => {
    const r = calculateBoostHorsepowerFromInput({
      ...createExampleInput(),
      mode: 'requiredBoost',
      targetHorsepower: '281.632653',
      targetHorsepowerUnit: 'hp',
    })!;
    approx(r.boostPressurePsi, 6, 0.02);
  });

  it('unit round-trips', () => {
    approx(
      convertHorsepower(convertHorsepower(250, 'hp', 'kW'), 'kW', 'hp'),
      250,
      1e-9,
    );
    approx(
      convertBoostPressure(convertBoostPressure(12, 'psi', 'bar'), 'bar', 'psi'),
      12,
      1e-6,
    );
  });
});
