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

{
  // Label percentages are display-only; engine uses exact month fractions.
  const monthly = 10_000;
  const annual = 120_000;
  const r = calculateRentalCommission({
    annualRent: annual,
    monthlyRent: monthly,
    customPercent: 12.5,
  });
  assert.ok(r);
  assert.equal(r.halfMonth, monthly * 0.5);
  assert.notEqual(r.halfMonth, annual * 0.0417);
  assert.equal(r.oneMonth, monthly);
  assert.notEqual(r.oneMonth, annual * 0.0833);
  assert.equal(r.oneHalfMonth, monthly * 1.5);
  assert.equal(r.oneHalfMonth, annual * 0.125);
  assert.equal(r.customAmount, annual * 0.125);
}

console.log('rental-commission/calculation.test.ts: ok');
