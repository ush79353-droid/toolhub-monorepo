import assert from 'node:assert/strict';
import {
  convertAngle,
  degreesToGradians,
  degreesToRadians,
  degreesToTurns,
  dmsToRadians,
  formatDmsLine,
  fromRadians,
  radiansToDegrees,
  radiansToDms,
  shareResultText,
  toRadians,
} from './calculation';
import { parseAngleField, parseDmsComponents } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-10): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected} ± ${eps}, got ${actual}`,
  );
}

assert.equal(degreesToRadians(0), 0);
assertClose(degreesToRadians(90), Math.PI / 2);
assertClose(degreesToRadians(180), Math.PI);
assertClose(degreesToRadians(360), 2 * Math.PI);
assertClose(radiansToDegrees(Math.PI / 2), 90);
assertClose(radiansToDegrees(Math.PI), 180);
assertClose(degreesToGradians(90), 100);
assertClose(degreesToGradians(360), 400);
assertClose(convertAngle(400, 'gradians', 'degrees'), 360);
assertClose(convertAngle(100, 'gradians', 'degrees'), 90);
assertClose(degreesToTurns(90), 0.25);
assertClose(degreesToTurns(360), 1);
assertClose(convertAngle(0.25, 'turns', 'degrees'), 90);
assertClose(convertAngle(1, 'turns', 'degrees'), 360);
assertClose(convertAngle(1, 'degrees', 'arcminutes'), 60);
assertClose(convertAngle(1, 'degrees', 'arcseconds'), 3600);
assertClose(convertAngle(1, 'radians', 'microradians'), 1_000_000);
assertClose(convertAngle(90, 'degrees', 'natoMils'), 1600);
assertClose(convertAngle(360, 'degrees', 'sovietMils'), 6000);
assertClose(convertAngle(360, 'degrees', 'swedishMils'), 6300);
assertClose(convertAngle(720, 'degrees', 'turns'), 2);
assertClose(degreesToRadians(-90), -Math.PI / 2);
assertClose(toRadians(0.5, 'piRadians'), Math.PI / 2);
assertClose(fromRadians(Math.PI / 2, 'piRadians'), 0.5);
assertClose(fromRadians(Math.PI / 2, 'radians'), Math.PI / 2);

assertClose(dmsToRadians(45, 30, 15, 1), degreesToRadians(45.5041666667), 1e-12);
assertClose(dmsToRadians(40, 25, 30, 1), degreesToRadians(40.425), 1e-12);
assertClose(dmsToRadians(0, 30, 0, -1), degreesToRadians(-0.5));
assertClose(dmsToRadians(12, 30, 0, -1), degreesToRadians(-12.5));

{
  const parts = radiansToDms(degreesToRadians(45.5041666667));
  assert.equal(parts.sign, 1);
  assert.equal(parts.degrees, 45);
  assert.equal(parts.minutes, 30);
  assertClose(parts.seconds, 15, 0.01);
}

{
  const parts = radiansToDms(degreesToRadians(-0.5));
  assert.equal(parts.sign, -1);
  assert.equal(parts.degrees, 0);
  assert.equal(parts.minutes, 30);
  assertClose(parts.seconds, 0, 1e-6);
  assert.match(formatDmsLine(parts), /−0° 30′/);
}

{
  const crafted = degreesToRadians(47 + 22 / 60 + 59.999999 / 3600);
  const parts = radiansToDms(crafted, 2);
  assert.ok(parts.seconds < 60);
  assert.ok(parts.minutes < 60);
}

for (const deg of [0, 30, 45, 60, 90, 180, 270, 360, 720, -90, 0.5]) {
  const rad = degreesToRadians(deg);
  assertClose(radiansToDegrees(rad), deg, 1e-10);
  assertClose(fromRadians(toRadians(deg, 'degrees'), 'degrees'), deg, 1e-10);
}

assert.equal(parseAngleField('').blank, true);
assert.equal(parseAngleField('12.').incomplete, true);
assert.ok(parseAngleField('abc').error);
assert.equal(parseAngleField('90').value, 90);

{
  const dms = parseDmsComponents('45', '30', '15');
  assert.equal(dms.blank, false);
  assert.ok(dms.radians != null);
  assertClose(dms.radians!, degreesToRadians(45.5041666667), 1e-12);
}

{
  const bad = parseDmsComponents('10', '60', '0');
  assert.ok(bad.errors.dmsMinutes);
}

{
  const share = shareResultText('90 degrees', degreesToRadians(90));
  assert.match(share, /Angle Conversion Calculator/);
  assert.match(share, /90 degrees/);
  assert.match(share, /Gradians: 100/);
  assert.match(share, /Turns: 0\.25/);
  assert.match(share, /π radians: 0\.5/);
  assert.match(share, /NATO mils: 1600/);
}

console.log('angle-conversion calculation.test.ts: ok');
