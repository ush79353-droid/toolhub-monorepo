import assert from 'node:assert/strict';
import { calculateIrr, countSignChanges, npvAtRate } from './calculation';

{
  const r = calculateIrr(1000, [600, 600]);
  assert.ok(r);
  assert.ok(Math.abs(r!.irrPercent - 13.06623697) < 0.01);
  assert.ok(Math.abs(npvAtRate(1000, [600, 600], r!.irrPercent / 100)) < 0.01);
}

{
  assert.equal(countSignChanges([-1000, 600, 600]), 1);
  assert.equal(countSignChanges([-1000, 500, -200, 800]), 3);
}

{
  assert.equal(calculateIrr(1000, [500, -200, 800]), null);
  assert.equal(calculateIrr(0, [100]), null);
}

console.log('irr calculation.test.ts: ok');
