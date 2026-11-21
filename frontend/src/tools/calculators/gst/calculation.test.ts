import assert from 'node:assert/strict';
import { calculateFromGross, calculateFromNet } from './calculation';

// From net · 10%
{
  const r = calculateFromNet(100, 10);
  assert.ok(r);
  assert.equal(r.taxAmount, 10);
  assert.equal(r.grossPrice, 110);
}

// From gross · 10%
{
  const r = calculateFromGross(110, 10);
  assert.ok(r);
  assert.ok(Math.abs(r.netPrice - 100) < 1e-12);
  assert.ok(Math.abs(r.taxAmount - 10) < 1e-12);
}

// Zero GST
{
  const r = calculateFromNet(100, 0);
  assert.ok(r);
  assert.equal(r.grossPrice, 100);
  assert.equal(r.taxAmount, 0);
}

// Rejects negative / over max / non-finite
assert.equal(calculateFromNet(-1, 10), null);
assert.equal(calculateFromGross(100, -1), null);
assert.equal(calculateFromNet(100, 1001), null);
assert.equal(calculateFromGross(Number.NaN, 10), null);

console.log('gst calculation.test.ts: all assertions passed');
