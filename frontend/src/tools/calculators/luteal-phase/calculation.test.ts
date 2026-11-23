/**
 * Luteal Phase Calculator — assert-based engine check.
 * Run: npx tsx src/tools/calculators/luteal-phase/calculation.test.ts
 */
import {
  calculateLutealPhase,
  MAX_LUTEAL_DAYS,
} from './calculation';
import { daysBetweenUtc } from '../edd/calculation';
import { createExampleInput } from './types';
import { validateLutealPhaseInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Fixture Nov 10 → Nov 24 = 14 (calendar convention)
{
  const r = calculateLutealPhase(createExampleInput());
  assert(r?.lutealPhaseDays === 14, 'Nov 10 → Nov 24 = 14 days');
}

assert(
  daysBetweenUtc('2026-11-10', '2026-11-24') === 14,
  'daysBetweenUtc fixture',
);

// Leap day span
assert(
  daysBetweenUtc('2024-02-28', '2024-03-01') === 2,
  'leap calendar span',
);

// Reversed dates
{
  const v = validateLutealPhaseInput({
    ovulationDate: '2026-11-24',
    periodStartDate: '2026-11-10',
  });
  assert(!v.isValid && v.errors.periodStartDate, 'reversed dates rejected');
}

// Same day → invalid (span 0)
{
  const v = validateLutealPhaseInput({
    ovulationDate: '2026-01-01',
    periodStartDate: '2026-01-01',
  });
  assert(!v.isValid, 'same-day rejected');
}

// Clear either field → no result
{
  const v1 = validateLutealPhaseInput({
    ovulationDate: '',
    periodStartDate: '2026-11-24',
  });
  assert(!v1.result, 'blank ovulation');
  const v2 = validateLutealPhaseInput({
    ovulationDate: '2026-11-10',
    periodStartDate: '',
  });
  assert(!v2.result, 'blank period');
}

// Invalid date string
{
  const v = validateLutealPhaseInput({
    ovulationDate: 'not-a-date',
    periodStartDate: '2026-11-24',
  });
  assert(v.errors.ovulationDate, 'invalid ovulation');
}

// Upper bound guard
{
  const ov = '2020-01-01';
  const period = '2020-03-02';
  assert(
    (daysBetweenUtc(ov, period) ?? 0) > MAX_LUTEAL_DAYS,
    'fixture spans > max',
  );
  const v = validateLutealPhaseInput({
    ovulationDate: ov,
    periodStartDate: period,
  });
  assert(!v.isValid && v.errors.form, 'excessive span');
}

// Valid mid-range
{
  const v = validateLutealPhaseInput({
    ovulationDate: '2026-06-01',
    periodStartDate: '2026-06-15',
  });
  assert(v.isValid && v.result?.lutealPhaseDays === 14, 'mid-range 14d');
}

console.log('luteal-phase calculation.test.ts: ok');