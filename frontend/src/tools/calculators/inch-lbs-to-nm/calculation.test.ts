import assert from 'node:assert/strict';
import {
  calculateInchLbsToNm,
  formatTorque,
  inLbsToNm,
  nmToInLbs,
} from './calculation';
import {
  DEFAULT_INCH_LBS_TO_NM_INPUT,
  NEWTON_METERS_PER_FOOT_POUND,
  NEWTON_METERS_PER_INCH_POUND,
  NEWTON_METERS_PER_KGF_M,
} from './types';
import { validateInchLbsToNm } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

assertClose(NEWTON_METERS_PER_INCH_POUND, 0.1129848290276167);

assert.equal(inLbsToNm(0), 0);
assertClose(inLbsToNm(1), 0.1129848290276167);
assertClose(inLbsToNm(5), 0.5649241451380835);
assertClose(inLbsToNm(10), 1.129848290276167);
assertClose(inLbsToNm(50), 5.649241451380835);
assertClose(inLbsToNm(100), 11.29848290276167);
assertClose(inLbsToNm(500), 56.49241451380835);
assertClose(inLbsToNm(1000), 112.9848290276167);

assert.equal(nmToInLbs(0), 0);
assertClose(nmToInLbs(1), 1 / NEWTON_METERS_PER_INCH_POUND);
assertClose(nmToInLbs(10), 10 / NEWTON_METERS_PER_INCH_POUND);
assertClose(nmToInLbs(100), 100 / NEWTON_METERS_PER_INCH_POUND);

{
  const r = calculateInchLbsToNm(DEFAULT_INCH_LBS_TO_NM_INPUT);
  assertClose(r.inlbf, 100);
  assertClose(r.nm, 11.29848290276167);
  assert.equal(r.source, 'inlbf');
  assertClose(
    r.otherUnits.find((row) => row.unit === 'ft·lbf')!.value,
    100 / 12
  );
  assertClose(
    r.otherUnits.find((row) => row.unit === 'kgf·m')!.value,
    r.nm / NEWTON_METERS_PER_KGF_M
  );
}

{
  const fromNm = calculateInchLbsToNm({ source: 'nm', inlbf: null, nm: 10 });
  assertClose(fromNm.inlbf, 10 / NEWTON_METERS_PER_INCH_POUND);
}

assertClose(NEWTON_METERS_PER_FOOT_POUND / NEWTON_METERS_PER_INCH_POUND, 12);

{
  const ok = validateInchLbsToNm(DEFAULT_INCH_LBS_TO_NM_INPUT);
  assert.equal(ok.isValid, true);
  const blank = validateInchLbsToNm({ source: 'inlbf', inlbf: null, nm: null });
  assert.equal(blank.isValid, false);
  const neg = validateInchLbsToNm({ source: 'inlbf', inlbf: -50, nm: null });
  assert.equal(neg.isValid, true);
}

assert.equal(formatTorque(0), '0');

console.log('inch-lbs-to-nm calculation.test.ts: ok');
