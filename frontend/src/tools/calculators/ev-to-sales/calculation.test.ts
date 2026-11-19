import assert from 'node:assert/strict';
import { calculateEvToSales } from './calculation';

{
  const r = calculateEvToSales({
    marketCap: 1_000_000,
    totalDebt: 200_000,
    minorityInterest: 0,
    preferredShares: 0,
    cash: 50_000,
    sales: 500_000,
  });
  assert.ok(r);
  assert.equal(r.enterpriseValue, 1_150_000);
  assert.equal(r.evToSales, 2.3);
  assert.equal(r.ratioUndefined, false);
}

{
  const r = calculateEvToSales({
    marketCap: 100,
    totalDebt: 0,
    minorityInterest: 0,
    preferredShares: 0,
    cash: 200,
    sales: 50,
  });
  assert.ok(r);
  assert.equal(r.enterpriseValue, -100);
  assert.equal(r.evToSales, -2);
}

{
  const r = calculateEvToSales({
    marketCap: 100,
    totalDebt: 0,
    minorityInterest: 0,
    preferredShares: 0,
    cash: 0,
    sales: 0,
  });
  assert.ok(r);
  assert.equal(r.enterpriseValue, 100);
  assert.equal(r.evToSales, null);
  assert.equal(r.ratioUndefined, true);
}

{
  assert.equal(
    calculateEvToSales({
      marketCap: 100,
      totalDebt: 0,
      minorityInterest: 0,
      preferredShares: 0,
      cash: 0,
      sales: -1,
    }),
    null
  );
}

console.log('ev-to-sales calculation.test.ts: all assertions passed');
