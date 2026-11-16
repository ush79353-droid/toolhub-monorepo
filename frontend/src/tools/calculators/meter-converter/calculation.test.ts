import assert from 'node:assert/strict';
import {
  allFromMeters,
  convertLength,
  fromMeters,
  shareResultText,
  toMeters,
} from './calculation';
import { parseLengthInput } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(fromMeters(1, 'cm'), 100);
assert.equal(fromMeters(1, 'mm'), 1000);
assert.equal(fromMeters(1, 'km'), 0.001);
assertClose(fromMeters(1, 'ft'), 3.280839895013123, 10);
assertClose(fromMeters(1, 'in'), 39.37007874015748, 10);
assertClose(fromMeters(1, 'yd'), 1.0936132983377078, 10);
assertClose(fromMeters(1, 'mi'), 0.0006213711922373339, 12);

assert.equal(toMeters(10, 'ft'), 3.048);
assert.equal(toMeters(100, 'in'), 2.54);
assert.equal(toMeters(2.5, 'km'), 2500);
assert.equal(fromMeters(0, 'cm'), 0);
assert.equal(fromMeters(-2, 'cm'), -200);

assert.equal(convertLength(5, 'm', 'cm'), 500);
assert.equal(convertLength(2.5, 'm', 'mm'), 2500);
assertClose(convertLength(5, 'm', 'ft'), 16.404199475065617, 9);

assert.equal(toMeters(1, 'nmi'), 1852);
assert.equal(toMeters(1, 'solarRadius'), 695_700_000);
assert.equal(toMeters(1, 'angstrom'), 1e-10);

const all = allFromMeters(1);
assert.equal(all.m, 1);
assert.equal(all.cm, 100);
assert.match(shareResultText(1), /Meter Converter/);

assert.equal(parseLengthInput('').blank, true);
assert.equal(parseLengthInput('1.').incomplete, true);
assert.ok(parseLengthInput('abc').value === null);

console.log('meter-converter calculation.test.ts: ok');
