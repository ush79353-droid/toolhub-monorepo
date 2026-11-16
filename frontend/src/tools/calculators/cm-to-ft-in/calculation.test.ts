import assert from 'node:assert/strict';
import {
  calculateCmToFtIn,
  centimetersToFeetInches,
  feetInchesToCentimeters,
  shareResultText,
} from './calculation';
import { validateCmToFtIn } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(feetInchesToCentimeters(5, 8), 172.72, 10);
assertClose(feetInchesToCentimeters(5, 10), 177.8, 10);
assertClose(feetInchesToCentimeters(6, 0), 182.88, 10);
assertClose(feetInchesToCentimeters(0, 12), 30.48, 10);

assert.deepEqual(centimetersToFeetInches(0), { feet: 0, inches: 0 });
assert.equal(centimetersToFeetInches(182.88).feet, 6);
assertClose(centimetersToFeetInches(182.88).inches, 0, 10);
assert.equal(centimetersToFeetInches(178).feet, 5);
assertClose(centimetersToFeetInches(178).inches, 10.0787401575, 8);

{
  const result = calculateCmToFtIn({
    source: 'centimeters',
    centimeters: 178,
    feet: null,
    inches: null,
  });
  assert.equal(result.feet, 5);
  assertClose(result.inches, 10.0787401575, 8);
  assert.match(shareResultText(result), /CM to Ft In/);
}

{
  const result = calculateCmToFtIn({
    source: 'feetInches',
    centimeters: null,
    feet: 5,
    inches: 8,
  });
  assertClose(result.centimeters, 172.72, 10);
}

assert.ok(
  validateCmToFtIn({
    source: 'centimeters',
    centimeters: 0,
    feet: null,
    inches: null,
  }).isValid,
);
assert.ok(
  !validateCmToFtIn({
    source: 'centimeters',
    centimeters: -1,
    feet: null,
    inches: null,
  }).isValid,
);
assert.ok(
  !validateCmToFtIn({
    source: 'feetInches',
    centimeters: null,
    feet: null,
    inches: null,
  }).isValid,
);

console.log('cm-to-ft-in calculation.test.ts: ok');
