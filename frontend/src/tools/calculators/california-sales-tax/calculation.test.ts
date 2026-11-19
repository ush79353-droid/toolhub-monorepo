import assert from 'node:assert/strict';
import {
  applyCaliforniaSalesTaxRate,
  buildCaliforniaUnavailableResult,
  formatCaRatePercent,
  isValidCaliforniaZip,
  roundMoney,
} from './calculation';

assert.equal(isValidCaliforniaZip('95814'), true);
assert.equal(isValidCaliforniaZip('90001'), true);
assert.equal(isValidCaliforniaZip('96162'), true);
assert.equal(isValidCaliforniaZip('89999'), false);
assert.equal(isValidCaliforniaZip('96163'), false);
assert.equal(isValidCaliforniaZip('9581'), false);

assert.equal(roundMoney(8.875), 8.88);
assert.equal(formatCaRatePercent(8.75), '8.75');

{
  // CDTFA sample: Sacramento 450 N St → 0.0875
  const r = applyCaliforniaSalesTaxRate(100, 0.0875, {
    streetAddress: '450 N St',
    city: 'Sacramento',
    zipCode: '95814',
    jurisdiction: 'SACRAMENTO',
    county: 'SACRAMENTO',
    tac: '340607050000',
    formattedAddress: '450 N St, Sacramento, CA 95814',
    lookedUpAt: '2026-11-20T00:00:00.000Z',
  });
  assert.ok(r);
  assert.equal(r.kind, 'success');
  assert.equal(r.salesTax, 8.75);
  assert.equal(r.totalAmount, 108.75);
  assert.equal(r.formattedTaxRatePercent, '8.75');
}

assert.equal(
  applyCaliforniaSalesTaxRate(-1, 0.0875, {
    streetAddress: '450 N St',
    city: 'Sacramento',
    zipCode: '95814',
    jurisdiction: 'SACRAMENTO',
    county: 'SACRAMENTO',
    tac: 'x',
    formattedAddress: null,
    lookedUpAt: '2026-11-20T00:00:00.000Z',
  }),
  null
);

{
  const u = buildCaliforniaUnavailableResult(
    50,
    '2444 S Alameda St',
    'Los Angeles',
    '90058',
    'ambiguous',
    [
      {
        rate: 0.1025,
        jurisdiction: 'LOS ANGELES',
        city: 'LOS ANGELES',
        county: 'LOS ANGELES',
        tac: 'a',
      },
      {
        rate: 0.11,
        jurisdiction: 'VERNON',
        city: 'VERNON',
        county: 'LOS ANGELES',
        tac: 'b',
      },
    ]
  );
  assert.ok(u);
  assert.equal(u.kind, 'unavailable');
  assert.equal(u.candidates.length, 2);
  assert.equal(u.formattedPurchaseAmount, '50.00');
}

console.log('california-sales-tax calculation.test.ts: all assertions passed');
