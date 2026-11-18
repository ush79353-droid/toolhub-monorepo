import assert from 'node:assert/strict';
import {
  calculateCarriedInterest,
  calculateFundReturnPercent,
  calculateHurdleProfit,
} from './calculation';

// Reference example: 100k → 150k, 10y, 0% hurdle, 20% carry, no catch-up
{
  const result = calculateCarriedInterest({
    initialFundValue: 100_000,
    finalFundValue: 150_000,
    holdPeriodYears: 10,
    hurdleRatePercent: 0,
    carriedInterestPercent: 20,
    gpCatchUp: 'no',
    currency: 'PKR',
  });
  assert.ok(result);
  assert.equal(result.fundReturnPercent, 50);
  assert.equal(result.totalProfit, 50_000);
  assert.equal(result.gpCarriedInterestAmount, 10_000);
}

// Fund return helper
assert.equal(calculateFundReturnPercent(100_000, 150_000), 50);
assert.equal(calculateFundReturnPercent(100_000, 50_000), -50);
assert.equal(calculateFundReturnPercent(0, 100), null);

// Omni-style hurdle example: 10M → 20M, 5y, 5%, 20%, no catch-up ≈ 1,447,436.87
{
  const hurdle = calculateHurdleProfit(10_000_000, 5, 5);
  assert.ok(hurdle !== null);
  assert.ok(Math.abs(hurdle - 2_762_815.6259) < 0.01);

  const result = calculateCarriedInterest({
    initialFundValue: 10_000_000,
    finalFundValue: 20_000_000,
    holdPeriodYears: 5,
    hurdleRatePercent: 5,
    carriedInterestPercent: 20,
    gpCatchUp: 'no',
    currency: 'USD',
  });
  assert.ok(result);
  assert.ok(Math.abs(result.gpCarriedInterestAmount - 1_447_436.87) < 0.02);
}

// Full catch-up on same Omni numbers → GP = 20% of total profit = 2,000,000
{
  const result = calculateCarriedInterest({
    initialFundValue: 10_000_000,
    finalFundValue: 20_000_000,
    holdPeriodYears: 5,
    hurdleRatePercent: 5,
    carriedInterestPercent: 20,
    gpCatchUp: 'yes',
    currency: 'USD',
  });
  assert.ok(result);
  assert.equal(result.gpCarriedInterestAmount, 2_000_000);
}

// Loss → zero carry
{
  const result = calculateCarriedInterest({
    initialFundValue: 100_000,
    finalFundValue: 80_000,
    holdPeriodYears: 10,
    hurdleRatePercent: 0,
    carriedInterestPercent: 20,
    gpCatchUp: 'no',
    currency: 'PKR',
  });
  assert.ok(result);
  assert.equal(result.fundReturnPercent, -20);
  assert.equal(result.gpCarriedInterestAmount, 0);
}

// Zero profit → zero carry
{
  const result = calculateCarriedInterest({
    initialFundValue: 100_000,
    finalFundValue: 100_000,
    holdPeriodYears: 10,
    hurdleRatePercent: 8,
    carriedInterestPercent: 20,
    gpCatchUp: 'yes',
    currency: 'PKR',
  });
  assert.ok(result);
  assert.equal(result.gpCarriedInterestAmount, 0);
}

console.log('carried-interest/calculation.test.ts: ok');
