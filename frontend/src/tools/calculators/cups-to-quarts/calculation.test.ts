import assert from 'node:assert/strict';
import {
  calculateCupsToQuarts,
  cupsToQuarts,
  quartsToCups,
  shareResultText,
} from './calculation';
import { LITERS_PER_CUP, LITERS_PER_QUART } from './types';
import { parseOptionalNumber, validateCupsToQuarts } from './validation';

function close(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(LITERS_PER_CUP.usCustomary, 0.2365882365);
assert.equal(LITERS_PER_QUART.usLiquid, 0.946352946);
assert.equal(LITERS_PER_QUART.usDry, 1.101220942715);
assert.equal(LITERS_PER_QUART.imperial, 1.1365225);

assert.equal(cupsToQuarts(0), 0);
close(cupsToQuarts(1), 0.25, 10);
close(cupsToQuarts(2), 0.5, 10);
close(cupsToQuarts(3), 0.75, 10);
close(cupsToQuarts(4), 1, 10);
close(cupsToQuarts(8), 2, 10);
close(cupsToQuarts(12), 3, 10);
close(quartsToCups(1), 4, 10);
close(quartsToCups(3), 12, 10);

close(cupsToQuarts(4, 'imperial', 'imperial'), 1, 10);
close(
  cupsToQuarts(1, 'metric', 'usLiquid'),
  LITERS_PER_CUP.metric / LITERS_PER_QUART.usLiquid,
  5,
);

assert.throws(() => cupsToQuarts(-1));
assert.throws(() => quartsToCups(-1));

{
  const result = calculateCupsToQuarts({
    source: 'cups',
    value: 8,
    cupUnit: 'usCustomary',
    quartUnit: 'usLiquid',
  });
  close(result.quarts, 2, 10);
  assert.match(shareResultText(result), /2/);
  assert.match(shareResultText(result), /Quarts/);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  !validateCupsToQuarts({
    source: 'cups',
    value: null,
    cupUnit: 'usCustomary',
    quartUnit: 'usLiquid',
  }).isValid,
);

console.log('cups-to-quarts calculation.test.ts: ok');
