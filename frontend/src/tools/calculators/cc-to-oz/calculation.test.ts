import assert from 'node:assert/strict';
import {
  calculateCcToOz,
  ccToFluidOunces,
  fluidOuncesToCc,
  shareResultText,
} from './calculation';
import { CC_PER_UK_FL_OZ, CC_PER_US_FL_OZ } from './types';
import { parseOptionalNumber, validateCcToOz } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(CC_PER_US_FL_OZ, 29.5735295625);
assert.equal(CC_PER_UK_FL_OZ, 28.4130625);
assert.equal(ccToFluidOunces(0, 'us'), 0);
assertClose(ccToFluidOunces(1, 'us'), 0.0338140227, 8);
assertClose(ccToFluidOunces(10, 'us'), 0.338140227, 8);
assertClose(ccToFluidOunces(30, 'us'), 1.014420681, 8);
assertClose(ccToFluidOunces(100, 'us'), 3.38140227, 8);
assertClose(ccToFluidOunces(250, 'us'), 8.453505675, 8);
assertClose(ccToFluidOunces(500, 'us'), 16.90701135, 8);
assertClose(ccToFluidOunces(1000, 'us'), 33.8140227, 8);
assert.equal(fluidOuncesToCc(1, 'us'), 29.5735295625);
assert.equal(fluidOuncesToCc(2, 'us'), 59.147059125);
assert.equal(fluidOuncesToCc(5, 'us'), 147.8676478125);
assert.equal(fluidOuncesToCc(1, 'uk'), 28.4130625);
assertClose(ccToFluidOunces(100, 'uk'), 3.51950797278, 8);

{
  const result = calculateCcToOz({ source: 'cc', system: 'us', cc: 100, oz: null });
  assertClose(result.oz, 3.38140227, 8);
  assert.match(shareResultText(result), /CC to OZ/);
}

{
  const result = calculateCcToOz({ source: 'oz', system: 'us', cc: null, oz: 1 });
  assert.equal(result.cc, 29.5735295625);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  !validateCcToOz({ source: 'cc', system: 'us', cc: -1, oz: null }).isValid,
);

console.log('cc-to-oz calculation.test.ts: ok');
