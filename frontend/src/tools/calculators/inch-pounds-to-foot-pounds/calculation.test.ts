import assert from 'node:assert/strict';
import {
  calculateInchPoundsToFootPounds,
  footPoundsToInchPounds,
  formatTorque,
  inchPoundsToFootPounds,
} from './calculation';
import {
  DEFAULT_INCH_POUNDS_TO_FOOT_POUNDS_INPUT,
  INCH_POUNDS_PER_FOOT_POUND,
  NEWTON_METERS_PER_FOOT_POUND,
  NEWTON_METERS_PER_INCH_POUND,
} from './types';
import { validateInchPoundsToFootPounds } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-12): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

assert.equal(INCH_POUNDS_PER_FOOT_POUND, 12);
assertClose(NEWTON_METERS_PER_FOOT_POUND / NEWTON_METERS_PER_INCH_POUND, 12);

assert.equal(inchPoundsToFootPounds(0), 0);
assertClose(inchPoundsToFootPounds(1), 1 / 12);
assert.equal(inchPoundsToFootPounds(6), 0.5);
assert.equal(inchPoundsToFootPounds(12), 1);
assert.equal(inchPoundsToFootPounds(24), 2);
assert.equal(inchPoundsToFootPounds(36), 3);
assert.equal(inchPoundsToFootPounds(48), 4);
assert.equal(inchPoundsToFootPounds(60), 5);
assert.equal(inchPoundsToFootPounds(120), 10);
assert.equal(inchPoundsToFootPounds(240), 20);

assert.equal(footPoundsToInchPounds(0), 0);
assert.equal(footPoundsToInchPounds(1), 12);
assert.equal(footPoundsToInchPounds(2), 24);
assert.equal(footPoundsToInchPounds(5), 60);
assert.equal(footPoundsToInchPounds(10), 120);
assert.equal(footPoundsToInchPounds(20), 240);
assert.equal(footPoundsToInchPounds(50), 600);
assert.equal(footPoundsToInchPounds(100), 1200);

{
  const forward = inchPoundsToFootPounds(89);
  assertClose(footPoundsToInchPounds(forward), 89);
  const back = footPoundsToInchPounds(7.5);
  assertClose(inchPoundsToFootPounds(back), 7.5);
}

{
  const r = calculateInchPoundsToFootPounds(DEFAULT_INCH_POUNDS_TO_FOOT_POUNDS_INPUT);
  assert.equal(r.inlbf, 120);
  assert.equal(r.ftlbf, 10);
  assert.equal(r.source, 'inlbf');
}

{
  const fromFt = calculateInchPoundsToFootPounds({
    source: 'ftlbf',
    inlbf: null,
    ftlbf: 5,
  });
  assert.equal(fromFt.inlbf, 60);
}

{
  const ok = validateInchPoundsToFootPounds(DEFAULT_INCH_POUNDS_TO_FOOT_POUNDS_INPUT);
  assert.equal(ok.isValid, true);
  const blank = validateInchPoundsToFootPounds({
    source: 'inlbf',
    inlbf: null,
    ftlbf: null,
  });
  assert.equal(blank.isValid, false);
  const neg = validateInchPoundsToFootPounds({
    source: 'inlbf',
    inlbf: -24,
    ftlbf: null,
  });
  assert.equal(neg.isValid, true);
}

assert.equal(formatTorque(0), '0');

console.log('inch-pounds-to-foot-pounds calculation.test.ts: ok');
