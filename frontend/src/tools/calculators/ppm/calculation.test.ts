import assert from 'node:assert/strict';
import {
  allFromRatio,
  convertPpm,
  formatPpm,
  fromRatio,
  shareResultText,
  toRatio,
} from './calculation';
import { parsePpmInput, ratioFromUnit } from './validation';

function approx(actual: number, expected: number, rel = 1e-12): void {
  const scale = Math.max(1, Math.abs(expected));
  assert.ok(
    Math.abs(actual - expected) <= rel * scale,
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(toRatio(1, 'ppm'), 1e-6);
assert.equal(toRatio(1, 'percent'), 0.01);
assert.equal(toRatio(1, 'permille'), 0.001);
assert.equal(toRatio(1, 'ppb'), 1e-9);
assert.equal(toRatio(1, 'ppt'), 1e-12);
assert.equal(toRatio(1, 'number'), 1);

approx(fromRatio(1e-6, 'percent'), 0.0001);
approx(fromRatio(1e-6, 'ppb'), 1000);
approx(fromRatio(1e-6, 'ppt'), 1_000_000);
approx(fromRatio(0.01, 'ppm'), 10_000);
approx(convertPpm(0.05, 'percent', 'ppm'), 500);
approx(convertPpm(500, 'ppm', 'percent'), 0.05);
approx(convertPpm(1, 'ppb', 'ppm'), 0.001);
approx(convertPpm(1, 'ppt', 'ppb'), 0.001);
approx(convertPpm(1, 'permille', 'ppm'), 1000);
approx(convertPpm(100, 'percent', 'number'), 1);

{
  const a = allFromRatio(toRatio(1, 'ppm'));
  approx(a.number, 1e-6);
  approx(a.percent, 0.0001);
  approx(a.permille, 0.001);
  approx(a.ppm, 1);
  approx(a.ppb, 1000);
  approx(a.ppt, 1_000_000);
}

{
  const a = allFromRatio(toRatio(1, 'percent'));
  approx(a.number, 0.01);
  approx(a.percent, 1);
  approx(a.permille, 10);
  approx(a.ppm, 10_000);
  approx(a.ppb, 10_000_000);
  approx(a.ppt, 10_000_000_000);
}

{
  const a = allFromRatio(toRatio(500, 'ppm'));
  approx(a.number, 0.0005);
  approx(a.percent, 0.05);
  approx(a.permille, 0.5);
  approx(a.ppm, 500);
  approx(a.ppb, 500_000);
  approx(a.ppt, 500_000_000);
}

{
  const a = allFromRatio(0);
  for (const v of Object.values(a)) assert.equal(v, 0);
}

assert.equal(parsePpmInput('').blank, true);
assert.equal(parsePpmInput('0').value, 0);
assert.equal(parsePpmInput('1e-6').value, 1e-6);
assert.equal(parsePpmInput('100%').value, 100);
assert.ok(parsePpmInput('-1').error);
assert.ok(parsePpmInput('abc').error);

{
  const r = ratioFromUnit(-1, 'ppm');
  assert.equal(r.ok, false);
}

assert.equal(formatPpm(1000), '1,000');
approx(Number(formatPpm(0.000001).replace(/,/g, '')), 0.000001);

{
  const share = shareResultText(toRatio(500, 'ppm'), 'ppm');
  assert.match(share, /PPM Calculator/);
  assert.match(share, /Input:/);
  assert.match(share, /500/);
  assert.match(share, /Results:/);
  assert.match(share, /Percent: 0\.05%/);
}

console.log('ppm calculation.test.ts: ok');
