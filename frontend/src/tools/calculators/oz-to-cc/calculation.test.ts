import assert from 'node:assert/strict';
import {
  CC_PER_UK_FL_OZ,
  CC_PER_US_FL_OZ,
  calculateOzToCc,
  ccToFluidOunces,
  fluidOuncesToCc,
  shareResultText,
} from './calculation';
import { validateOzToCc } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(CC_PER_US_FL_OZ, 29.5735295625);
assert.equal(CC_PER_UK_FL_OZ, 28.4130625);

assert.equal(fluidOuncesToCc(0, 'us'), 0);
assert.equal(fluidOuncesToCc(1, 'us'), 29.5735295625);
assert.equal(fluidOuncesToCc(2, 'us'), 59.147059125);
assert.equal(fluidOuncesToCc(5, 'us'), 147.8676478125);
assert.equal(fluidOuncesToCc(8, 'us'), 236.5882365);
assert.equal(fluidOuncesToCc(10, 'us'), 295.735295625);
assert.equal(fluidOuncesToCc(16, 'us'), 473.176473);
assert.equal(fluidOuncesToCc(32, 'us'), 946.352946);

assert.equal(fluidOuncesToCc(1, 'uk'), 28.4130625);
assert.equal(fluidOuncesToCc(5, 'uk'), 142.0653125);
assert.equal(fluidOuncesToCc(10, 'uk'), 284.130625);
assert.equal(fluidOuncesToCc(100, 'uk'), 2841.30625);

assertClose(ccToFluidOunces(100, 'us'), 3.3814022702, 8);

{
  const one = calculateOzToCc({ source: 'oz', system: 'us', oz: 1, cc: null });
  assert.equal(one.cc, 29.5735295625);
}

{
  const fromCc = calculateOzToCc({ source: 'cc', system: 'us', oz: null, cc: 100 });
  assertClose(fromCc.oz, 3.3814022702, 8);
}

{
  const neg = validateOzToCc({ source: 'oz', system: 'us', oz: -1, cc: null });
  assert.equal(neg.isValid, false);
}

assert.match(
  shareResultText(calculateOzToCc({ source: 'oz', system: 'us', oz: 8, cc: null })),
  /oz to cc Converter/,
);
assert.match(
  shareResultText(calculateOzToCc({ source: 'oz', system: 'us', oz: 8, cc: null })),
  /8 US fl oz = 236\.5882365 cc/,
);
assert.match(
  shareResultText(calculateOzToCc({ source: 'oz', system: 'us', oz: 8, cc: null })),
  /\/tools\/oz-to-cc-converter/,
);

console.log('oz-to-cc calculation.test.ts: ok');
