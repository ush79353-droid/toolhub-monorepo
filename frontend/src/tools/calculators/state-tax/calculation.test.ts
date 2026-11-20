import assert from 'node:assert/strict';
import { resolveStateTaxDestination } from './calculation';

{
  const r = resolveStateTaxDestination('AL');
  assert.ok(r.state);
  assert.equal(r.available, true);
  assert.equal(r.href, '/tools/alabama-tax-calculator');
}

{
  const r = resolveStateTaxDestination('CA');
  assert.equal(r.href, '/tools/california-tax-calculator');
}

{
  const r = resolveStateTaxDestination('IL');
  assert.equal(r.href, '/tools/illinois-tax-calculator');
}

{
  const r = resolveStateTaxDestination('NY');
  assert.equal(r.available, true);
  assert.equal(r.href, '/tools/new-york-tax-calculator');
}

{
  const r = resolveStateTaxDestination('TX');
  assert.equal(r.available, true);
  assert.equal(r.href, '/tools/texas-tax-calculator');
}

{
  const r = resolveStateTaxDestination('ZZ');
  assert.equal(r.state, null);
  assert.equal(r.available, false);
}

console.log('calculation.test.ts: ok');
