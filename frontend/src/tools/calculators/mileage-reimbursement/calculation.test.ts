/**
 * Runnable self-check for Mileage Reimbursement Calculator.
 * Run: npx --yes tsx src/tools/calculators/mileage-reimbursement/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  calculateMileageReimbursement,
  convertDistanceAmount,
  distanceToMiles,
} from './calculation';
import { getMileageRates, OFFICIAL_MILEAGE_RATES } from './rates';
import { createDefaultInput, KM_PER_MILE } from './types';
import { validateMileageReimbursementInput } from './validation';

assert.equal(OFFICIAL_MILEAGE_RATES.length, 4);
assert.equal(getMileageRates('2026-h1')?.business, 0.725);
assert.equal(getMileageRates('2026-h1')?.medical, 0.205);
assert.equal(getMileageRates('2026-h2')?.business, 0.76);
assert.equal(getMileageRates('2026-h2')?.medical, 0.235);
assert.equal(getMileageRates('2025')?.business, 0.7);
assert.equal(getMileageRates('2024')?.charity, 0.14);

assert.equal(distanceToMiles(1, 'mi'), 1);
assert.ok(Math.abs(distanceToMiles(KM_PER_MILE, 'km') - 1) < 1e-12);
assert.ok(
  Math.abs(convertDistanceAmount(100, 'km', 'mi') - 100 / KM_PER_MILE) < 1e-12
);

{
  const r = calculateMileageReimbursement({
    periodId: '2026-h1',
    businessDistance: 100,
    businessUnit: 'mi',
    medicalDistance: 50,
    medicalUnit: 'mi',
    charityDistance: 25,
    charityUnit: 'mi',
  });
  assert.ok(r);
  assert.ok(Math.abs(r.businessAmount - 72.5) < 1e-12);
  assert.ok(Math.abs(r.medicalAmount - 10.25) < 1e-12);
  assert.ok(Math.abs(r.charityAmount - 3.5) < 1e-12);
  assert.ok(Math.abs(r.totalDeduction - 86.25) < 1e-12);
}

{
  // 160.9344 km = 100 mi
  const r = calculateMileageReimbursement({
    periodId: '2025',
    businessDistance: 160.9344,
    businessUnit: 'km',
    medicalDistance: 0,
    medicalUnit: 'mi',
    charityDistance: 0,
    charityUnit: 'mi',
  });
  assert.ok(r);
  assert.ok(Math.abs(r.businessMiles - 100) < 1e-9);
  assert.ok(Math.abs(r.businessAmount - 70) < 1e-9);
}

{
  const zero = calculateMileageReimbursement({
    periodId: '2024',
    businessDistance: 0,
    businessUnit: 'mi',
    medicalDistance: 0,
    medicalUnit: 'mi',
    charityDistance: 0,
    charityUnit: 'mi',
  });
  assert.ok(zero);
  assert.equal(zero.totalDeduction, 0);
}

{
  const v = validateMileageReimbursementInput(createDefaultInput());
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  assert.equal(v.result.totalDeduction, 0);
  assert.equal(v.result.formattedBusinessRate, '0.725');
  assert.equal(v.result.formattedMedicalRate, '0.205');
}

{
  const bad = validateMileageReimbursementInput({
    ...createDefaultInput(),
    businessDistance: '-1',
  });
  assert.equal(bad.isValid, false);
  assert.ok(bad.errors.businessDistance);
}

console.log('mileage-reimbursement calculation.test.ts: all assertions passed');
