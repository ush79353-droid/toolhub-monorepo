import assert from 'node:assert/strict';
import {
  allFromField,
  convertSpeed,
  knotsToMph,
  mphToKnots,
  shareResultText,
} from './calculation';
import { parseSpeedInput } from './validation';

function close(actual: number, expected: number, digits = 5): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

close(convertSpeed(1, 'knot', 'mph'), 1.150779448);
close(convertSpeed(10, 'knot', 'mph'), 11.50779448);
close(convertSpeed(20, 'knot', 'kmh'), 37.04);
close(convertSpeed(1, 'knot', 'kmh'), 1.852);
close(convertSpeed(1, 'knot', 'mps'), 0.514444444);
close(convertSpeed(60, 'mph', 'mps'), 26.8224);
assert.equal(convertSpeed(0, 'knot', 'mph'), 0);

close(knotsToMph(1), 1852 / 1609.344);
close(mphToKnots(60), 60 * (1609.344 / 1852));

{
  const a = allFromField(10, 'knot');
  close(a.mph, 11.50779448);
  close(a.kmh, 18.52);
}

assert.equal(parseSpeedInput('').blank, true);
assert.ok(parseSpeedInput('-1').error);
assert.match(shareResultText(allFromField(1, 'knot')), /mph/);

console.log('knots-to-mph calculation.test.ts: ok');
