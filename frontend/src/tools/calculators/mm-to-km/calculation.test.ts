import assert from 'node:assert/strict';
import {
  MM_PER_KILOMETER,
  calculateMmToKm,
  formatLength,
  kilometersToMillimeters,
  millimetersToKilometers,
  shareResultText,
} from './calculation';

function assertClose(actual: number, expected: number, digits = 12): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(MM_PER_KILOMETER, 1_000_000);

assert.equal(millimetersToKilometers(1), 0.000001);
assert.equal(millimetersToKilometers(10), 0.00001);
assert.equal(millimetersToKilometers(100), 0.0001);
assert.equal(millimetersToKilometers(1000), 0.001);
assert.equal(millimetersToKilometers(5000), 0.005);
assert.equal(millimetersToKilometers(10000), 0.01);
assert.equal(millimetersToKilometers(100000), 0.1);
assert.equal(millimetersToKilometers(500000), 0.5);
assert.equal(millimetersToKilometers(1_000_000), 1);

assert.equal(kilometersToMillimeters(1), 1_000_000);
assert.equal(kilometersToMillimeters(2), 2_000_000);
assert.equal(kilometersToMillimeters(2.5), 2_500_000);
assert.equal(kilometersToMillimeters(0.001), 1000);
assert.equal(kilometersToMillimeters(0.000001), 1);

{
  const one = calculateMmToKm({ source: 'mm', mm: 1, km: null });
  assert.equal(one.km, 0.000001);
  assert.notEqual(formatLength(one.km), '0');
  assert.ok(one.otherUnits.some((u) => u.id === 'm'));
}

assert.match(
  shareResultText(calculateMmToKm({ source: 'mm', mm: 5000, km: null })),
  /mm to km Conversion/,
);
assert.match(
  shareResultText(calculateMmToKm({ source: 'mm', mm: 5000, km: null })),
  /5000 mm = 0.005 km/,
);
assert.match(
  shareResultText(calculateMmToKm({ source: 'mm', mm: 5000, km: null })),
  /\/tools\/mm-to-km-conversion/,
);

assertClose(millimetersToKilometers(2500), 0.0025);

console.log('mm-to-km calculation.test.ts: ok');
