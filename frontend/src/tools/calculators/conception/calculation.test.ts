/**
 * Conception Calculator — assert-based engine check.
 * Run: npx tsx src/tools/calculators/conception/calculation.test.ts
 */
import {
  calculateConception,
  conceptionFromDueDate,
  daysBetweenUtc,
  gestationalAgeDaysFromEdd,
  splitGestationalAge,
} from './calculation';
import { createExampleInput } from './types';
import { validateConceptionInput } from './validation';
import { dueDateFromLmp } from '../due-date/calculation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// 28-day LMP equivalence
{
  const edd = dueDateFromLmp('2026-01-01', 28);
  assert(edd === '2026-10-08', `EDD got ${edd}`);
  assert(conceptionFromDueDate(edd!) === '2026-01-15', 'conception');
}

// Due-date mode
{
  const r = calculateConception(
    {
      dueDate: '2026-10-08',
      lmpDate: '',
      cycleDays: '28',
      lastEdited: 'dueDate',
    },
    '2026-01-15'
  );
  assert(r?.conceptionIso === '2026-01-15', 'due→conception');
  assert(r?.gestationalAgeDays === 14, `GA days ${r?.gestationalAgeDays}`);
  const split = splitGestationalAge(14);
  assert(split.weeks === 2 && split.days === 0, '2w0d');
}

// Example LMP path
{
  const v = validateConceptionInput(createExampleInput(), '2026-01-15');
  assert(v.isValid && v.result, 'example');
  assert(v.result!.conceptionIso === '2026-01-15', 'ex conception');
  assert(v.result!.dueDateIso === '2026-10-08', 'ex due');
}

// Blank inactive
{
  const v = validateConceptionInput({
    dueDate: '',
    lmpDate: '',
    cycleDays: '28',
    lastEdited: null,
  });
  assert(!v.isValid && !v.result, 'blank');
}

// Leap day arithmetic
assert(daysBetweenUtc('2024-02-28', '2024-03-01') === 2, 'leap span');
assert(
  gestationalAgeDaysFromEdd('2024-11-07', '2024-02-29') != null,
  'leap asOf'
);

// Year rollover conception
assert(conceptionFromDueDate('2027-01-01') === '2026-04-10', 'roll conception');

console.log('conception calculation.test.ts: ok');
