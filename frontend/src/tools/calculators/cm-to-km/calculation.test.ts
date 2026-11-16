import assert from 'node:assert/strict';
import {
  calculateCmToKm,
  centimetersToKilometers,
  formatLength,
  kilometersToCentimeters,
  shareResultText,
} from './calculation';
import { CM_PER_KM } from './types';
import { validateCmToKm } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(CM_PER_KM, 100_000);
assert.equal(centimetersToKilometers(100_000), 1);
assert.equal(centimetersToKilometers(50_000), 0.5);
assert.equal(centimetersToKilometers(1000), 0.01);
assert.equal(centimetersToKilometers(1), 0.00001);
assert.equal(kilometersToCentimeters(1), 100_000);
assert.equal(kilometersToCentimeters(2.5), 250_000);
assert.equal(kilometersToCentimeters(0.5), 50_000);
assert.equal(centimetersToKilometers(0), 0);

assert.equal(formatLength(0.00001), '0.00001');
assertClose(centimetersToKilometers(250_000), 2.5, 10);
assertClose(kilometersToCentimeters(10), 1_000_000, 10);

{
  const km = centimetersToKilometers(12345);
  assertClose(kilometersToCentimeters(km), 12345, 10);
}

{
  const result = calculateCmToKm({ source: 'cm', value: 100_000 });
  assert.equal(result.kilometers, 1);
  assertClose(result.values.m, 1000, 10);
  assert.match(shareResultText(result), /CM to KM/);
}

{
  const result = calculateCmToKm({ source: 'km', value: 2.5 });
  assert.equal(result.centimeters, 250_000);
}

{
  const result = calculateCmToKm({ source: 'm', value: 1 });
  assert.equal(result.centimeters, 100);
  assert.equal(result.kilometers, 0.001);
}

assert.ok(validateCmToKm({ source: 'cm', value: 0 }).isValid);
assert.ok(!validateCmToKm({ source: 'cm', value: -1 }).isValid);
assert.ok(!validateCmToKm({ source: 'cm', value: null }).isValid);
assert.ok(!validateCmToKm({ source: 'km', value: Number.NaN }).isValid);
assert.ok(!validateCmToKm({ source: 'km', value: Number.POSITIVE_INFINITY }).isValid);

console.log('cm-to-km calculation.test.ts: ok');
