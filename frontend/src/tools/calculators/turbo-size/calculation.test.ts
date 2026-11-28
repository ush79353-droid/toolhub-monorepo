import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateCompressorPressureRatio,
  calculateEngineVolumetricAirflow,
  calculateRequiredTurboAirflow,
  convertAirflowLbMinToKgMin,
  convertCapacityToLiters,
  convertPowerToHorsepower,
  computeTurboSize,
} from './calculation';
import { createEmptyInput } from './types';
import { validateTurboSizeInputs } from './validation';

function approx(actual: number, expected: number, tol = 1e-6) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`,
  );
}

describe('Turbo Size Calculator engine', () => {
  it('400 hp / 10 → 40 lb/min', () => {
    approx(calculateRequiredTurboAirflow(400, 10), 40);
  });

  it('40 lb/min → ≈ 18.1437 kg/min', () => {
    approx(convertAirflowLbMinToKgMin(40), 18.1436948, 1e-6);
  });

  it('400 hp / 2 L → 200 hp/L', () => {
    const r = computeTurboSize(
      {
        capacity: 2,
        capacityUnit: 'L',
        power: 400,
        powerUnit: 'hp',
        hpPerLbMin: 10,
      },
      null,
    );
    approx(r.horsepowerPerLiter, 200);
    approx(r.requiredAirflowLbMin, 40);
  });

  it('2000 cc → 2 L', () => {
    approx(convertCapacityToLiters(2000, 'cc'), 2);
  });

  it('100 kW → ≈ 134.10 hp', () => {
    approx(convertPowerToHorsepower(100, 'kW'), 134.102, 0.01);
  });

  it('volumetric airflow 2 L · 6000 · 0.9 → 0.09 m³/s', () => {
    approx(calculateEngineVolumetricAirflow(0.002, 6000, 0.9), 0.09);
  });

  it('pressure ratio 200/100 kPa → 2', () => {
    approx(calculateCompressorPressureRatio(200000, 100000), 2);
  });

  it('zero capacity invalid', () => {
    const v = validateTurboSizeInputs({
      ...createEmptyInput(),
      engineCapacity: '0',
    });
    assert.ok(v.errors.engineCapacity);
    assert.equal(v.result, null);
  });

  it('negative power invalid', () => {
    const v = validateTurboSizeInputs({
      ...createEmptyInput(),
      desiredPower: '-100',
    });
    assert.ok(v.errors.desiredPower);
  });

  it('default fixture validates', () => {
    const v = validateTurboSizeInputs(createEmptyInput());
    assert.equal(Object.keys(v.errors).length, 0);
    assert.ok(v.result);
    approx(v.result!.requiredAirflowLbMin, 40);
  });

  it('advanced mode produces mass airflow', () => {
    const v = validateTurboSizeInputs({
      ...createEmptyInput(),
      advancedMode: true,
    });
    assert.ok(v.result);
    assert.ok(v.result!.actualAirflowKgPerS != null);
    assert.ok(v.result!.compressorPressureRatio != null);
    approx(v.result!.volumetricAirflowM3PerS!, 0.09, 1e-9);
  });

  it('blank → no result', () => {
    const v = validateTurboSizeInputs({
      ...createEmptyInput(),
      engineCapacity: '',
      desiredPower: '',
    });
    assert.equal(v.result, null);
  });
});
