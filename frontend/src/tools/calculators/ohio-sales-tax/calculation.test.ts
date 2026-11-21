import assert from 'node:assert/strict';
import {
  isValidOhioZip,
  lookupOhioSalesTax,
  OH_ZIP_MAX,
  OH_ZIP_MIN,
} from './calculation';

assert.equal(isValidOhioZip('43215'), true);
assert.equal(isValidOhioZip('43001'), true);
assert.equal(isValidOhioZip(String(OH_ZIP_MAX)), true);
assert.equal(isValidOhioZip('07001'), false);
assert.equal(isValidOhioZip('46000'), false);
assert.equal(isValidOhioZip('4321'), false);
assert.equal(isValidOhioZip('432150'), false);

{
  const r = lookupOhioSalesTax(100, '43215');
  assert.ok(r);
  assert.equal(r.rateUnavailable, true);
  assert.equal(r.zipCode, '43215');
  assert.equal(r.formattedPurchaseAmount, '100.00');
  assert.match(r.unavailableMessage, /not available/i);
}

assert.equal(lookupOhioSalesTax(-1, '43215'), null);
assert.equal(lookupOhioSalesTax(100, '90210'), null);
assert.equal(OH_ZIP_MIN, 43001);

console.log('ohio-sales-tax calculation.test.ts: all assertions passed');
