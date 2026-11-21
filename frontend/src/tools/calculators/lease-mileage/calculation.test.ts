import assert from 'node:assert/strict';
import {
  calculateLeaseMileage,
  distanceToKm,
  feeToPerKm,
  formatDistanceAmount,
  kmToDistance,
  toMonths,
} from './calculation';
import { validateLeaseMileageInput } from './validation';
import { createDefaultInput, KM_PER_MILE } from './types';

function approxEqual(actual: number, expected: number, eps = 1e-9) {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

{
  assert.equal(toMonths(3, 0), 36);
  assert.equal(toMonths(2, 6), 30);
  assert.equal(distanceToKm(1, 'mi'), KM_PER_MILE);
  assert.equal(distanceToKm(10, 'km'), 10);
  approxEqual(kmToDistance(KM_PER_MILE, 'mi'), 1);
  approxEqual(feeToPerKm(1.609344, 'mi'), 1);
  assert.equal(feeToPerKm(2, 'km'), 2);
}

// Worked example: 36 mo total, 24 remaining (12 elapsed), 12k km driven, 15k km/yr, 10/km
{
  const out = calculateLeaseMileage({
    totalMonths: 36,
    remainingMonths: 24,
    currentDistanceKm: 12_000,
    annualAllowanceKm: 15_000,
    feePerKm: 10,
  });
  assert.ok(out);
  assert.equal(out.availability, 'ok');
  if (out.availability === 'ok') {
    // predicted total = 12000 * 36 / 12 = 36000
    // allowed = 15000 * 36 / 12 = 45000
    // excess = 0
    assert.equal(out.predictedExcessKm, 0);
    assert.equal(out.predictedCharge, 0);
    assert.equal(out.monthlySavings, 0);
  }
}

// Excess case: 20k km in 12 of 36 months, 10k km/yr allowance, 5/km
{
  const out = calculateLeaseMileage({
    totalMonths: 36,
    remainingMonths: 24,
    currentDistanceKm: 20_000,
    annualAllowanceKm: 10_000,
    feePerKm: 5,
  });
  assert.ok(out);
  assert.equal(out.availability, 'ok');
  if (out.availability === 'ok') {
    // predicted = 20000 * 36 / 12 = 60000
    // allowed = 10000 * 36 / 12 = 30000
    // excess = 30000; charge = 150000; savings = 150000/24 = 6250
    assert.equal(out.predictedExcessKm, 30_000);
    assert.equal(out.predictedCharge, 150_000);
    assert.equal(out.monthlySavings, 6_250);
  }
}

// No elapsed
{
  const out = calculateLeaseMileage({
    totalMonths: 36,
    remainingMonths: 36,
    currentDistanceKm: 0,
    annualAllowanceKm: 15_000,
    feePerKm: 10,
  });
  assert.ok(out);
  assert.equal(out.availability, 'no_elapsed');
}

// Rejects
{
  assert.equal(
    calculateLeaseMileage({
      totalMonths: 0,
      remainingMonths: 0,
      currentDistanceKm: 0,
      annualAllowanceKm: 0,
      feePerKm: 0,
    }),
    null
  );
  assert.equal(
    calculateLeaseMileage({
      totalMonths: 12,
      remainingMonths: 13,
      currentDistanceKm: 0,
      annualAllowanceKm: 0,
      feePerKm: 0,
    }),
    null
  );
}

{
  assert.equal(formatDistanceAmount(30000), '30,000.00');
}

// Validation blank default
{
  const blank = validateLeaseMileageInput(createDefaultInput(), null);
  assert.equal(blank.isValid, false);
}

// Validation excess case (same currency)
{
  const input = createDefaultInput();
  input.totalYears = '3';
  input.totalMonths = '0';
  input.remainingYears = '2';
  input.remainingMonths = '0';
  input.currentDistance = '20000';
  input.annualAllowance = '10000';
  input.excessFee = '5';
  const ok = validateLeaseMileageInput(input, null);
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.availability, 'ok');
  assert.equal(ok.result.formattedCharge, '150,000.00');
  assert.equal(ok.result.formattedSavings, '6,250.00');
}

console.log('lease-mileage calculation.test.ts: all assertions passed');
