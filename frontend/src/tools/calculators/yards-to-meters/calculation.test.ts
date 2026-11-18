import assert from 'node:assert/strict';
import {
  calculateYardsToMeters,
  metersToYards,
  shareResultText,
  yardsToMeters,
  yardsToMetersViaRegistry,
} from './calculation';
import { METERS_PER_YARD } from './types';
import { parseOptionalNumber, validateYardsToMeters } from './validation';

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
assertClose(yardsToMeters(25), 22.86, 12);
assertClose(yardsToMeters(100), 91.44, 12);
assertClose(yardsToMeters(120), 109.728, 12);
assertClose(metersToYards(1), 1.0936132983377078, 9);
assert.equal(yardsToMeters(0), 0);
assert.equal(metersToYards(0), 0);

{
  const yards = 87.5;
  const meters = yardsToMeters(yards);
  assertClose(metersToYards(meters), yards, 12);
}

assertClose(yardsToMetersViaRegistry(1), 0.9144, 12);
assertClose(yardsToMetersViaRegistry(10), yardsToMeters(10), 12);

{
  const result = calculateYardsToMeters({ source: 'yards', yards: 25, meters: null });
  assertClose(result.meters, 22.86, 12);
  assert.match(shareResultText(result), /Yards to Meters/);
}

{
  const result = calculateYardsToMeters({ source: 'meters', yards: null, meters: 50 });
  assertClose(result.yards, 54.68066491688539, 8);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(!validateYardsToMeters({ source: 'yards', yards: -1, meters: null }).isValid);
assert.ok(!validateYardsToMeters({ source: 'yards', yards: null, meters: null }).isValid);
assert.ok(validateYardsToMeters({ source: 'yards', yards: 10, meters: null }).isValid);
assert.ok(!validateYardsToMeters({ source: 'yards', yards: Number.NaN, meters: null }).isValid);

console.log('yards-to-meters calculation.test.ts: ok');
