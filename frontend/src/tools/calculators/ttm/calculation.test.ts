import assert from 'node:assert/strict';
import { calculateTtm } from './calculation';

{
  const r = calculateTtm(120_000, 110_000, 100_000, 90_000, 'PKR');
  assert.ok(r);
  assert.equal(r!.trailingTwelveMonthValue, 420_000);
}

{
  const r = calculateTtm(100, -20, 0, 50, 'USD');
  assert.ok(r);
  assert.equal(r!.trailingTwelveMonthValue, 130);
}

{
  assert.equal(calculateTtm(Number.NaN, 1, 1, 1, 'USD'), null);
}

console.log('ttm calculation.test.ts: ok');
