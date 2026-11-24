/**
 * Prescription Refill Calculator — assert-based engine check.
 * Run: npx tsx src/tools/calculators/prescription-refill/calculation.test.ts
 */
import {
  calculatePrescriptionRefill,
  MAX_DAYS_SUPPLIED,
  wholeDaysSupplied,
} from './calculation';
import { addDaysToIsoDate } from '../edd/calculation';
import { createExampleInput } from './types';
import { validatePrescriptionRefillInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Fixture: 15 Jan 2026 · 30 @ 1/day → 30 days · last 13 Feb · next 14 Feb (month end)
{
  const r = calculatePrescriptionRefill(createExampleInput());
  assert(r?.daysSupplied === 30, 'example days supplied');
  assert(r?.lastCoveredIso === '2026-02-13', 'example last covered');
  assert(r?.nextSupplyIso === '2026-02-14', 'example next supply');
}

assert(
  wholeDaysSupplied(30, 1) === 30,
  'wholeDaysSupplied 30/1',
);
assert(
  addDaysToIsoDate('2026-01-15', 29) === '2026-02-13',
  'addDays last covered',
);
assert(
  addDaysToIsoDate('2026-01-15', 30) === '2026-02-14',
  'addDays next supply',
);

// 30-day supply starting month-end (31 Jan)
{
  const r = calculatePrescriptionRefill({
    fillDate: '2026-01-31',
    quantityText: '30',
    unitsPerDayText: '1',
  });
  assert(r?.lastCoveredIso === '2026-03-01', 'Jan 31 +29 → Mar 1 last');
  assert(r?.nextSupplyIso === '2026-03-02', 'Jan 31 +30 → Mar 2 next');
}

// Leap-year February span
{
  const r = calculatePrescriptionRefill({
    fillDate: '2024-02-01',
    quantityText: '30',
    unitsPerDayText: '1',
  });
  assert(r?.lastCoveredIso === '2024-03-01', 'leap Feb last covered');
  assert(r?.nextSupplyIso === '2024-03-02', 'leap Feb next supply');
}

// Twice daily: 60 tabs / 2 per day = 30 days
{
  const r = calculatePrescriptionRefill({
    fillDate: '2026-01-15',
    quantityText: '60',
    unitsPerDayText: '2',
  });
  assert(r?.daysSupplied === 30, 'bid days');
  assert(r?.nextSupplyIso === '2026-02-14', 'bid next');
}

// Partial days rejected
{
  const v = validatePrescriptionRefillInput({
    fillDate: '2026-01-15',
    quantityText: '15',
    unitsPerDayText: '2',
  });
  assert(!v.isValid && v.errors.form, '7.5 days rejected');
  assert(wholeDaysSupplied(15, 2) == null, 'wholeDays null for 7.5');
}

// Blank fields → no result
{
  const v = validatePrescriptionRefillInput({
    fillDate: '',
    quantityText: '30',
    unitsPerDayText: '1',
  });
  assert(!v.result, 'blank fill');
}

// Invalid date
{
  const v = validatePrescriptionRefillInput({
    fillDate: 'not-a-date',
    quantityText: '30',
    unitsPerDayText: '1',
  });
  assert(v.errors.fillDate, 'invalid fill date');
}

// Non-positive quantity
{
  const v = validatePrescriptionRefillInput({
    fillDate: '2026-01-15',
    quantityText: '0',
    unitsPerDayText: '1',
  });
  assert(v.errors.quantityText, 'zero quantity');
}

// Upper bound
{
  const v = validatePrescriptionRefillInput({
    fillDate: '2026-01-01',
    quantityText: String(MAX_DAYS_SUPPLIED + 1),
    unitsPerDayText: '1',
  });
  assert(!v.isValid && v.errors.form, 'over max days');
}

// Valid mid-range via validate
{
  const v = validatePrescriptionRefillInput(createExampleInput());
  assert(v.isValid && v.result?.daysSupplied === 30, 'validate example');
}

console.log('prescription-refill calculation.test.ts: ok');
