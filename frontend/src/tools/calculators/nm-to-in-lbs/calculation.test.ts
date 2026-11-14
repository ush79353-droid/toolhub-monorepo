import assert from 'node:assert/strict';
import {
  calculateNmToInLbs,
  formatTorque,
  inLbsToNm,
  nmToInLbs,
} from './calculation';
import {
  DEFAULT_NM_TO_IN_LBS_INPUT,
  METERS_PER_INCH,
  NEWTON_METERS_PER_FOOT_POUND,
  NEWTON_METERS_PER_INCH_POUND,
  NEWTON_METERS_PER_KGF_M,
  NEWTONS_PER_LBF,
} from './types';
import { validateNmToInLbs } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

assertClose(NEWTONS_PER_LBF, 4.4482216152605);
assertClose(NEWTON_METERS_PER_INCH_POUND, 0.1129848290276167);
assertClose(
  METERS_PER_INCH * NEWTONS_PER_LBF,
  NEWTON_METERS_PER_INCH_POUND,
  1e-15
);
assertClose(NEWTON_METERS_PER_FOOT_POUND, 1.3558179483314004);
assert.equal(NEWTON_METERS_PER_KGF_M, 9.80665);

assert.equal(nmToInLbs(0), 0);
assertClose(nmToInLbs(1), 1 / NEWTON_METERS_PER_INCH_POUND);
assertClose(nmToInLbs(5), 5 / NEWTON_METERS_PER_INCH_POUND);
assertClose(nmToInLbs(10), 10 / NEWTON_METERS_PER_INCH_POUND);
assertClose(nmToInLbs(25), 25 / NEWTON_METERS_PER_INCH_POUND);
assertClose(nmToInLbs(100), 100 / NEWTON_METERS_PER_INCH_POUND);

assert.equal(inLbsToNm(0), 0);
assertClose(inLbsToNm(1), NEWTON_METERS_PER_INCH_POUND);
assertClose(inLbsToNm(10), 10 * NEWTON_METERS_PER_INCH_POUND);
assertClose(inLbsToNm(50), 50 * NEWTON_METERS_PER_INCH_POUND);
assertClose(inLbsToNm(100), 100 * NEWTON_METERS_PER_INCH_POUND);
assertClose(inLbsToNm(500), 500 * NEWTON_METERS_PER_INCH_POUND);

{
  const forward = nmToInLbs(10);
  assertClose(inLbsToNm(forward), 10, 1e-12);
  const back = inLbsToNm(100);
  assertClose(nmToInLbs(back), 100, 1e-12);
}

assertClose(NEWTON_METERS_PER_FOOT_POUND / NEWTON_METERS_PER_INCH_POUND, 12);
assertClose(1 / 1000 * 1000, 1); // kN·m sanity
assertClose(0.01 * 100, 1); // N·cm → N·m round trip factor

{
  const r = calculateNmToInLbs(DEFAULT_NM_TO_IN_LBS_INPUT);
  assertClose(r.nm, 10);
  assertClose(r.inlbf, 10 / NEWTON_METERS_PER_INCH_POUND);
  assert.ok(r.otherUnits.some((row) => row.unit === 'ft·lbf'));
  assertClose(
    r.otherUnits.find((row) => row.unit === 'ft·lbf')!.value,
    10 / NEWTON_METERS_PER_FOOT_POUND
  );
  assertClose(
    r.otherUnits.find((row) => row.unit === 'kgf·m')!.value,
    10 / NEWTON_METERS_PER_KGF_M
  );
}

{
  const fromIn = calculateNmToInLbs({ source: 'inlbf', nm: null, inlbf: 100 });
  assertClose(fromIn.nm, 100 * NEWTON_METERS_PER_INCH_POUND);
}

{
  const ok = validateNmToInLbs(DEFAULT_NM_TO_IN_LBS_INPUT);
  assert.equal(ok.isValid, true);
  const blank = validateNmToInLbs({ source: 'nm', nm: null, inlbf: null });
  assert.equal(blank.isValid, false);
  const neg = validateNmToInLbs({ source: 'nm', nm: -5, inlbf: null });
  assert.equal(neg.isValid, true);
}

assert.equal(formatTorque(0), '0');
assertClose(nmToInLbs(-10), -10 / NEWTON_METERS_PER_INCH_POUND);

console.log('nm-to-in-lbs calculation.test.ts: ok');
