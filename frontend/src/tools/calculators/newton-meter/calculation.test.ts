import assert from 'node:assert/strict';
import {
  calculateNewtonMeter,
  convertTorque,
  footPoundsToNewtonMeters,
  newtonMetersToFootPounds,
} from './calculation';
import {
  DEFAULT_NEWTON_METER_INPUT,
  NEWTON_METERS_PER_FOOT_POUND,
  NEWTON_METERS_PER_INCH_POUND,
} from './types';
import { validateNewtonMeter } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-12): void {
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`
  );
}

assertClose(NEWTON_METERS_PER_FOOT_POUND, 1.3558179483314004);
assert.equal(newtonMetersToFootPounds(0), 0);
assertClose(newtonMetersToFootPounds(1), 1 / NEWTON_METERS_PER_FOOT_POUND);
assertClose(newtonMetersToFootPounds(5), 5 / NEWTON_METERS_PER_FOOT_POUND);
assertClose(newtonMetersToFootPounds(10), 10 / NEWTON_METERS_PER_FOOT_POUND);
assertClose(newtonMetersToFootPounds(50), 50 / NEWTON_METERS_PER_FOOT_POUND);
assertClose(newtonMetersToFootPounds(100), 100 / NEWTON_METERS_PER_FOOT_POUND);
assertClose(newtonMetersToFootPounds(500), 500 / NEWTON_METERS_PER_FOOT_POUND);
assertClose(newtonMetersToFootPounds(1000), 1000 / NEWTON_METERS_PER_FOOT_POUND);

assertClose(footPoundsToNewtonMeters(1), NEWTON_METERS_PER_FOOT_POUND);
assertClose(footPoundsToNewtonMeters(10), 10 * NEWTON_METERS_PER_FOOT_POUND);
assertClose(footPoundsToNewtonMeters(100), 100 * NEWTON_METERS_PER_FOOT_POUND);
assertClose(footPoundsToNewtonMeters(1000), 1000 * NEWTON_METERS_PER_FOOT_POUND);

{
  const forward = newtonMetersToFootPounds(37.5);
  assertClose(footPoundsToNewtonMeters(forward), 37.5);
  const back = footPoundsToNewtonMeters(-80);
  assertClose(newtonMetersToFootPounds(back), -80);
}

assertClose(convertTorque(1, 'inlbf', 'Nm'), NEWTON_METERS_PER_INCH_POUND);
assertClose(convertTorque(12, 'inlbf', 'ftlbf'), 1);

{
  const r = calculateNewtonMeter(DEFAULT_NEWTON_METER_INPUT);
  assert.equal(r.source, 'first');
  assert.equal(r.nm, 10);
  assertClose(r.second, 10 / NEWTON_METERS_PER_FOOT_POUND);

  const fromFt = calculateNewtonMeter({
    source: 'second',
    first: null,
    second: 100,
    firstUnit: 'Nm',
    secondUnit: 'ftlbf',
  });
  assertClose(fromFt.nm, 100 * NEWTON_METERS_PER_FOOT_POUND);
  assertClose(fromFt.first, 100 * NEWTON_METERS_PER_FOOT_POUND);
}

{
  const ok = validateNewtonMeter(DEFAULT_NEWTON_METER_INPUT);
  assert.equal(ok.isValid, true);

  const blank = validateNewtonMeter({
    ...DEFAULT_NEWTON_METER_INPUT,
    first: null,
  });
  assert.equal(blank.isValid, false);

  const neg = validateNewtonMeter({
    ...DEFAULT_NEWTON_METER_INPUT,
    first: -5,
  });
  assert.equal(neg.isValid, true);
}

console.log('newton-meter calculation.test.ts: ok');
