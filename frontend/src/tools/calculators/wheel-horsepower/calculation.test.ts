import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateCombinedDrivetrainEfficiency,
  calculateDrivetrainLossPercentage,
  calculateDrivetrainPowerLoss,
  calculateEngineHorsepower,
  calculateWheelHorsepower,
  convertPowerToHorsepower,
  computeWheelHorsepower,
} from './calculation';
import { createEmptyInput } from './types';
import { validateWheelHorsepowerInputs } from './validation';

function approx(actual: number, expected: number, tol = 1e-6) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`,
  );
}

describe('Wheel Horsepower Calculator engine', () => {
  it('300 hp × 0.85 → 255 WHP', () => {
    approx(calculateWheelHorsepower(300, 0.85), 255);
  });

  it('255 WHP / 0.85 → 300 hp', () => {
    approx(calculateEngineHorsepower(255, 0.85), 300);
  });

  it('loss 300 − 255 → 45', () => {
    approx(calculateDrivetrainPowerLoss(300, 255), 45);
  });

  it('loss% at 85% η → 15%', () => {
    approx(calculateDrivetrainLossPercentage(0.85), 15);
  });

  it('component η 97×98×95×99 → 89.40393%', () => {
    const eta = calculateCombinedDrivetrainEfficiency([
      0.97, 0.98, 0.95, 0.99,
    ]);
    approx(eta, 0.8940393, 1e-9);
  });

  it('300 hp × component η → ≈ 268.21 WHP', () => {
    const eta = 0.97 * 0.98 * 0.95 * 0.99;
    approx(calculateWheelHorsepower(300, eta), 268.21179, 1e-4);
  });

  it('100 kW → ≈ 134.10 hp', () => {
    approx(convertPowerToHorsepower(100, 'kW'), 134.102, 0.01);
  });

  it('default fixture validates → 255 WHP', () => {
    const v = validateWheelHorsepowerInputs(createEmptyInput());
    assert.equal(Object.keys(v.errors).length, 0);
    assert.ok(v.result);
    approx(v.result!.wheelHorsepowerHp, 255);
  });

  it('0% efficiency invalid', () => {
    const v = validateWheelHorsepowerInputs({
      ...createEmptyInput(),
      overallEfficiency: '0',
    });
    assert.ok(v.errors.overallEfficiency);
  });

  it('110% efficiency invalid', () => {
    const v = validateWheelHorsepowerInputs({
      ...createEmptyInput(),
      overallEfficiency: '110',
    });
    assert.ok(v.errors.overallEfficiency);
  });

  it('negative hp invalid', () => {
    const v = validateWheelHorsepowerInputs({
      ...createEmptyInput(),
      engineHorsepower: '-250',
    });
    assert.ok(v.errors.engineHorsepower);
  });

  it('component mode matches product', () => {
    const r = computeWheelHorsepower({
      mode: 'engine-to-wheel',
      efficiencyMode: 'components',
      enginePower: 300,
      wheelPower: null,
      powerUnit: 'hp',
      overallEfficiencyPercent: null,
      gearboxPercent: 97,
      propellerPercent: 98,
      differentialPercent: 95,
      driveshaftPercent: 99,
      includePropellerShaft: true,
    });
    approx(r.overallEfficiencyPercent, 89.40393, 1e-4);
    approx(r.wheelHorsepowerHp, 268.21179, 1e-4);
  });

  it('blank → no result', () => {
    const v = validateWheelHorsepowerInputs({
      ...createEmptyInput(),
      engineHorsepower: '',
    });
    assert.equal(v.result, null);
  });
});
