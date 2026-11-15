import assert from 'node:assert/strict';
import { calculateSortinoRatio } from './calculation';

{
  const r = calculateSortinoRatio(12, 4, 10);
  assert.ok(r);
  assert.ok(Math.abs(r!.sortinoRatio - 0.8) < 1e-9);
}

{
  const r = calculateSortinoRatio(2, 4, 5);
  assert.ok(r);
  assert.ok(Math.abs(r!.sortinoRatio - -0.4) < 1e-9);
}

{
  assert.equal(calculateSortinoRatio(12, 4, 0), null);
  assert.equal(calculateSortinoRatio(12, 4, -1), null);
}

console.log('sortino-ratio calculation.test.ts: ok');
