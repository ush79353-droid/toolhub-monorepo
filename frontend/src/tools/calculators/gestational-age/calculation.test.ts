/**
 * Gestational Age Calculator — assert-based engine check.
 * Run: npx tsx src/tools/calculators/gestational-age/calculation.test.ts
 */
import {
  calculateGestationalAge,
  formatGestationalAge,
  localTodayIso,
} from './calculation';
import {
  addDaysToIsoDate,
  daysBetweenUtc,
  gestationalAgeDaysFromEdd,
} from '../edd/calculation';
import { createExampleInput } from './types';
import { validateGestationalAgeInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

const today = localTodayIso();

// Fixtures from spec
{
  const r = calculateGestationalAge({
    dueDate: today,
    currentDate: today,
    gaDisplayUnit: 'weeksDays',
  });
  assert(r?.weeks === 40 && r?.daysRemainder === 0, 'EDD today → 40w0d');
}

{
  const edd = '2026-07-01';
  const current = addDaysToIsoDate(edd, -7);
  const r = calculateGestationalAge({
    dueDate: edd,
    currentDate: current,
    gaDisplayUnit: 'weeksDays',
  });
  assert(r?.weeks === 39 && r?.daysRemainder === 0, '7 days before EDD → 39w0d');
}

// Formula: 280 + (current − EDD)
assert(
  gestationalAgeDaysFromEdd('2026-12-01', '2026-11-23') === 280 - 8,
  'day diff',
);
assert(daysBetweenUtc('2024-02-28', '2024-03-01') === 2, 'leap span');

// Negative age → clamped display, flagged
{
  const r = calculateGestationalAge({
    dueDate: '2026-10-01',
    currentDate: '2025-01-01',
    gaDisplayUnit: 'weeksDays',
  });
  assert(r?.beforeConception && r.weeks === 0, 'negative clamp');
}

// Year rollover
assert(
  gestationalAgeDaysFromEdd('2027-01-01', '2026-06-01') != null,
  'year rollover',
);

// Clear either date → no result
{
  const v1 = validateGestationalAgeInput({
    dueDate: '',
    currentDate: today,
    gaDisplayUnit: 'weeksDays',
  });
  assert(!v1.result, 'blank EDD');
  const v2 = validateGestationalAgeInput({
    dueDate: today,
    currentDate: '',
    gaDisplayUnit: 'weeksDays',
  });
  assert(!v2.result, 'blank current');
}

// Example input
{
  const v = validateGestationalAgeInput(createExampleInput(today));
  assert(v.isValid && v.result?.weeks === 40, 'example');
}

assert(formatGestationalAge(273, 'days') === '273 days', 'days unit');

console.log('gestational-age calculation.test.ts: ok');