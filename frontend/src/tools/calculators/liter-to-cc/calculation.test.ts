import assert from 'node:assert/strict';
import {
  calculateLiterToCc,
  ccToLiters,
  litersToCc,
  shareResultText,
} from './calculation';
import { CC_PER_LITER } from './types';
import { parseOptionalNumber, validateLiterToCc } from './validation';

assert.equal(CC_PER_LITER, 1000);
assert.equal(litersToCc(1), 1000);
assert.equal(litersToCc(2.5), 2500);
assert.equal(litersToCc(0.75), 750);
assert.equal(ccToLiters(500), 0.5);
assert.equal(ccToLiters(1000), 1);
assert.equal(litersToCc(0), 0);
assert.equal(litersToCc(0.001), 1);
assert.equal(ccToLiters(250), 0.25);

{
  const result = calculateLiterToCc({
    source: 'liters',
    liters: 1,
    cc: null,
  });
  assert.equal(result.cc, 1000);
  assert.match(shareResultText(result), /1000/);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(!validateLiterToCc({ source: 'liters', liters: -1, cc: null }).isValid);

console.log('liter-to-cc calculation.test.ts: ok');
