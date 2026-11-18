import assert from 'node:assert/strict';
import {
  calculateGalToQuarts,
  convertGallonsQuarts,
  shareResultText,
} from './calculation';
import { parseOptionalNumber, validateGalToQuarts } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(convertGallonsQuarts(1, 'usGal', 'usQt'), 4, 10);
assertClose(convertGallonsQuarts(2, 'usGal', 'usQt'), 8, 10);
assertClose(convertGallonsQuarts(3, 'usGal', 'usQt'), 12, 10);
assertClose(convertGallonsQuarts(5, 'usGal', 'usQt'), 20, 10);
assertClose(convertGallonsQuarts(1, 'ukGal', 'ukQt'), 4, 10);
assertClose(convertGallonsQuarts(2, 'ukGal', 'ukQt'), 8, 10);
assertClose(convertGallonsQuarts(8, 'usQt', 'usGal'), 2, 10);
assertClose(convertGallonsQuarts(12, 'usQt', 'usGal'), 3, 10);
assertClose(convertGallonsQuarts(16, 'ukQt', 'ukGal'), 4, 10);
assertClose(convertGallonsQuarts(1, 'usGal', 'ukQt'), 3.785411784 / 1.1365225, 10);
assertClose(convertGallonsQuarts(1, 'ukGal', 'usQt'), 4.54609 / 0.946352946, 10);
assert.equal(convertGallonsQuarts(0, 'usGal', 'usQt'), 0);

assert.throws(() => convertGallonsQuarts(-1, 'usGal', 'usQt'));

{
  const quarts = convertGallonsQuarts(2.75, 'usGal', 'ukQt');
  assertClose(convertGallonsQuarts(quarts, 'ukQt', 'usGal'), 2.75, 10);
}

{
  const result = calculateGalToQuarts({
    source: 'gallons',
    value: 3,
    gallonUnit: 'usGal',
    quartUnit: 'usQt',
  });
  assertClose(result.quarts, 12, 10);
  assert.match(shareResultText(result), /Gallons to Quarts/);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  validateGalToQuarts({
    source: 'gallons',
    value: 0,
    gallonUnit: 'usGal',
    quartUnit: 'usQt',
  }).isValid,
);
assert.ok(
  !validateGalToQuarts({
    source: 'gallons',
    value: -1,
    gallonUnit: 'usGal',
    quartUnit: 'usQt',
  }).isValid,
);

console.log('gallons-to-quarts calculation.test.ts: ok');
