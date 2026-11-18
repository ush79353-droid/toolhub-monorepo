import assert from 'node:assert/strict';
import {
  calculateCupsToOz,
  cupsToFluidOunces,
  fluidOuncesToCups,
  shareResultText,
} from './calculation';
import { LITERS_PER_CUP, LITERS_PER_FLUID_OUNCE } from './types';
import { parseOptionalNumber, validateCupsToOz } from './validation';

function close(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(LITERS_PER_CUP.usCustomary, 0.2365882365);
assert.equal(LITERS_PER_FLUID_OUNCE.usFlOz, 0.0295735295625);
assert.equal(LITERS_PER_FLUID_OUNCE.impFlOz, 0.0284130625);

assert.equal(cupsToFluidOunces(0), 0);
close(cupsToFluidOunces(1), 8, 10);
close(cupsToFluidOunces(2), 16, 10);
close(cupsToFluidOunces(3), 24, 10);
close(cupsToFluidOunces(4), 32, 10);
close(cupsToFluidOunces(7.7), 61.6, 10);
close(fluidOuncesToCups(62), 7.75, 10);
close(fluidOuncesToCups(16), 2, 10);

close(cupsToFluidOunces(1, 'imperial', 'impFlOz'), 10, 10);
close(
  cupsToFluidOunces(1, 'metric', 'usFlOz'),
  LITERS_PER_CUP.metric / LITERS_PER_FLUID_OUNCE.usFlOz,
  8,
);
close(
  cupsToFluidOunces(1, 'usLegal', 'usFlOz'),
  LITERS_PER_CUP.usLegal / LITERS_PER_FLUID_OUNCE.usFlOz,
  8,
);

assert.throws(() => cupsToFluidOunces(-1));
assert.throws(() => fluidOuncesToCups(-1));

{
  const result = calculateCupsToOz({
    source: 'cups',
    value: 3,
    cupUnit: 'usCustomary',
    ounceUnit: 'usFlOz',
  });
  close(result.ounces, 24, 10);
  assert.match(shareResultText(result), /24/);
  assert.match(shareResultText(result), /Fluid Ounces/);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  !validateCupsToOz({
    source: 'cups',
    value: null,
    cupUnit: 'usCustomary',
    ounceUnit: 'usFlOz',
  }).isValid,
);

console.log('cups-to-oz calculation.test.ts: ok');
