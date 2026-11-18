import assert from 'node:assert/strict';
import {
  calculateCmToIn,
  centimetersToInches,
  inchesToCentimeters,
  shareResultText,
} from './calculation';
import { CM_PER_INCH } from './types';
import { validateCmToIn } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(CM_PER_INCH, 2.54);
assertClose(centimetersToInches(2.54), 1, 10);
assertClose(centimetersToInches(100), 39.3700787402, 8);
assertClose(centimetersToInches(36), 14.1732283465, 8);
assertClose(inchesToCentimeters(27), 68.58, 10);
assertClose(inchesToCentimeters(10), 25.4, 10);
assertClose(inchesToCentimeters(12), 30.48, 10);
assert.equal(centimetersToInches(0), 0);
assert.equal(inchesToCentimeters(0), 0);

assertClose(centimetersToInches(1), 1 / 2.54, 12);
assertClose(centimetersToInches(1e-9), 1e-9 / 2.54, 8);
assertClose(centimetersToInches(1e12), 1e12 / 2.54, 6);

{
  const inches = centimetersToInches(36);
  assertClose(inchesToCentimeters(inches), 36, 10);
}

{
  const result = calculateCmToIn({ source: 'centimeters', centimeters: 100, inches: null });
  assertClose(result.inches, 39.3700787402, 8);
  assert.match(shareResultText(result), /CM to IN/);
}

{
  const result = calculateCmToIn({ source: 'inches', centimeters: null, inches: 27 });
  assertClose(result.centimeters, 68.58, 10);
}

assert.ok(
  validateCmToIn({ source: 'centimeters', centimeters: 0, inches: null }).isValid,
);
assert.ok(
  !validateCmToIn({ source: 'centimeters', centimeters: -1, inches: null }).isValid,
);
assert.ok(
  !validateCmToIn({ source: 'centimeters', centimeters: null, inches: null }).isValid,
);
assert.ok(
  !validateCmToIn({ source: 'inches', centimeters: null, inches: Number.NaN }).isValid,
);
assert.ok(
  !validateCmToIn({
    source: 'centimeters',
    centimeters: Number.POSITIVE_INFINITY,
    inches: null,
  }).isValid,
);

console.log('cm-to-in calculation.test.ts: ok');
