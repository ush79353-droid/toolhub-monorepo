import assert from 'node:assert/strict';
import { calculateBeta, dailyReturns, formatBeta } from './calculation';

{
  const returns = dailyReturns([50, 55, 50, 60]);
  assert.deepEqual(returns, [0.1, 50 / 55 - 1, 0.2]);
}

{
  const beta = calculateBeta([
    { asset: 50, benchmark: 100 },
    { asset: 55, benchmark: 110 },
    { asset: 50, benchmark: 100 },
    { asset: 60, benchmark: 120 },
  ]);
  assert.ok(beta !== null);
  assert.ok(Math.abs(beta! - 1) < 1e-10);
  assert.equal(formatBeta(beta!), '1');
}

{
  assert.equal(calculateBeta([{ asset: 50, benchmark: 100 }]), null);
  assert.equal(
    calculateBeta([
      { asset: 50, benchmark: 100 },
      { asset: 55, benchmark: 100 },
      { asset: 50, benchmark: 100 },
      { asset: 60, benchmark: 100 },
    ]),
    null
  );
}

{
  const beta = calculateBeta([
    { asset: 100, benchmark: 100 },
    { asset: 90, benchmark: 110 },
    { asset: 95, benchmark: 105 },
    { asset: 80, benchmark: 120 },
  ]);
  assert.ok(beta !== null);
  assert.ok(beta! < 0);
}

console.log('beta-stock calculation.test.ts: ok');
