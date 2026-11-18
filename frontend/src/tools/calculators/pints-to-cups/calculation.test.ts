import assert from 'node:assert/strict';
import {
  calculatePintsToCups,
  cupsToPints,
  pintsToCups,
  shareResultText,
} from './calculation';
import {
  CUPS_PER_US_PINT,
  LITERS_PER_CUP,
  LITERS_PER_PINT,
  ML_PER_IMP_CUP,
  ML_PER_IMP_PINT,
  ML_PER_US_CUP,
  ML_PER_US_PINT,
} from './types';
import { parseOptionalNumber, validatePintsToCups } from './validation';

function close(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(CUPS_PER_US_PINT, 2);
assert.equal(LITERS_PER_CUP.usCustomary, 0.2365882365);
assert.equal(LITERS_PER_PINT.usLiquid, 0.473176473);
assert.equal(ML_PER_US_PINT, 473.176473);
assert.equal(ML_PER_US_CUP, 236.5882365);
assert.equal(ML_PER_IMP_PINT, 568.26125);
assert.equal(ML_PER_IMP_CUP, 284.130625);

assert.equal(pintsToCups(0), 0);
close(pintsToCups(0.25), 0.5, 10);
close(pintsToCups(0.5), 1, 10);
close(pintsToCups(1), 2, 10);
close(pintsToCups(1.5), 3, 10);
close(pintsToCups(2), 4, 10);
close(pintsToCups(5), 10, 10);
close(pintsToCups(10), 20, 10);
close(cupsToPints(1), 0.5, 10);
close(cupsToPints(2), 1, 10);
close(cupsToPints(6), 3, 10);
close(cupsToPints(8), 4, 10);

close(pintsToCups(1, 'imperial', 'imperial'), 2, 10);
close(
  pintsToCups(1, 'usLiquid', 'metric'),
  LITERS_PER_PINT.usLiquid / LITERS_PER_CUP.metric,
  5,
);

assert.throws(() => pintsToCups(-1));
assert.throws(() => cupsToPints(-1));

{
  const result = calculatePintsToCups({
    source: 'pints',
    value: 3,
    cupUnit: 'usCustomary',
    pintUnit: 'usLiquid',
  });
  close(result.cups, 6, 10);
  assert.match(shareResultText(result), /Pints to Cups Converter/);
  assert.match(shareResultText(result), /6/);
}

{
  const result = calculatePintsToCups({
    source: 'cups',
    value: 5,
    cupUnit: 'usCustomary',
    pintUnit: 'usLiquid',
  });
  close(result.pints, 2.5, 10);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  !validatePintsToCups({
    source: 'pints',
    value: null,
    cupUnit: 'usCustomary',
    pintUnit: 'usLiquid',
  }).isValid,
);
assert.ok(
  !validatePintsToCups({
    source: 'pints',
    value: -1,
    cupUnit: 'usCustomary',
    pintUnit: 'usLiquid',
  }).isValid,
);

console.log('pints-to-cups calculation.test.ts: ok');
