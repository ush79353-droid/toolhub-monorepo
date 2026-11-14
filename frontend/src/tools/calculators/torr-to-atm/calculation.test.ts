import assert from 'node:assert/strict';
import {
  atmospheresToTorr,
  calculateTorrToAtm,
  torrToAtmospheres,
} from './calculation';
import {
  DEFAULT_TORR_TO_ATM_INPUT,
  PASCALS_PER_ATM,
  PASCALS_PER_TORR,
  TORR_PER_ATMOSPHERE,
} from './types';
import { validateTorrToAtm } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-12): void {
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`
  );
}

assert.equal(TORR_PER_ATMOSPHERE, 760);
assert.equal(PASCALS_PER_ATM, 101_325);
assertClose(PASCALS_PER_TORR, 101325 / 760);

assert.equal(torrToAtmospheres(0), 0);
assertClose(torrToAtmospheres(1), 1 / 760);
assertClose(torrToAtmospheres(10), 10 / 760);
assertClose(torrToAtmospheres(100), 100 / 760);
assert.equal(torrToAtmospheres(380), 0.5);
assert.equal(torrToAtmospheres(760), 1);
assert.equal(torrToAtmospheres(1520), 2);
assert.equal(torrToAtmospheres(2280), 3);
assert.equal(torrToAtmospheres(7600), 10);

assert.equal(atmospheresToTorr(0), 0);
assert.equal(atmospheresToTorr(0.1), 76);
assert.equal(atmospheresToTorr(0.25), 190);
assert.equal(atmospheresToTorr(0.5), 380);
assert.equal(atmospheresToTorr(1), 760);
assert.equal(atmospheresToTorr(2), 1520);
assert.equal(atmospheresToTorr(5), 3800);
assert.equal(atmospheresToTorr(10), 7600);

{
  const forward = torrToAtmospheres(500);
  assertClose(atmospheresToTorr(forward), 500);
  const back = atmospheresToTorr(1.25);
  assertClose(torrToAtmospheres(back), 1.25);
}

{
  const r = calculateTorrToAtm(DEFAULT_TORR_TO_ATM_INPUT);
  assert.equal(r.torr, 760);
  assert.equal(r.atm, 1);
  assertClose(r.pascals, PASCALS_PER_ATM);
  assert.ok(r.otherUnits.some((u) => u.id === 'Pa'));

  const fromAtm = calculateTorrToAtm({
    source: 'atm',
    torr: null,
    atm: 2,
  });
  assert.equal(fromAtm.torr, 1520);
  assert.equal(fromAtm.atm, 2);
}

{
  const ok = validateTorrToAtm(DEFAULT_TORR_TO_ATM_INPUT);
  assert.equal(ok.isValid, true);

  const blank = validateTorrToAtm({ source: 'Torr', torr: null, atm: null });
  assert.equal(blank.isValid, false);

  const signed = validateTorrToAtm({ source: 'Torr', torr: -10, atm: null });
  assert.equal(signed.isValid, true);
}

console.log('torr-to-atm calculation.test.ts: ok');
