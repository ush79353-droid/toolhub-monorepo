import assert from 'node:assert/strict';
import {
  calculateCupsToGal,
  cupsToGallons,
  gallonsToCups,
  shareResultText,
} from './calculation';
import { LITERS_PER_CUP, LITERS_PER_GALLON, LITERS_PER_US_GALLON } from './types';
import { parseOptionalNumber, validateCupsToGal } from './validation';

function close(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(LITERS_PER_CUP.usCustomary, 0.2365882365);
assert.equal(LITERS_PER_GALLON.usLiquid, LITERS_PER_US_GALLON);

assert.equal(cupsToGallons(0), 0);
close(cupsToGallons(16), 1, 10);
close(cupsToGallons(12), 0.75, 10);
close(cupsToGallons(20), 1.25, 10);
close(gallonsToCups(0.5), 8, 10);
close(cupsToGallons(32), 2, 10);

close(cupsToGallons(4, 'metric', 'usLiquid'), (4 * 0.25) / LITERS_PER_US_GALLON, 9);
close(cupsToGallons(16, 'imperial', 'ukImperial'), 1, 10);
close(
  cupsToGallons(16, 'usCustomary', 'ukImperial'),
  (16 * 0.2365882365) / 4.54609,
  9,
);

assert.throws(() => cupsToGallons(-1));
assert.throws(() => gallonsToCups(-1));

{
  const result = calculateCupsToGal({
    source: 'cups',
    value: 16,
    cupUnit: 'usCustomary',
    gallonUnit: 'usLiquid',
  });
  close(result.gallons, 1, 10);
  close(result.liters, LITERS_PER_US_GALLON, 10);
  close(result.extras.L, LITERS_PER_US_GALLON, 10);
  assert.match(shareResultText(result), /16/);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  !validateCupsToGal({
    source: 'cups',
    value: null,
    cupUnit: 'usCustomary',
    gallonUnit: 'usLiquid',
  }).isValid,
);

console.log('cups-to-gallons calculation.test.ts: ok');
