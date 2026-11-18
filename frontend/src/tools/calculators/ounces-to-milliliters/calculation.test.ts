import assert from 'node:assert/strict';
import {
  ML_PER_UK_FL_OZ,
  ML_PER_US_FL_OZ,
  calculateOuncesToMilliliters,
  fluidOuncesToMilliliters,
  millilitersToFluidOunces,
  shareResultText,
} from './calculation';
import { validateOuncesToMilliliters } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(ML_PER_US_FL_OZ, 29.5735295625);
assert.equal(ML_PER_UK_FL_OZ, 28.4130625);

assert.equal(fluidOuncesToMilliliters(0, 'us'), 0);
assert.equal(fluidOuncesToMilliliters(1, 'us'), 29.5735295625);
assert.equal(fluidOuncesToMilliliters(2, 'us'), 59.147059125);
assert.equal(fluidOuncesToMilliliters(5, 'us'), 147.8676478125);
assert.equal(fluidOuncesToMilliliters(8, 'us'), 236.5882365);
assert.equal(fluidOuncesToMilliliters(10, 'us'), 295.735295625);
assert.equal(fluidOuncesToMilliliters(16, 'us'), 473.176473);
assert.equal(fluidOuncesToMilliliters(32, 'us'), 946.352946);

assert.equal(fluidOuncesToMilliliters(1, 'uk'), 28.4130625);
assert.equal(fluidOuncesToMilliliters(5, 'uk'), 142.0653125);
assert.equal(fluidOuncesToMilliliters(10, 'uk'), 284.130625);
assert.equal(fluidOuncesToMilliliters(100, 'uk'), 2841.30625);

assertClose(millilitersToFluidOunces(100, 'us'), 3.3814022702, 8);

{
  const one = calculateOuncesToMilliliters({
    source: 'oz',
    system: 'us',
    oz: 1,
    ml: null,
  });
  assert.equal(one.ml, 29.5735295625);
}

{
  const fromMl = calculateOuncesToMilliliters({
    source: 'ml',
    system: 'us',
    oz: null,
    ml: 100,
  });
  assertClose(fromMl.oz, 3.3814022702, 8);
}

{
  const neg = validateOuncesToMilliliters({
    source: 'oz',
    system: 'us',
    oz: -1,
    ml: null,
  });
  assert.equal(neg.isValid, false);
}

assert.match(
  shareResultText(
    calculateOuncesToMilliliters({ source: 'oz', system: 'us', oz: 8, ml: null }),
  ),
  /Ounces to Milliliters Converter/,
);
assert.match(
  shareResultText(
    calculateOuncesToMilliliters({ source: 'oz', system: 'us', oz: 8, ml: null }),
  ),
  /8 US fl oz = 236\.5882365 mL/,
);
assert.match(
  shareResultText(
    calculateOuncesToMilliliters({ source: 'oz', system: 'us', oz: 8, ml: null }),
  ),
  /\/tools\/ounces-to-milliliters-converter/,
);

console.log('ounces-to-milliliters calculation.test.ts: ok');
