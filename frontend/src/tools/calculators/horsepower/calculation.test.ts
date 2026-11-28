import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  KM_PER_MILE,
  LB_PER_KG,
  WATTS_PER_HP,
  WATTS_PER_PS,
  calculateHorsepowerFromElapsedTime,
  calculateHorsepowerFromInput,
  calculateHorsepowerFromTrapSpeed,
  convertTrapSpeed,
  convertVehicleWeight,
  horsepowerToKilowatts,
  horsepowerToMetricHorsepower,
  horsepowerToWatts,
} from './calculation';
import {
  createEmptyInput,
  createExampleTrapSpeed,
} from './types';
import { validateHorsepowerInputs } from './validation';

describe('Horsepower Calculator engine', () => {
  it('3500 lb · 13.5 s ET → ≈281.2 hp', () => {
    const hp = calculateHorsepowerFromElapsedTime(3500, 13.5)!;
    assert.ok(Math.abs(hp - 281.2) < 0.15);
  });

  it('3500 lb · 105 mph trap → ≈316.2 hp', () => {
    const hp = calculateHorsepowerFromTrapSpeed(3500, 105)!;
    assert.ok(Math.abs(hp - 316.2192973583507) < 1e-9);
  });

  it('example ET input', () => {
    const r = calculateHorsepowerFromInput(createEmptyInput())!;
    assert.equal(r.method, 'elapsedTime');
    assert.ok(Math.abs(r.estimatedHorsepowerHp - 281.1606430676219) < 1e-9);
  });

  it('example trap input', () => {
    const r = calculateHorsepowerFromInput(createExampleTrapSpeed())!;
    assert.equal(r.method, 'trapSpeed');
    assert.ok(Math.abs(r.estimatedHorsepowerHp - 316.2192973583507) < 1e-9);
  });

  it('100 hp → ≈74569.99 W', () => {
    assert.ok(Math.abs(horsepowerToWatts(100) - 100 * WATTS_PER_HP) < 1e-6);
  });

  it('150 hp → ≈111.85 kW', () => {
    assert.ok(Math.abs(horsepowerToKilowatts(150) - 111.8549807373) < 0.01);
  });

  it('1 PS = 735.49875 W', () => {
    assert.equal(WATTS_PER_PS, 735.49875);
    const hpFromPs = WATTS_PER_PS / WATTS_PER_HP;
    assert.ok(
      Math.abs(horsepowerToMetricHorsepower(hpFromPs) - 1) < 1e-9,
    );
  });

  it('1 kg → 2.20462262185 lb', () => {
    assert.ok(
      Math.abs(convertVehicleWeight(1, 'kg', 'lb') - LB_PER_KG) < 1e-12,
    );
  });

  it('1 mph → 1.609344 km/h', () => {
    assert.ok(
      Math.abs(convertTrapSpeed(1, 'mph', 'km/h') - KM_PER_MILE) < 1e-12,
    );
  });

  it('weight 0 → validation error', () => {
    const input = createEmptyInput();
    input.vehicleWeight = '0';
    assert.ok(validateHorsepowerInputs(input).errors.vehicleWeight);
  });

  it('ET 0 → validation error', () => {
    const input = createEmptyInput();
    input.quarterMileTime = '0';
    assert.ok(validateHorsepowerInputs(input).errors.quarterMileTime);
  });

  it('trap 0 → validation error', () => {
    const input = createExampleTrapSpeed();
    input.trapSpeed = '0';
    assert.ok(validateHorsepowerInputs(input).errors.trapSpeed);
  });

  it('negative weight → validation error', () => {
    const input = createEmptyInput();
    input.vehicleWeight = '-10';
    assert.ok(validateHorsepowerInputs(input).errors.vehicleWeight);
  });

  it('method switch preserves weight', () => {
    const a = createEmptyInput();
    a.vehicleWeight = '4000';
    a.method = 'trapSpeed';
    const r = calculateHorsepowerFromInput(a)!;
    assert.ok(Math.abs(r.vehicleWeightLb - 4000) < 1e-9);
  });

  it('shorter ET raises HP', () => {
    const slow = calculateHorsepowerFromElapsedTime(3500, 13.5)!;
    const fast = calculateHorsepowerFromElapsedTime(3500, 12.5)!;
    assert.ok(fast > slow);
  });

  it('higher trap raises HP', () => {
    const a = calculateHorsepowerFromTrapSpeed(3500, 105)!;
    const b = calculateHorsepowerFromTrapSpeed(3500, 110)!;
    assert.ok(b > a);
  });
});
