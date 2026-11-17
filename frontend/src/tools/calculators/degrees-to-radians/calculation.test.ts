import assert from 'node:assert/strict';
import {
  calculateDegreesToRadians,
  degreesToRadians,
  formatAngleValue,
  piLabelForDegrees,
  radiansToDegrees,
  shareResultText,
} from './calculation';
import { parseOptionalNumber, validateDegreesToRadians } from './validation';

function close(actual: number, expected: number, digits = 12): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(degreesToRadians(0), 0);
close(degreesToRadians(180), Math.PI, 12);
close(degreesToRadians(90), Math.PI / 2, 12);
close(degreesToRadians(45), Math.PI / 4, 12);
close(degreesToRadians(60), Math.PI / 3, 12);
close(degreesToRadians(30), Math.PI / 6, 12);
close(degreesToRadians(360), 2 * Math.PI, 12);
close(degreesToRadians(-90), -Math.PI / 2, 12);

assert.equal(radiansToDegrees(0), 0);
close(radiansToDegrees(Math.PI), 180, 10);
close(radiansToDegrees(Math.PI / 2), 90, 10);
close(radiansToDegrees(Math.PI / 4), 45, 10);
close(radiansToDegrees(2 * Math.PI), 360, 10);

{
  const forward = calculateDegreesToRadians({ source: 'degrees', value: 90 });
  close(forward.radians, Math.PI / 2, 12);
  assert.equal(forward.piLabel, 'π/2');
}

{
  const reverse = calculateDegreesToRadians({ source: 'radians', value: Math.PI });
  close(reverse.degrees, 180, 10);
  assert.equal(reverse.piLabel, 'π');
}

{
  const roundTrip = radiansToDegrees(degreesToRadians(-37.5));
  close(roundTrip, -37.5, 10);
}

assert.equal(piLabelForDegrees(180), 'π');
assert.equal(piLabelForDegrees(-90), '−π/2');
assert.equal(piLabelForDegrees(17), null);

assert.match(
  shareResultText(calculateDegreesToRadians({ source: 'degrees', value: 180 })),
  /π \/ 180/,
);
assert.ok(formatAngleValue(Math.PI).length > 0);

assert.throws(() => degreesToRadians(Number.NaN));
assert.throws(() => radiansToDegrees(Number.POSITIVE_INFINITY));
assert.equal(parseOptionalNumber(''), null);
assert.equal(parseOptionalNumber('-'), null);
assert.ok(!validateDegreesToRadians({ source: 'degrees', value: null }).isValid);
assert.ok(validateDegreesToRadians({ source: 'radians', value: -1 }).isValid);

console.log('degrees-to-radians calculation.test.ts: ok');
