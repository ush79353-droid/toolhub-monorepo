import assert from 'node:assert/strict';
import {
  calculateCupsToPints,
  cupsToPints,
  pintsToCups,
  shareResultText,
} from './calculation';
import { LITERS_PER_CUP, LITERS_PER_PINT } from './types';
import { parseOptionalNumber, validateCupsToPints } from './validation';

function close(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(LITERS_PER_CUP.usCustomary, 0.2365882365);
assert.equal(LITERS_PER_PINT.usLiquid, 0.473176473);
assert.equal(LITERS_PER_PINT.imperial, 0.56826125);
assert.equal(LITERS_PER_PINT.usDry, 0.5506104713575);

assert.equal(cupsToPints(0), 0);
close(cupsToPints(1), 0.5, 10);
close(cupsToPints(2), 1, 10);
close(cupsToPints(3), 1.5, 10);
close(cupsToPints(4), 2, 10);
close(cupsToPints(8), 4, 10);
close(cupsToPints(9), 4.5, 10);
close(pintsToCups(1), 2, 10);
close(pintsToCups(2.5), 5, 10);

close(cupsToPints(1, 'imperial', 'imperial'), 0.5, 10);
close(
  cupsToPints(1, 'metric', 'usLiquid'),
  LITERS_PER_CUP.metric / LITERS_PER_PINT.usLiquid,
  5,
);

assert.throws(() => cupsToPints(-1));
assert.throws(() => pintsToCups(-1));

{
  const result = calculateCupsToPints({
    source: 'cups',
    value: 3,
    cupUnit: 'usCustomary',
    pintUnit: 'usLiquid',
  });
  close(result.pints, 1.5, 10);
  assert.match(shareResultText(result), /1\.5/);
  assert.match(shareResultText(result), /Pints/);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  !validateCupsToPints({
    source: 'cups',
    value: null,
    cupUnit: 'usCustomary',
    pintUnit: 'usLiquid',
  }).isValid,
);

console.log('cups-to-pints calculation.test.ts: ok');
