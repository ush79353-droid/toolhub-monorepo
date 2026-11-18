import assert from 'node:assert/strict';
import { calculateGalToPints, convertVolume, shareResultText } from './calculation';
import { parseOptionalNumber, validateGalToPints } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(convertVolume(1, 'usGal', 'usPt'), 8, 10);
assertClose(convertVolume(1, 'ukGal', 'ukPt'), 8, 10);
assertClose(convertVolume(40, 'usPt', 'usGal'), 5, 10);
assertClose(convertVolume(50, 'usPt', 'usGal'), 6.25, 10);
assertClose(convertVolume(5, 'usGal', 'usPt'), 40, 10);
assertClose(convertVolume(16, 'usPt', 'usGal'), 2, 10);
assertClose(convertVolume(1, 'usGal', 'ukGal'), 3.785411784 / 4.54609, 10);
assertClose(convertVolume(1, 'usGal', 'ukPt'), 3.785411784 / 0.56826125, 10);
assertClose(convertVolume(1, 'ukGal', 'usPt'), 4.54609 / 0.473176473, 10);
assert.equal(convertVolume(0, 'usGal', 'usPt'), 0);

assert.throws(() => convertVolume(-1, 'usGal', 'usPt'));

{
  const pints = convertVolume(3.75, 'usGal', 'ukPt');
  assertClose(convertVolume(pints, 'ukPt', 'usGal'), 3.75, 10);
}

{
  const result = calculateGalToPints({ source: 'usGal', value: 1 });
  assertClose(result.usPt, 8, 10);
  assertClose(result.ukPt, 3.785411784 / 0.56826125, 10);
  assert.match(shareResultText(result), /Gallons to Pints/);
}

{
  const result = calculateGalToPints({ source: 'ukGal', value: 1 });
  assertClose(result.ukPt, 8, 10);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(validateGalToPints({ source: 'usGal', value: 0 }).isValid);
assert.ok(!validateGalToPints({ source: 'usGal', value: -1 }).isValid);
assert.ok(!validateGalToPints({ source: 'usGal', value: null }).isValid);

console.log('gallons-to-pints calculation.test.ts: ok');
