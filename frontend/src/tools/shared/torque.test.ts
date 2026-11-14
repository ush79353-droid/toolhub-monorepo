import assert from 'node:assert/strict';
import {
  METERS_PER_INCH,
  NEWTON_METERS_PER_FOOT_POUND,
  NEWTON_METERS_PER_INCH_POUND,
  NEWTON_METERS_PER_KGF_M,
  NEWTONS_PER_LBF,
  formatTorque,
  inLbsToNm,
  nmToInLbs,
  otherTorqueUnitsFromNm,
} from './torque';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

assertClose(NEWTONS_PER_LBF, 4.4482216152605);
assertClose(NEWTON_METERS_PER_INCH_POUND, 0.1129848290276167);
assertClose(METERS_PER_INCH * NEWTONS_PER_LBF, NEWTON_METERS_PER_INCH_POUND, 1e-15);
assertClose(NEWTON_METERS_PER_FOOT_POUND, 1.3558179483314004);
assert.equal(NEWTON_METERS_PER_KGF_M, 9.80665);

assert.equal(inLbsToNm(0), 0);
assertClose(inLbsToNm(1), NEWTON_METERS_PER_INCH_POUND);
assertClose(inLbsToNm(5), 5 * NEWTON_METERS_PER_INCH_POUND);
assertClose(inLbsToNm(10), 10 * NEWTON_METERS_PER_INCH_POUND);
assertClose(inLbsToNm(50), 50 * NEWTON_METERS_PER_INCH_POUND);
assertClose(inLbsToNm(100), 100 * NEWTON_METERS_PER_INCH_POUND);
assertClose(inLbsToNm(500), 500 * NEWTON_METERS_PER_INCH_POUND);
assertClose(inLbsToNm(1000), 1000 * NEWTON_METERS_PER_INCH_POUND);

assert.equal(nmToInLbs(0), 0);
assertClose(nmToInLbs(1), 1 / NEWTON_METERS_PER_INCH_POUND);
assertClose(nmToInLbs(10), 10 / NEWTON_METERS_PER_INCH_POUND);
assertClose(nmToInLbs(100), 100 / NEWTON_METERS_PER_INCH_POUND);

{
  const forward = inLbsToNm(100);
  assertClose(nmToInLbs(forward), 100, 1e-12);
  const back = nmToInLbs(10);
  assertClose(inLbsToNm(back), 10, 1e-12);
}

assertClose(NEWTON_METERS_PER_FOOT_POUND / NEWTON_METERS_PER_INCH_POUND, 12);
{
  const rows = otherTorqueUnitsFromNm(100 * NEWTON_METERS_PER_INCH_POUND);
  assertClose(rows.find((r) => r.unit === 'ft·lbf')!.value, 100 / 12);
  assertClose(rows.find((r) => r.unit === 'kgf·m')!.value, inLbsToNm(100) / 9.80665);
}

assert.equal(formatTorque(0), '0');
assertClose(inLbsToNm(-100), -100 * NEWTON_METERS_PER_INCH_POUND);

console.log('shared/torque.test.ts: ok');
