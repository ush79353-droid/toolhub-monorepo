import assert from 'node:assert/strict';
import {
  MM_PER_METER,
  calculateMmToM,
  formatLength,
  metersToMillimeters,
  millimetersToMeters,
  shareResultText,
} from './calculation';

assert.equal(MM_PER_METER, 1000);

assert.equal(millimetersToMeters(1), 0.001);
assert.equal(millimetersToMeters(10), 0.01);
assert.equal(millimetersToMeters(100), 0.1);
assert.equal(millimetersToMeters(500), 0.5);
assert.equal(millimetersToMeters(1000), 1);
assert.equal(millimetersToMeters(1500), 1.5);
assert.equal(millimetersToMeters(2500), 2.5);
assert.equal(millimetersToMeters(10000), 10);
assert.equal(millimetersToMeters(100000), 100);

assert.equal(metersToMillimeters(1), 1000);
assert.equal(metersToMillimeters(2), 2000);
assert.equal(metersToMillimeters(2.5), 2500);
assert.equal(metersToMillimeters(0.001), 1);

{
  const one = calculateMmToM({ source: 'mm', mm: 1, m: null });
  assert.equal(one.m, 0.001);
  assert.notEqual(formatLength(one.m), '0');
  assert.ok(one.otherUnits.some((u) => u.id === 'cm'));
}

assert.match(
  shareResultText(calculateMmToM({ source: 'mm', mm: 2500, m: null })),
  /mm to m Conversion/,
);
assert.match(
  shareResultText(calculateMmToM({ source: 'mm', mm: 2500, m: null })),
  /2500 mm = 2.5 m/,
);
assert.match(
  shareResultText(calculateMmToM({ source: 'mm', mm: 2500, m: null })),
  /\/tools\/mm-to-m-conversion/,
);

console.log('mm-to-m calculation.test.ts: ok');
