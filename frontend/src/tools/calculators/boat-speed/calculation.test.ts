import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  calculateBoatDisplacement,
  calculateBoatSpeed,
  calculateBoatSpeedFromInput,
  calculateCrouchConstant,
  calculateRequiredHorsepower,
  convertDisplacement,
  convertPower,
  convertSpeed,
  generateHorsepowerSpeedData,
  MPH_TO_KMH,
  MPH_TO_KNOTS,
} from './calculation';
import { createEmptyInput, createExampleInput, getBoatTypeCoefficient } from './types';
import { validateBoatSpeedInputs } from './validation';

function approx(actual: number | null | undefined, expected: number, tol = 0.05) {
  assert.ok(actual != null, `expected ${expected}, got null`);
  assert.ok(
    Math.abs(actual! - expected) <= tol,
    `expected ~${expected}, got ${actual}`,
  );
}

describe('Boat Speed Calculator engine', () => {
  it('standard: 3000 hp, 6000 lb, C=150 → ≈106.07 mph', () => {
    approx(calculateBoatSpeed(3000, 6000, 150), 150 * Math.sqrt(0.5), 0.01);
    approx(calculateBoatSpeed(3000, 6000, 150), 106.066017, 0.01);
  });

  it('double horsepower multiplies speed by √2', () => {
    const a = calculateBoatSpeed(3000, 6000, 150)!;
    const b = calculateBoatSpeed(6000, 6000, 150)!;
    approx(b / a, Math.SQRT2, 1e-9);
  });

  it('double displacement divides speed by √2', () => {
    const a = calculateBoatSpeed(3000, 6000, 150)!;
    const b = calculateBoatSpeed(3000, 12000, 150)!;
    approx(a / b, Math.SQRT2, 1e-9);
  });

  it('reverse horsepower ≈ 3000', () => {
    const s = 150 * Math.sqrt(0.5);
    approx(calculateRequiredHorsepower(s, 6000, 150), 3000, 0.05);
  });

  it('reverse displacement ≈ 6000', () => {
    const s = 150 * Math.sqrt(0.5);
    approx(calculateBoatDisplacement(3000, s, 150), 6000, 0.05);
  });

  it('calculate Crouch constant ≈ 150', () => {
    const s = 150 * Math.sqrt(0.5);
    approx(calculateCrouchConstant(3000, 6000, s), 150, 0.05);
  });

  it('convert mph to km/h', () => {
    approx(convertSpeed(100, 'mph', 'kmh'), 100 * MPH_TO_KMH, 1e-9);
  });

  it('convert mph to knots', () => {
    approx(convertSpeed(100, 'mph', 'knots'), 100 * MPH_TO_KNOTS, 1e-6);
  });

  it('convert hp to kW', () => {
    approx(convertPower(100, 'hp', 'kW'), 74.5699872, 0.001);
  });

  it('convert pounds to kilograms', () => {
    approx(convertDisplacement(1000, 'lb', 'kg'), 453.59237, 1e-5);
  });

  it('unit round-trip preserves quantity', () => {
    const hp = convertPower(convertPower(2500, 'hp', 'kW'), 'kW', 'hp');
    approx(hp, 2500, 1e-9);
    const lb = convertDisplacement(convertDisplacement(8000, 'lb', 'kg'), 'kg', 'lb');
    approx(lb, 8000, 1e-6);
    const mph = convertSpeed(convertSpeed(90, 'mph', 'knots'), 'knots', 'mph');
    approx(mph, 90, 1e-9);
  });

  it('example input yields ~106.07 mph', () => {
    const r = calculateBoatSpeedFromInput(createExampleInput())!;
    approx(r.speedMph, 106.066, 0.02);
    assert.equal(r.mode, 'speed');
  });

  it('boat type coefficients', () => {
    assert.equal(getBoatTypeCoefficient('cruiser'), 150);
    assert.equal(getBoatTypeCoefficient('racing'), 210);
    assert.equal(getBoatTypeCoefficient('hydroplane'), 220);
    assert.equal(getBoatTypeCoefficient('custom'), null);
  });

  it('zero displacement → validation error', () => {
    const v = validateBoatSpeedInputs({
      ...createExampleInput(),
      displacement: '0',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.displacement);
  });

  it('negative horsepower → validation error', () => {
    const v = validateBoatSpeedInputs({
      ...createExampleInput(),
      horsepower: '-100',
    });
    assert.equal(v.isValid, false);
  });

  it('zero Crouch constant → validation error', () => {
    const v = validateBoatSpeedInputs({
      ...createExampleInput(),
      crouchConstant: '0',
    });
    assert.equal(v.isValid, false);
  });

  it('empty form yields no result', () => {
    assert.equal(validateBoatSpeedInputs(createEmptyInput()).result, null);
  });

  it('reverse horsepower mode recovers ~3000 hp', () => {
    const s = 150 * Math.sqrt(0.5);
    const r = calculateBoatSpeedFromInput({
      ...createExampleInput(),
      mode: 'horsepower',
      horsepower: '',
      speed: String(s),
      speedUnit: 'mph',
    })!;
    approx(r.horsepowerHp, 3000, 0.1);
  });

  it('comparison series has 6 points', () => {
    const pts = generateHorsepowerSpeedData(6000, 150);
    assert.equal(pts.length, 6);
    approx(pts[5]!.speedMph, 106.066, 0.02);
  });

  it('kW input converts before Crouch formula', () => {
    const hp = 3000;
    const kW = convertPower(hp, 'hp', 'kW');
    const r = calculateBoatSpeedFromInput({
      ...createExampleInput(),
      horsepower: String(kW),
      horsepowerUnit: 'kW',
    })!;
    approx(r.speedMph, 106.066, 0.05);
  });
});
