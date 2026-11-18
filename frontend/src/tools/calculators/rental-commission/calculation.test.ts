import assert from 'node:assert/strict';
import {
  annualFromMonthly,
  calculateRentalCommission,
  monthlyFromAnnual,
} from './calculation';

{
  assert.equal(annualFromMonthly(10_000), 120_000);
  assert.equal(monthlyFromAnnual(120_000), 10_000);
}

{
  const r = calculateRentalCommission({
    annualRent: 120_000,
    monthlyRent: 10_000,
    customPercent: 15,
  });
  assert.ok(r);
  assert.equal(r.halfMonth, 5_000);
  assert.equal(r.oneMonth, 10_000);
  assert.equal(r.oneHalfMonth, 15_000);
  assert.equal(r.customAmount, 18_000);
}

{
  const r = calculateRentalCommission({
    annualRent: 0,
    monthlyRent: 0,
    customPercent: 0,
  });
  assert.ok(r);
  assert.equal(r.halfMonth, 0);
  assert.equal(r.oneMonth, 0);
  assert.equal(r.oneHalfMonth, 0);
  assert.equal(r.customAmount, 0);
}

{
  const r = calculateRentalCommission({
    annualRent: 120_000,
    monthlyRent: 10_000,
    customPercent: -1,
  });
  assert.equal(r, null);
}

console.log('rental-commission/calculation.test.ts: ok');
