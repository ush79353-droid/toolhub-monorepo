import assert from 'node:assert/strict';
import { solveCpcCpm } from './calculation';

{
  const res = solveCpcCpm({ impressions: 10_000, cpc: 20, ctr: 5 });
  assert.equal(res.inconsistent, false);
  assert.equal(res.values.clicks, 500);
  assert.equal(res.values.totalCost, 10_000);
  assert.equal(res.values.cpm, 1_000);
}

{
  const res = solveCpcCpm({ impressions: 10_000, clicks: 500, totalCost: 10_000 });
  assert.equal(res.values.ctr, 5);
  assert.equal(res.values.cpc, 20);
  assert.equal(res.values.cpm, 1_000);
}

{
  const res = solveCpcCpm({ impressions: 10_000, cpc: 20, ctr: 5, clicks: 999 });
  assert.equal(res.inconsistent, true);
  assert.ok(res.errors.form);
}

{
  const res = solveCpcCpm({ impressions: 0, totalCost: 100 });
  assert.equal(res.values.cpm, undefined);
}

{
  const res = solveCpcCpm({ cpc: -1 });
  assert.ok(res.errors.cpc);
}

console.log('cpc-and-cpm calculation.test ok');
