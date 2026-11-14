import assert from 'node:assert/strict';
import {
  calculateNmToFtLbs,
  formatTorque,
  ftLbsToNm,
  nmToFtLbs,
} from './calculation';
import {
  DEFAULT_NM_TO_FT_LBS_INPUT,
  INCH_POUNDS_PER_FOOT_POUND,
  NEWTON_METERS_PER_FOOT_POUND,
  NEWTON_METERS_PER_INCH_POUND,
  NEWTON_METERS_PER_KGF_M,
} from './types';
import { validateNmToFtLbs } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`
  );
}

assertClose(NEWTON_METERS_PER_FOOT_POUND, 1.3558179483314004);
assertClose(NEWTON_METERS_PER_FOOT_POUND / NEWTON_METERS_PER_INCH_POUND, 12);
assert.equal(INCH_POUNDS_PER_FOOT_POUND, 12);
assert.equal(NEWTON_METERS_PER_KGF_M, 9.80665);

assert.equal(nmToFtLbs(0), 0);
assertClose(nmToFtLbs(1), 1 / NEWTON_METERS_PER_FOOT_POUND);
assertClose(nmToFtLbs(5), 5 / NEWTON_METERS_PER_FOOT_POUND);
assertClose(nmToFtLbs(10), 10 / NEWTON_METERS_PER_FOOT_POUND);
assertClose(nmToFtLbs(50), 50 / NEWTON_METERS_PER_FOOT_POUND);
assertClose(nmToFtLbs(100), 100 / NEWTON_METERS_PER_FOOT_POUND);
assertClose(nmToFtLbs(500), 500 / NEWTON_METERS_PER_FOOT_POUND);
assertClose(nmToFtLbs(1000), 1000 / NEWTON_METERS_PER_FOOT_POUND);

assert.equal(ftLbsToNm(0), 0);
assertClose(ftLbsToNm(1), NEWTON_METERS_PER_FOOT_POUND);
assertClose(ftLbsToNm(10), 10 * NEWTON_METERS_PER_FOOT_POUND);
assertClose(ftLbsToNm(100), 100 * NEWTON_METERS_PER_FOOT_POUND);
assertClose(ftLbsToNm(1000), 1000 * NEWTON_METERS_PER_FOOT_POUND);

{
  const forward = nmToFtLbs(50);
  assertClose(ftLbsToNm(forward), 50, 1e-12);
  const back = ftLbsToNm(25);
  assertClose(nmToFtLbs(back), 25, 1e-12);
}

{
  const r = calculateNmToFtLbs(DEFAULT_NM_TO_FT_LBS_INPUT);
  assertClose(r.nm, 10);
  assertClose(r.ftlbf, 10 / NEWTON_METERS_PER_FOOT_POUND);
  assert.ok(!r.otherUnits.some((row) => row.unit === 'N·m'));
  assert.ok(!r.otherUnits.some((row) => row.unit === 'ft·lbf'));
  assert.ok(r.otherUnits.some((row) => row.unit === 'in·lbf'));
  assertClose(
    r.otherUnits.find((row) => row.unit === 'in·lbf')!.value,
    10 / NEWTON_METERS_PER_INCH_POUND
  );
  assertClose(
    r.otherUnits.find((row) => row.unit === 'kgf·m')!.value,
    10 / NEWTON_METERS_PER_KGF_M
  );
  assertClose(r.otherUnits.find((row) => row.unit === 'N·cm')!.value, 1000);
}

{
  const fromFt = calculateNmToFtLbs({ source: 'ftlbf', nm: null, ftlbf: 100 });
  assertClose(fromFt.nm, 100 * NEWTON_METERS_PER_FOOT_POUND);
}

{
  const ok = validateNmToFtLbs(DEFAULT_NM_TO_FT_LBS_INPUT);
  assert.equal(ok.isValid, true);
  const blank = validateNmToFtLbs({ source: 'nm', nm: null, ftlbf: null });
  assert.equal(blank.isValid, false);
  const neg = validateNmToFtLbs({ source: 'nm', nm: -5, ftlbf: null });
  assert.equal(neg.isValid, true);
}

assert.equal(formatTorque(0), '0');
assertClose(nmToFtLbs(-10), -10 / NEWTON_METERS_PER_FOOT_POUND);

console.log('nm-to-ft-lbs calculation.test.ts: ok');
