import assert from 'node:assert/strict';
import {
  calculateRevenueGrowthRate,
  calculateTotalRevenueGrowth,
} from './calculation';
import { validateRevenueGrowthInput } from './validation';
import { createDefaultInput } from './types';

function approxEqual(actual: number, expected: number, eps = 1e-6): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

{
  const g = calculateTotalRevenueGrowth(100, 120);
  assert.ok(g !== null);
  approxEqual(g, 20);
}

{
  assert.equal(calculateTotalRevenueGrowth(0, 100), null);
}

{
  const r = calculateRevenueGrowthRate(100, 161.051, 5);
  assert.ok(r !== null);
  approxEqual(r, 10, 1e-3);
}

{
  assert.equal(calculateRevenueGrowthRate(100, 0, 5), null);
  assert.equal(calculateRevenueGrowthRate(-10, 100, 5), null);
}

{
  const v = validateRevenueGrowthInput(
    {
      ...createDefaultInput(),
      totalInitial: '100',
      totalFinal: '120',
    },
    null
  );
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  approxEqual(v.result.totalGrowthPercent!, 20);
}

{
  const v = validateRevenueGrowthInput(
    {
      ...createDefaultInput(),
      rateInitial: '100',
      rateFinal: '161.051',
      periods: '5',
    },
    null
  );
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  approxEqual(v.result.growthRatePercent!, 10, 1e-3);
}

console.log('revenue-growth calculation.test.ts: ok');
