import assert from 'node:assert/strict';
import {
  formatLength,
  metersFromUnit,
  shareResultText,
  syncUnitsFromMeters,
  valueInUnit,
} from './calculation';
import { convertLength } from './units';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(convertLength(1, 'cm', 'mm'), 10, 10);
assertClose(convertLength(100, 'cm', 'm'), 1, 10);
assertClose(convertLength(2.54, 'cm', 'in'), 1, 10);
assertClose(convertLength(30.48, 'cm', 'ft'), 1, 10);
assertClose(convertLength(91.44, 'cm', 'yd'), 1, 10);
assertClose(convertLength(160934.4, 'cm', 'mi'), 1, 10);
assertClose(convertLength(1, 'km', 'cm'), 100000, 10);
assert.equal(convertLength(0, 'cm', 'in'), 0);

{
  const meters = metersFromUnit(2.54, 'cm');
  const values = syncUnitsFromMeters(meters, 'thou', 'um');
  assertClose(values.in, 1, 10);
  assertClose(values.mm, 25.4, 10);
  assertClose(values.m, 0.0254, 10);
  assertClose(valueInUnit(meters, 'thou'), 1000, 8);
  assert.match(shareResultText(meters, 'cm'), /Centimeter Calculator/);
}

{
  const meters = metersFromUnit(30.48, 'cm');
  assertClose(valueInUnit(meters, 'ft'), 1, 10);
  assertClose(valueInUnit(meters, 'in'), 12, 10);
}

assert.equal(formatLength(0), '0');
assert.ok(!formatLength(Number.NaN));
assert.ok(!formatLength(Number.POSITIVE_INFINITY));

console.log('centimeter calculation.test.ts: ok');
