import assert from 'node:assert/strict';
import { calculateEar } from './calculation';

// 12% monthly → periodic 1%, EAR ≈ 12.6825%
{
  const r = calculateEar(12, 'monthly');
  assert.ok(r);
  assert.equal(r!.periodicRatePercent, 1);
  assert.ok(Math.abs(r!.earPercent - 12.6825030132) < 1e-6);
}

// Annual compounding: EAR equals nominal
{
  const r = calculateEar(12, 'annually');
  assert.ok(r);
  assert.equal(r!.periodicRatePercent, 12);
  assert.ok(Math.abs(r!.earPercent - 12) < 1e-9);
}

// Zero rate
{
  const r = calculateEar(0, 'daily');
  assert.ok(r);
  assert.equal(r!.periodicRatePercent, 0);
  assert.equal(r!.earPercent, 0);
}

// Invalid: rate too negative for monthly (≤ -1200%)
{
  assert.equal(calculateEar(-1200, 'monthly'), null);
}

console.log('ear calculation.test.ts: ok');
