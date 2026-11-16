import assert from 'node:assert/strict';
import {
  allFromKnotsField,
  kphToKnots,
  knotsToKph,
  knotsToMetersPerSecond,
  metersPerSecondToKnots,
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

close(knotsToKph(1), 1.852);
close(knotsToKph(10), 18.52);
close(knotsToKph(20), 37.04);
close(knotsToKph(50), 92.6);
close(knotsToKph(100), 185.2);
assert.equal(knotsToKph(0), 0);

close(kphToKnots(18.52), 10);
close(kphToKnots(100), 53.99568035);
close(kphToKnots(185.2), 100);

close(knotsToMetersPerSecond(1), 1852 / 3600);
close(metersPerSecondToKnots(1852 / 3600), 1);

{
  const a = allFromKnotsField(10, 'knot');
  close(a.kmh, 18.52);
  close(a.mph, 10 * (1852 / 1609.344));
}

assert.equal(parseSpeedInput('').blank, true);
assert.ok(parseSpeedInput('-1').error);
assert.match(shareResultText(allFromKnotsField(10, 'knot')), /18\.52/);

console.log('knots-to-kph calculation.test.ts: ok');
