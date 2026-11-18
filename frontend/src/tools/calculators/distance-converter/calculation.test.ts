import assert from 'node:assert/strict';
import {
  calculateDistance,
  convertDistance,
  formatLength,
  shareResultText,
} from './calculation';
import { parseOptionalNumber, validateDistance } from './validation';

function close(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(convertDistance(1, 'm', 'cm'), 100);
assert.equal(convertDistance(1, 'm', 'mm'), 1000);
assert.equal(convertDistance(1, 'km', 'm'), 1000);
close(convertDistance(1, 'ft', 'in'), 12, 12);
close(convertDistance(1, 'yd', 'ft'), 3, 12);
close(convertDistance(1, 'mi', 'km'), 1.609344, 12);
close(convertDistance(1, 'in', 'cm'), 2.54, 12);
close(convertDistance(10, 'ft', 'm'), 3.048, 12);
close(convertDistance(5, 'km', 'mi'), 3.1068559612, 8);
assert.equal(convertDistance(1, 'nmi', 'm'), 1852);
assert.equal(convertDistance(0, 'm', 'ft'), 0);

{
  const oneMeter = calculateDistance({ source: 'm', value: 1 });
  assert.equal(oneMeter.values.mm, 1000);
  assert.equal(oneMeter.values.cm, 100);
  assert.equal(oneMeter.values.km, 0.001);
  close(oneMeter.values.in, 39.3700787402, 8);
  close(oneMeter.values.ft, 3.280839895, 8);
  close(oneMeter.values.yd, 1.0936132983, 8);
  close(oneMeter.values.mi, 0.0006213711922, 8);
}

{
  const tenFeet = calculateDistance({ source: 'ft', value: 10 });
  assert.equal(tenFeet.values.mm, 3048);
  close(tenFeet.values.cm, 304.8, 10);
  close(tenFeet.values.m, 3.048, 12);
  assert.equal(tenFeet.values.in, 120);
  close(tenFeet.values.yd, 10 / 3, 10);
}

{
  const roundTrip = convertDistance(convertDistance(12.5, 'km', 'mi'), 'mi', 'km');
  close(roundTrip, 12.5, 10);
}

assert.throws(() => convertDistance(Number.NaN, 'm', 'ft'));
assert.match(shareResultText(calculateDistance({ source: 'm', value: 1 })), /meters|m:/i);
assert.ok(formatLength(1000).length > 0);

assert.equal(parseOptionalNumber(''), null);
assert.ok(!validateDistance({ source: 'm', value: null }).isValid);
assert.ok(!validateDistance({ source: 'm', value: -1 }).isValid);
assert.ok(validateDistance({ source: 'ft', value: 0 }).isValid);

console.log('distance-converter calculation.test.ts: ok');
