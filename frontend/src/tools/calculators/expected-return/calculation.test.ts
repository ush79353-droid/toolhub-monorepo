import assert from 'node:assert/strict';
import { calculateExpectedReturns, probabilitiesSumTo100 } from './calculation';

{
  const r = calculateExpectedReturns([
    { probability: 60, stockA: 10, stockB: 6 },
    { probability: 40, stockA: -5, stockB: 12 },
  ]);
  assert.ok(r);
  assert.ok(Math.abs(r!.expectedReturnA - 4) < 1e-9);
  assert.ok(Math.abs(r!.expectedReturnB - 8.4) < 1e-9);
}

{
  assert.equal(probabilitiesSumTo100(100), true);
  assert.equal(probabilitiesSumTo100(99.995), true);
  assert.equal(probabilitiesSumTo100(90), false);
}

{
  assert.equal(
    calculateExpectedReturns([{ probability: 50, stockA: 10, stockB: 10 }]),
    null
  );
}

console.log('expected-return calculation.test.ts: ok');
