import assert from 'node:assert/strict';
import {
  calculateLbsToNewtons,
  newtonsToPoundsForce,
  poundsForceToNewtons,
} from './calculation';
import {
  DEFAULT_LBS_TO_NEWTONS_INPUT,
  NEWTONS_PER_POUND_FORCE,
} from './types';
import { validateLbsToNewtons } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-12): void {
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`
  );
}

assertClose(NEWTONS_PER_POUND_FORCE, 4.4482216152605);
assert.equal(poundsForceToNewtons(0), 0);
assertClose(poundsForceToNewtons(1), 4.4482216152605);
assertClose(poundsForceToNewtons(5), 22.2411080763025);
assertClose(poundsForceToNewtons(10), 44.482216152605);
assertClose(poundsForceToNewtons(20), 88.96443230521);
assertClose(poundsForceToNewtons(50), 222.411080763025);
assertClose(poundsForceToNewtons(100), 444.82216152605);
assertClose(poundsForceToNewtons(500), 2224.11080763025);
assertClose(poundsForceToNewtons(1000), 4448.2216152605);

assertClose(newtonsToPoundsForce(1), 1 / NEWTONS_PER_POUND_FORCE);
assertClose(newtonsToPoundsForce(10), 10 / NEWTONS_PER_POUND_FORCE);
assertClose(newtonsToPoundsForce(50), 50 / NEWTONS_PER_POUND_FORCE);
assertClose(newtonsToPoundsForce(100), 100 / NEWTONS_PER_POUND_FORCE);
assertClose(newtonsToPoundsForce(500), 500 / NEWTONS_PER_POUND_FORCE);
assertClose(newtonsToPoundsForce(1000), 1000 / NEWTONS_PER_POUND_FORCE);

{
  const forward = poundsForceToNewtons(37.5);
  assertClose(newtonsToPoundsForce(forward), 37.5);
  const back = newtonsToPoundsForce(-200);
  assertClose(poundsForceToNewtons(back), -200);
}

{
  const r = calculateLbsToNewtons(DEFAULT_LBS_TO_NEWTONS_INPUT);
  assert.equal(r.source, 'lbf');
  assert.equal(r.lbf, 10);
  assertClose(r.newtons, 44.482216152605);

  const fromN = calculateLbsToNewtons({
    source: 'N',
    lbf: null,
    newtons: 100,
  });
  assertClose(fromN.lbf, 100 / NEWTONS_PER_POUND_FORCE);
  assert.equal(fromN.newtons, 100);
}

{
  const ok = validateLbsToNewtons(DEFAULT_LBS_TO_NEWTONS_INPUT);
  assert.equal(ok.isValid, true);

  const blank = validateLbsToNewtons({
    source: 'lbf',
    lbf: null,
    newtons: null,
  });
  assert.equal(blank.isValid, false);

  const neg = validateLbsToNewtons({
    source: 'lbf',
    lbf: -5,
    newtons: null,
  });
  assert.equal(neg.isValid, true);

  const bad = validateLbsToNewtons({
    source: 'N',
    lbf: null,
    newtons: Number.NaN,
  });
  assert.equal(bad.isValid, false);
}

console.log('lbs-to-newtons calculation.test.ts: ok');
