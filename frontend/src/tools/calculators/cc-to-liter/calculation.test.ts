import assert from 'node:assert/strict';
import {
  calculateCcToLiter,
  ccToLiters,
  litersToCc,
  shareResultText,
} from './calculation';
import { CC_PER_LITER } from './types';
import { parseOptionalNumber, validateCcToLiter } from './validation';

assert.equal(CC_PER_LITER, 1000);
assert.equal(ccToLiters(1), 0.001);
assert.equal(ccToLiters(10), 0.01);
assert.equal(ccToLiters(100), 0.1);
assert.equal(ccToLiters(250), 0.25);
assert.equal(ccToLiters(500), 0.5);
assert.equal(ccToLiters(750), 0.75);
assert.equal(ccToLiters(1000), 1);
assert.equal(ccToLiters(2500), 2.5);
assert.equal(ccToLiters(5000), 5);
assert.equal(litersToCc(1), 1000);
assert.equal(litersToCc(2.5), 2500);
assert.equal(ccToLiters(0), 0);
assert.equal(ccToLiters(0.5), 0.0005);

{
  const result = calculateCcToLiter({ source: 'cc', cc: 750, liters: null });
  assert.equal(result.liters, 0.75);
  assert.match(shareResultText(result), /cc to Liter/);
}

{
  const result = calculateCcToLiter({ source: 'liters', cc: null, liters: 2.5 });
  assert.equal(result.cc, 2500);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(!validateCcToLiter({ source: 'cc', cc: -1, liters: null }).isValid);
assert.ok(!validateCcToLiter({ source: 'cc', cc: null, liters: null }).isValid);

console.log('cc-to-liter calculation.test.ts: ok');
