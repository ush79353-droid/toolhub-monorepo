import assert from 'node:assert/strict';
import {
  calculateCcToMl,
  ccToLiters,
  ccToMl,
  litersToCc,
  litersToMl,
  mlToCc,
  mlToLiters,
  shareResultText,
} from './calculation';
import { ML_PER_LITER } from './types';
import { parseOptionalNumber, validateCcToMl } from './validation';

assert.equal(ML_PER_LITER, 1000);
assert.equal(ccToMl(1), 1);
assert.equal(ccToMl(5), 5);
assert.equal(ccToMl(10), 10);
assert.equal(ccToMl(100), 100);
assert.equal(ccToMl(250), 250);
assert.equal(ccToMl(500), 500);
assert.equal(ccToMl(1000), 1000);
assert.equal(mlToCc(0.5), 0.5);
assert.equal(ccToLiters(1000), 1);
assert.equal(ccToLiters(500), 0.5);
assert.equal(ccToLiters(100), 0.1);
assert.equal(litersToCc(1), 1000);
assert.equal(litersToMl(2.5), 2500);
assert.equal(mlToLiters(750), 0.75);
assert.equal(ccToMl(0), 0);

{
  const result = calculateCcToMl({ source: 'cc', cc: 250, ml: null, liters: null });
  assert.equal(result.ml, 250);
  assert.equal(result.liters, 0.25);
  assert.match(shareResultText(result), /cc to mL/);
}

{
  const result = calculateCcToMl({ source: 'ml', cc: null, ml: 750, liters: null });
  assert.equal(result.cc, 750);
  assert.equal(result.liters, 0.75);
}

{
  const result = calculateCcToMl({ source: 'liters', cc: null, ml: null, liters: 2.5 });
  assert.equal(result.cc, 2500);
  assert.equal(result.ml, 2500);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(!validateCcToMl({ source: 'cc', cc: -1, ml: null, liters: null }).isValid);
assert.ok(!validateCcToMl({ source: 'cc', cc: null, ml: null, liters: null }).isValid);

console.log('cc-to-ml calculation.test.ts: ok');
