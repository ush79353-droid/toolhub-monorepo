import assert from 'node:assert/strict';
import { buildPvgoResult, calculateEps, calculatePvgo } from './calculation';
import { createDefaultInput } from './types';
import { validatePvgo } from './validation';

{
  assert.equal(calculateEps(1_000_000, 100_000), 10);
  assert.equal(calculatePvgo(150, 10, 10), 50);
}

{
  const res = buildPvgoResult(1_000_000, 100_000, 150, 10, 'PKR');
  assert.equal(res.eps, 10);
  assert.equal(res.pvgo, 50);
  assert.equal(res.epsDisplay, '10.00');
  assert.equal(res.pvgoDisplay, '50.00');
}

{
  const partial = buildPvgoResult(1_000_000, 100_000, Number.NaN, Number.NaN, 'PKR');
  assert.equal(partial.eps, 10);
  assert.equal(partial.pvgo, null);
  assert.equal(partial.pvgoDisplay, '');
}

{
  assert.equal(calculateEps(100, 0), null);
  assert.equal(calculatePvgo(150, 10, 0), null);
  const neg = calculatePvgo(50, 10, 10);
  assert.equal(neg, -50);
}

{
  const v = validatePvgo({
    ...createDefaultInput(),
    earnings: 1_000_000,
    sharesOutstanding: 100_000,
    sharePrice: 150,
    costOfEquityPercent: 10,
  });
  assert.equal(v.isValid, true);
  assert.equal(v.result?.pvgo, 50);
}

console.log('pvgo calculation.test ok');
