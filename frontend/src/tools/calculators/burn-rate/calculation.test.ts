import assert from 'node:assert/strict';
import { calculateBurnRate } from './calculation';
import { createDefaultInput } from './types';

{
  const input = createDefaultInput();
  input.initialBalance = 100_000;
  input.finalBalance = 60_000;
  input.duration = 4;
  input.durationUnit = 'months';
  const result = calculateBurnRate(input);
  assert.ok(result);
  assert.equal(result.burnRateMonthly, 10_000);
  assert.equal(result.cashRunwayMonths, 6);
  assert.equal(result.cashRunwayDisplay, '6');
}

{
  const input = createDefaultInput();
  input.initialBalance = 50_000;
  input.finalBalance = 50_000;
  input.duration = 3;
  const result = calculateBurnRate(input);
  assert.ok(result);
  assert.equal(result.burnRateMonthly, 0);
  assert.equal(result.cashRunwayDisplay, 'N/A');
}

console.log('burn-rate calculation.test.ts: ok');
