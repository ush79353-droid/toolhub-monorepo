import assert from 'node:assert/strict';
import { allFromCps, formatCps, fromCps, shareResultText, toCps } from './calculation';
import { cpsFromUnit, parseCpsInput } from './validation';

function approx(actual: number, expected: number, tol = 1e-12) {
  assert.ok(
    Math.abs(actual - expected) <= tol * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(fromCps(1, 'hz'), 1);
assert.equal(fromCps(1, 'cpm'), 60);
assert.equal(fromCps(1, 'rpm'), 60);
assert.equal(fromCps(1, 'degPerSec'), 360);
approx(fromCps(1, 'radPerSec'), 2 * Math.PI);
assert.equal(fromCps(1000, 'khz'), 1);
assert.equal(fromCps(1_000_000, 'mhz'), 1);
assert.equal(fromCps(1_000_000_000, 'ghz'), 1);

approx(toCps(60, 'rpm'), 1);
approx(toCps(120, 'rpm'), 2);
approx(toCps(180, 'degPerSec'), 0.5);
approx(toCps(Math.PI, 'radPerSec'), 0.5);
approx(toCps(500, 'hz'), 500);

{
  const a = allFromCps(0);
  for (const v of Object.values(a)) assert.equal(v, 0);
}

{
  const a = allFromCps(1);
  assert.equal(a.cps, 1);
  assert.equal(a.hz, 1);
  assert.equal(a.cpm, 60);
  assert.equal(a.rpm, 60);
  assert.equal(a.khz, 0.001);
  assert.equal(a.mhz, 1e-6);
  assert.equal(a.ghz, 1e-9);
  assert.equal(a.degPerSec, 360);
  approx(a.radPerSec, 2 * Math.PI);
}

{
  const a = allFromCps(toCps(1, 'khz'));
  assert.equal(a.cps, 1000);
  assert.equal(a.rpm, 60_000);
  assert.equal(a.khz, 1);
}

assert.equal(formatCps(1000), '1,000');
assert.equal(parseCpsInput('').blank, true);
assert.ok(parseCpsInput('-1').error);
assert.equal(parseCpsInput('1e3').value, 1000);

{
  const r = cpsFromUnit(60, 'rpm');
  assert.equal(r.ok, true);
  if (r.ok) approx(r.cps, 1);
}

{
  const share = shareResultText(1);
  assert.match(share, /CPS Calculator/);
  assert.match(share, /Cycles per second: 1 cps/);
  assert.match(share, /Revolutions per minute: 60 RPM/);
  assert.match(share, /Hertz: 1 Hz/);
}

console.log('cps calculation.test.ts: ok');
