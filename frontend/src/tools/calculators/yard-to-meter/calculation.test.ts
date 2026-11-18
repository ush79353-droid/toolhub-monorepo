import assert from 'node:assert/strict';
import {
  calculateYardToMeter,
  metersToYards,
  shareResultText,
  yardsToMeters,
  yardsToMetersViaRegistry,
} from './calculation';
import { METERS_PER_YARD } from './types';
import { parseOptionalNumber, validateYardToMeter } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(METERS_PER_YARD, 0.9144);
assert.equal(yardsToMeters(1), 0.9144);
assertClose(yardsToMeters(10), 9.144, 12);
assertClose(yardsToMeters(50), 45.72, 12);
assertClose(yardsToMeters(100), 91.44, 12);
assertClose(yardsToMeters(120), 109.728, 12);
assertClose(metersToYards(10), 10.936132983337708, 9);
assert.equal(yardsToMeters(0), 0);
assert.equal(metersToYards(0), 0);

{
  const original = 125.75;
  const converted = yardsToMeters(original);
  assertClose(metersToYards(converted), original, 12);
}

assertClose(yardsToMetersViaRegistry(1), 0.9144, 12);
assertClose(yardsToMetersViaRegistry(100), yardsToMeters(100), 12);

{
  const result = calculateYardToMeter({ source: 'yards', yards: 100, meters: null });
  assertClose(result.meters, 91.44, 12);
  assert.equal(result.otherUnits.length, 6);
  assert.equal(result.otherUnits[0]?.unit, 'mm');
  assertClose(result.otherUnits.find((r) => r.unit === 'ft')!.value, 300, 10);
  assert.match(shareResultText(result), /Yard to Meter/);
}

{
  const result = calculateYardToMeter({ source: 'meters', yards: null, meters: 10 });
  assertClose(result.yards, 10.936132983337708, 9);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(!validateYardToMeter({ source: 'yards', yards: -1, meters: null }).isValid);
assert.ok(!validateYardToMeter({ source: 'yards', yards: null, meters: null }).isValid);
assert.ok(validateYardToMeter({ source: 'yards', yards: 10, meters: null }).isValid);

console.log('yard-to-meter calculation.test.ts: ok');
