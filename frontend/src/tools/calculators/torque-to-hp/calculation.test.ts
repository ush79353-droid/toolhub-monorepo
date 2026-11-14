import assert from 'node:assert/strict';
import {
  calculateMechanicalPowerWatts,
  calculateTorqueToHp,
  fromRadiansPerSecond,
  horsepowerToWatts,
  rpmToRadiansPerSecond,
  toNewtonMeters,
  toRadiansPerSecond,
  wattsToHorsepower,
} from './calculation';
import {
  DEFAULT_TORQUE_TO_HP_INPUT,
  NEWTON_METERS_PER_FOOT_POUND,
  NEWTON_METERS_PER_INCH_POUND,
  NEWTON_METERS_PER_KGF_M,
  WATTS_PER_MECHANICAL_HP,
  WATTS_PER_METRIC_HP,
} from './types';
import { validateTorqueToHp } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`
  );
}

assertClose(NEWTON_METERS_PER_FOOT_POUND, 1.3558179483314004);
assertClose(NEWTON_METERS_PER_INCH_POUND, 0.1129848290276167);
assertClose(NEWTON_METERS_PER_KGF_M, 9.80665);
assertClose(WATTS_PER_MECHANICAL_HP, 550 * 0.3048 * 0.45359237 * 9.80665);
assert.equal(WATTS_PER_METRIC_HP, 735.49875);

assertClose(rpmToRadiansPerSecond(60), 2 * Math.PI);
assertClose(toRadiansPerSecond(1, 'revs'), 2 * Math.PI);
assertClose(toRadiansPerSecond(180, 'degs'), Math.PI);
assertClose(fromRadiansPerSecond(2 * Math.PI, 'rpm'), 60);

{
  const omega = rpmToRadiansPerSecond(3000);
  assertClose(calculateMechanicalPowerWatts(100, omega), 100 * omega);
  assertClose(calculateMechanicalPowerWatts(50, rpmToRadiansPerSecond(1000)), 5235.987755982989);
  assert.equal(calculateMechanicalPowerWatts(0, omega), 0);
  assert.equal(calculateMechanicalPowerWatts(100, 0), 0);
}

{
  const r = calculateTorqueToHp(DEFAULT_TORQUE_TO_HP_INPUT);
  assertClose(r.torqueNm, 100);
  assertClose(r.powerW, 100 * rpmToRadiansPerSecond(3000));
  assertClose(r.powerDisplay, r.powerW / 1000);
  assertClose(r.horsepowerDisplay, wattsToHorsepower(r.powerW, 'hp'));
}

{
  const fromPower = calculateTorqueToHp({
    ...DEFAULT_TORQUE_TO_HP_INPUT,
    primary: 'power',
    secondary: 'speed',
    powerVia: 'power',
    torque: null,
    power: 31.41592653589793,
    powerUnit: 'kW',
    speed: 3000,
  });
  assertClose(fromPower.torqueNm, 100);

  const fromHp = calculateTorqueToHp({
    ...DEFAULT_TORQUE_TO_HP_INPUT,
    primary: 'power',
    secondary: 'speed',
    powerVia: 'horsepower',
    torque: null,
    horsepower: wattsToHorsepower(
      calculateMechanicalPowerWatts(100, rpmToRadiansPerSecond(3000)),
      'hp'
    ),
    speed: 3000,
  });
  assertClose(fromHp.torqueNm, 100);

  const fromTorquePower = calculateTorqueToHp({
    ...DEFAULT_TORQUE_TO_HP_INPUT,
    primary: 'torque',
    secondary: 'power',
    powerVia: 'power',
    torque: 100,
    speed: null,
    power: 31.41592653589793,
    powerUnit: 'kW',
  });
  assertClose(fromTorquePower.angularSpeedRadS, rpmToRadiansPerSecond(3000));
}

assertClose(horsepowerToWatts(1, 'hp'), WATTS_PER_MECHANICAL_HP);
assertClose(horsepowerToWatts(1, 'PS'), WATTS_PER_METRIC_HP);
assertClose(toNewtonMeters(1, 'ftlbf'), NEWTON_METERS_PER_FOOT_POUND);

{
  const ok = validateTorqueToHp(DEFAULT_TORQUE_TO_HP_INPUT);
  assert.equal(ok.isValid, true);

  const blank = validateTorqueToHp({
    ...DEFAULT_TORQUE_TO_HP_INPUT,
    torque: null,
    speed: null,
  });
  assert.equal(blank.isValid, false);

  const zeroSpeedPower = validateTorqueToHp({
    ...DEFAULT_TORQUE_TO_HP_INPUT,
    primary: 'power',
    secondary: 'speed',
    powerVia: 'power',
    torque: null,
    speed: 0,
    power: 10,
  });
  assert.equal(zeroSpeedPower.isValid, false);
}

console.log('torque-to-hp calculation.test.ts: ok');
