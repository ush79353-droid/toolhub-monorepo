import assert from 'node:assert/strict';
import {
  calculateRadiansToDegrees,
  degreesToRadians,
  formatAngleValue,
  piLabelForDegrees,
  radiansToDegrees,
  shareResultText,
} from './calculation';
import { parseOptionalNumber, parsePiExpression, validateRadiansToDegrees } from './validation';

function close(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(radiansToDegrees(0), 0);
close(radiansToDegrees(Math.PI), 180, 10);
close(radiansToDegrees(Math.PI / 2), 90, 10);
close(radiansToDegrees(Math.PI / 4), 45, 10);
close(radiansToDegrees(Math.PI / 3), 60, 10);
close(radiansToDegrees(Math.PI / 6), 30, 10);
close(radiansToDegrees(2 * Math.PI), 360, 10);
close(radiansToDegrees(1), 57.2957795131, 8);
close(radiansToDegrees(-Math.PI / 2), -90, 10);

close(degreesToRadians(180), Math.PI, 10);
close(degreesToRadians(90), Math.PI / 2, 10);
close(degreesToRadians(360), 2 * Math.PI, 10);

{
  const value = 2.75;
  close(degreesToRadians(radiansToDegrees(value)), value, 10);
}

{
  const result = calculateRadiansToDegrees({ source: 'radians', value: Math.PI });
  close(result.degrees, 180, 10);
  assert.equal(result.piLabel, 'π');
  close(result.extras.gradians, 200, 10);
  close(result.extras.turns, 0.5, 10);
  close(result.extras.arcminutes, 10800, 8);
  close(result.extras.milliradians, Math.PI * 1000, 10);
  assert.match(shareResultText(result), /Radians to Degrees Converter/);
}

{
  const result = calculateRadiansToDegrees({ source: 'degrees', value: 90 });
  close(result.radians, Math.PI / 2, 10);
  assert.equal(result.piLabel, 'π/2');
}

assert.equal(piLabelForDegrees(15), 'π/12');
assert.equal(piLabelForDegrees(-90), '−π/2');

close(parsePiExpression('pi')!, Math.PI, 12);
close(parsePiExpression('π')!, Math.PI, 12);
close(parsePiExpression('pi/2')!, Math.PI / 2, 12);
close(parsePiExpression('2*pi')!, 2 * Math.PI, 12);
close(parsePiExpression('2π')!, 2 * Math.PI, 12);
close(parsePiExpression('3*pi/2')!, (3 * Math.PI) / 2, 12);
close(parseOptionalNumber('π/4')!, Math.PI / 4, 12);
assert.ok(Number.isNaN(parsePiExpression('pi+1')!));
assert.equal(parseOptionalNumber(''), null);

assert.ok(formatAngleValue(Math.PI).length > 0);
assert.ok(validateRadiansToDegrees({ source: 'radians', value: -1 }).isValid);
assert.ok(!validateRadiansToDegrees({ source: 'radians', value: null }).isValid);

console.log('radians-to-degrees calculation.test.ts: ok');
