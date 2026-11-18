import assert from 'node:assert/strict';
import {
  convertSpeed,
  fromMetersPerSecond,
  kmhToMetersPerSecond,
  metersPerSecondToKmh,
  shareResultText,
  toMetersPerSecond,
} from './calculation';
import { parseSpeedInput } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-10): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected} ± ${eps}, got ${actual}`,
  );
}

assert.equal(metersPerSecondToKmh(0), 0);
assert.equal(metersPerSecondToKmh(1), 3.6);
assert.equal(metersPerSecondToKmh(5), 18);
assert.equal(metersPerSecondToKmh(10), 36);
assert.equal(metersPerSecondToKmh(20), 72);
assert.equal(metersPerSecondToKmh(25), 90);
assert.equal(metersPerSecondToKmh(100), 360);

assert.equal(kmhToMetersPerSecond(3.6), 1);
assert.equal(kmhToMetersPerSecond(36), 10);
assert.equal(kmhToMetersPerSecond(72), 20);
assert.equal(kmhToMetersPerSecond(90), 25);
assertClose(kmhToMetersPerSecond(100), 100 / 3.6);

assertClose(fromMetersPerSecond(1, 'mph'), 3600 / 1609.344);
assertClose(fromMetersPerSecond(1, 'fps'), 1 / 0.3048);
assertClose(fromMetersPerSecond(1, 'knots'), 3600 / 1852);
assert.equal(fromMetersPerSecond(1, 'cms'), 100);
assert.equal(fromMetersPerSecond(1, 'mms'), 1000);
assert.equal(fromMetersPerSecond(1, 'kms'), 0.001);
assert.equal(fromMetersPerSecond(1, 'mpm'), 60);
assert.equal(fromMetersPerSecond(1, 'kmpm'), 0.06);
assertClose(fromMetersPerSecond(1, 'fpm'), 60 / 0.3048);

assert.equal(convertSpeed(10, 'mps', 'kmh'), 36);
assert.equal(convertSpeed(72, 'kmh', 'mps'), 20);
assertClose(convertSpeed(10, 'mps', 'mph'), 10 * (3600 / 1609.344));
assertClose(toMetersPerSecond(32.808399, 'fps'), 10, 1e-6);
assertClose(toMetersPerSecond(-36, 'kmh'), -10);
assert.equal(convertSpeed(0, 'mph', 'mps'), 0);

assert.equal(parseSpeedInput('').blank, true);
assert.equal(parseSpeedInput('12.').incomplete, true);
assert.ok(parseSpeedInput('abc').error);
assert.equal(parseSpeedInput('10').value, 10);
assert.equal(parseSpeedInput('-5').value, -5);

{
  const share = shareResultText('10 meters per second', 10);
  assert.match(share, /m\/s to km\/h Converter/);
  assert.match(share, /36 kilometers per hour/);
  assert.match(share, /1000 centimeters per second/);
  assert.match(share, /10000 millimeters per second/);
}

console.log('ms-to-kmh calculation.test.ts: ok');
