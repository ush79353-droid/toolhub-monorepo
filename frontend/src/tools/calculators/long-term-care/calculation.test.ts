import assert from 'node:assert/strict';
import {
  calculateFutureCareCost,
  calculateTotalCareCost,
  generateAnnualCareProjection,
  normalizeAnnualCareCost,
} from './calculation';
import { validateLongTermCareInput } from './validation';

// Test 1 — Daily conversion
assert.equal(normalizeAnnualCareCost(250, 'daily'), 91_250);

// Test 2 — Monthly conversion
assert.equal(normalizeAnnualCareCost(7_500, 'monthly'), 90_000);

// Test 3 — Zero inflation
assert.equal(calculateTotalCareCost(90_000, 0, 5), 450_000);

// Test 4 — Inflation total
{
  const expected = 90_000 * ((Math.pow(1.04, 5) - 1) / 0.04);
  const actual = calculateTotalCareCost(90_000, 4, 5)!;
  assert.ok(Math.abs(actual - expected) < 0.01);
  assert.ok(Math.abs(actual - 487_469.03) < 0.01);
}

// Test 5 — Final-year cost (year 5 = 4 inflation steps)
{
  const final = calculateFutureCareCost(90_000, 4, 4);
  assert.ok(Math.abs(final - 105_287.27) < 0.01);
}

// Test 6 — Frequency switching
assert.notEqual(
  normalizeAnnualCareCost(250, 'daily'),
  normalizeAnnualCareCost(250, 'monthly'),
);

// Test 7 — Cumulative projection
{
  const rows = generateAnnualCareProjection({
    currentAnnualCost: 90_000,
    inflationRatePercent: 4,
    years: 5,
  });
  assert.equal(rows.length, 5);
  assert.ok(Math.abs(rows[0]!.annualCost - 90_000) < 1e-9);
  assert.ok(Math.abs(rows[1]!.annualCost - 93_600) < 1e-9);
  assert.ok(Math.abs(rows[2]!.annualCost - 97_344) < 1e-9);
  const sum = rows.reduce((a, r) => a + r.annualCost, 0);
  assert.ok(Math.abs(rows[4]!.cumulativeCost - sum) < 0.01);
  assert.ok(Math.abs(sum - 487_469.03) < 0.01);
}

// Test 8 — Invalid inputs
{
  const neg = validateLongTermCareInput({
    frequency: 'daily',
    careCost: '-10',
    presentYearCost: '1000',
    presentYearManuallySet: false,
    years: '5',
    inflationRate: '4',
    currency: 'USD',
  });
  assert.equal(neg.isValid, false);

  const zeroYears = validateLongTermCareInput({
    frequency: 'monthly',
    careCost: '7500',
    presentYearCost: '90000',
    presentYearManuallySet: false,
    years: '0',
    inflationRate: '4',
    currency: 'USD',
  });
  assert.equal(zeroYears.isValid, false);

  const negInflation = validateLongTermCareInput({
    frequency: 'monthly',
    careCost: '7500',
    presentYearCost: '90000',
    presentYearManuallySet: false,
    years: '5',
    inflationRate: '-1',
    currency: 'USD',
  });
  assert.equal(negInflation.isValid, false);
}

// Test 9 — Full monthly example via validation
{
  const v = validateLongTermCareInput({
    frequency: 'monthly',
    careCost: '7500',
    presentYearCost: '90000',
    presentYearManuallySet: false,
    years: '5',
    inflationRate: '4',
    currency: 'USD',
  });
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  assert.ok(Math.abs(v.result!.totalEstimatedCost - 487_469.03) < 0.01);
  assert.ok(Math.abs(v.result!.finalYearCost - 105_287.27) < 0.01);
}

console.log('long-term-care/calculation.test.ts: all assertions passed');
