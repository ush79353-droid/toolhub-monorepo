import assert from 'node:assert/strict';
import {
  ARCSECONDS_PER_DEGREE,
  arcsecondsToDegrees,
  calculateDegreesToSeconds,
  degreesToArcseconds,
  degreesToArcsecondsTableRows,
  formatAngleValue,
  shareResultText,
} from './calculation';
import { parseOptionalNumber, validateDegreesToSeconds } from './validation';

assert.equal(ARCSECONDS_PER_DEGREE, 3600);

assert.equal(degreesToArcseconds(0), 0);
assert.equal(degreesToArcseconds(1), 3600);
assert.equal(degreesToArcseconds(0.5), 1800);
assert.equal(degreesToArcseconds(0.25), 900);
assert.equal(degreesToArcseconds(30), 108000);
assert.equal(degreesToArcseconds(90), 324000);
assert.equal(degreesToArcseconds(180), 648000);
assert.equal(degreesToArcseconds(360), 1296000);
assert.equal(degreesToArcseconds(-2), -7200);
assert.equal(degreesToArcseconds(0.001), 3.6);

assert.equal(arcsecondsToDegrees(0), 0);
assert.equal(arcsecondsToDegrees(3600), 1);
assert.equal(arcsecondsToDegrees(7200), 2);
assert.equal(arcsecondsToDegrees(1800), 0.5);
assert.equal(arcsecondsToDegrees(108000), 30);
assert.equal(arcsecondsToDegrees(-7200), -2);

{
  const fromDeg = calculateDegreesToSeconds({ source: 'degrees', value: 5 });
  assert.equal(fromDeg.arcseconds, 18000);
  assert.equal(fromDeg.arcminutes, 300);
}

{
  const fromSec = calculateDegreesToSeconds({ source: 'arcseconds', value: 18000 });
  assert.equal(fromSec.degrees, 5);
}

{
  const fromMin = calculateDegreesToSeconds({ source: 'arcminutes', value: 60 });
  assert.equal(fromMin.degrees, 1);
  assert.equal(fromMin.arcseconds, 3600);
}

{
  const fromRev = calculateDegreesToSeconds({ source: 'revolutions', value: 1 });
  assert.equal(fromRev.degrees, 360);
  assert.equal(fromRev.arcseconds, 1296000);
}

{
  const roundTrip = arcsecondsToDegrees(degreesToArcseconds(-7.25));
  assert.equal(roundTrip, -7.25);
}

assert.match(
  shareResultText(calculateDegreesToSeconds({ source: 'degrees', value: 30 })),
  /108000/,
);
assert.ok(formatAngleValue(3600).length > 0);

{
  const rows = degreesToArcsecondsTableRows([1, 90]);
  assert.equal(rows[0]?.arcseconds, 3600);
  assert.equal(rows[1]?.arcseconds, 324000);
}

assert.throws(() => degreesToArcseconds(Number.NaN));
assert.throws(() => arcsecondsToDegrees(Number.POSITIVE_INFINITY));
assert.equal(parseOptionalNumber(''), null);
assert.ok(!validateDegreesToSeconds({ source: 'degrees', value: null }).isValid);
assert.ok(validateDegreesToSeconds({ source: 'arcseconds', value: -1 }).isValid);

console.log('degrees-to-seconds calculation.test.ts: ok');
