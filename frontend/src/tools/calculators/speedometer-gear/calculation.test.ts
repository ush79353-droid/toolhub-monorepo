import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateDrivenGearTeeth,
  calculateTireRevolutionsPerMile,
  convertTireDiameter,
  roundDrivenGearTeeth,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateSpeedometerGearInputs } from './validation';

const approx = (actual: number, expected: number, tol = 0.02) => {
  assert.ok(
    Math.abs(actual - expected) < tol,
    `expected ≈ ${expected}, got ${actual}`,
  );
};

describe('Speedometer Gear Calculator engine', () => {
  it('28 in → ≈720.29 rev/mi', () => {
    approx(calculateTireRevolutionsPerMile(28), 720.29, 0.01);
  });
  it('30 in → ≈672.27 rev/mi', () => {
    approx(calculateTireRevolutionsPerMile(30), 672.27, 0.01);
  });
  it('32 in → 630.25 rev/mi', () => {
    approx(calculateTireRevolutionsPerMile(32), 630.25, 0.01);
  });
  it('35 in → ≈576.23 rev/mi', () => {
    approx(calculateTireRevolutionsPerMile(35), 576.23, 0.01);
  });

  it('30 in · 3.73 · 8 → recommend 20', () => {
    const r = calculateTireRevolutionsPerMile(30);
    const td = calculateDrivenGearTeeth(3.73, r, 8, 1000);
    approx(td, 20.06, 0.02);
    assert.equal(roundDrivenGearTeeth(td), 20);
  });

  it('30 in · 4.10 · 8 → recommend 22', () => {
    const r = calculateTireRevolutionsPerMile(30);
    const td = calculateDrivenGearTeeth(4.1, r, 8, 1000);
    approx(td, 22.05, 0.05);
    assert.equal(roundDrivenGearTeeth(td), 22);
  });

  it('28 in · 3.55 · 8 → recommend 20', () => {
    const r = calculateTireRevolutionsPerMile(28);
    const td = calculateDrivenGearTeeth(3.55, r, 8, 1000);
    approx(td, 20.46, 0.05);
    assert.equal(roundDrivenGearTeeth(td), 20);
  });

  it('32 in · 4.10 · 8 → recommend 21', () => {
    const r = calculateTireRevolutionsPerMile(32);
    const td = calculateDrivenGearTeeth(4.1, r, 8, 1000);
    assert.equal(roundDrivenGearTeeth(td), 21);
  });

  it('25.4 mm = 1 in', () => {
    approx(convertTireDiameter(25.4, 'mm', 'in'), 1, 1e-9);
  });

  it('default fixture validates → 20 teeth', () => {
    const v = validateSpeedometerGearInputs(createEmptyInput());
    assert.ok(v.result);
    assert.equal(v.result!.recommendedDrivenGearTeeth, 20);
    approx(v.result!.theoreticalDrivenGearTeeth, 20.06, 0.02);
  });

  it('negative diameter invalid', () => {
    const v = validateSpeedometerGearInputs({
      ...createEmptyInput(),
      tireDiameter: '-1',
    });
    assert.ok(v.errors.tireDiameter);
  });

  it('fractional driving teeth invalid', () => {
    const v = validateSpeedometerGearInputs({
      ...createEmptyInput(),
      drivingGearTeeth: '8.5',
    });
    assert.ok(v.errors.drivingGearTeeth);
  });

  it('blank → no result', () => {
    const v = validateSpeedometerGearInputs(createBlankInput());
    assert.equal(v.result, null);
  });

  it('manual revolutions override', () => {
    const v = validateSpeedometerGearInputs({
      ...createEmptyInput(),
      useManualRevolutions: true,
      tireRevolutions: '700',
      tireRevolutionUnit: 'rev/mi',
    });
    assert.ok(v.result);
    approx(v.result!.tireRevolutionsPerMile, 700, 1e-9);
  });
});
