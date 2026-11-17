import assert from 'node:assert/strict';
import {
  calculateInToCm,
  centimetersToInches,
  inchesToCentimeters,
  inchesToCentimetersViaRegistry,
  shareResultText,
} from './calculation';
import { CENTIMETERS_PER_INCH } from './types';
import { parseOptionalNumber, validateInToCm } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(CENTIMETERS_PER_INCH, 2.54);
assert.equal(inchesToCentimeters(0), 0);
assertClose(inchesToCentimeters(1), 2.54, 12);
assertClose(inchesToCentimeters(2), 5.08, 12);
assertClose(inchesToCentimeters(5), 12.7, 12);
assertClose(inchesToCentimeters(10), 25.4, 12);
assertClose(inchesToCentimeters(12), 30.48, 12);
assertClose(inchesToCentimeters(22), 55.88, 12);
assertClose(inchesToCentimeters(24), 60.96, 12);
assertClose(inchesToCentimeters(36), 91.44, 12);
assertClose(inchesToCentimeters(50), 127, 12);
assertClose(inchesToCentimeters(72), 182.88, 12);
assertClose(inchesToCentimeters(100), 254, 12);
assertClose(inchesToCentimeters(1000), 2540, 12);

assertClose(centimetersToInches(1), 1 / 2.54, 10);
assertClose(centimetersToInches(2.54), 1, 12);
assertClose(centimetersToInches(10), 10 / 2.54, 10);
assertClose(centimetersToInches(25.4), 10, 12);
assertClose(centimetersToInches(30.48), 12, 12);
assertClose(centimetersToInches(50), 50 / 2.54, 10);
assertClose(centimetersToInches(100), 100 / 2.54, 10);
assertClose(centimetersToInches(152.4), 60, 12);
assertClose(centimetersToInches(182.88), 72, 12);
assertClose(centimetersToInches(254), 100, 12);

assertClose(inchesToCentimetersViaRegistry(1), 2.54, 12);
assertClose(inchesToCentimetersViaRegistry(12), inchesToCentimeters(12), 12);

{
  const roundTrip = centimetersToInches(inchesToCentimeters(99));
  assertClose(roundTrip, 99, 10);
}

{
  const result = calculateInToCm({ source: 'inches', inches: 72, centimeters: null });
  assertClose(result.centimeters, 182.88, 12);
  assert.match(shareResultText(result), /in to cm Converter/);
}

{
  const result = calculateInToCm({ source: 'centimeters', inches: null, centimeters: 254 });
  assertClose(result.inches, 100, 12);
}

assert.equal(parseOptionalNumber(''), null);
assert.equal(parseOptionalNumber('1e2'), 100);
assert.ok(validateInToCm({ source: 'inches', inches: -9, centimeters: null }).isValid);
assert.ok(!validateInToCm({ source: 'inches', inches: null, centimeters: null }).isValid);
assert.ok(!validateInToCm({ source: 'inches', inches: Number.NaN, centimeters: null }).isValid);

console.log('in-to-cm calculation.test.ts: ok');
