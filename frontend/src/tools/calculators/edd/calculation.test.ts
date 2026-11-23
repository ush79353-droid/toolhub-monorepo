/**
 * EDD Calculator — assert-based engine check.
 * Run: npx tsx --from backend: D:\Project\ToolHub\backend\node_modules\.bin\tsx ...
 */
import {
  dueDateFromUltrasound,
  dueDateFromLmp,
  calculateEdd,
  remainingDaysToEdd,
} from './calculation';
import { validateEddInput } from './validation';
import { createExampleInput } from './types';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// LMP EDD with cycle adjustment
assert(dueDateFromLmp('2026-01-01', 28) === '2026-10-08', 'LMP 28 → +280');
assert(dueDateFromLmp('2026-01-01', 30) === '2026-10-10', 'LMP 30 → +282');

// US EDD: scan 2026-03-01 at 8w0d → GA 56 → EDD = scan + 280 - 56 = scan + 224
assert(
  dueDateFromUltrasound('2026-03-01', 8, 0) === '2026-10-11',
  `US EDD got ${dueDateFromUltrasound('2026-03-01', 8, 0)}`
);

// Days 0–6 boundary
assert(dueDateFromUltrasound('2026-01-01', 10, 6) != null, '10w6d ok');
assert(dueDateFromUltrasound('2026-01-01', 10, 7) == null, 'days 7 invalid');

// GA as of current from EDD
{
  const edd = dueDateFromLmp('2026-01-01', 28)!; // 2026-10-08
  const rem = remainingDaysToEdd(edd, '2026-01-01');
  assert(rem === 280, `remaining from LMP day0 got ${rem}`);
}

// Example both methods
{
  const v = validateEddInput(createExampleInput('2026-04-01'));
  assert(v.isValid && v.result, 'example valid');
  assert(v.result!.lmpEddIso === '2026-10-08', 'example LMP EDD');
  assert(v.result!.ultrasoundEddIso === '2026-10-11', 'example US EDD');
  assert(v.result!.lmpAge != null && v.result!.ultrasoundAge != null, 'ages');
  assert(v.result!.differenceDays != null, 'diff');
  // US EDD later → smaller GA → negative (LMP older)
  assert(
    v.result!.differenceDays! < 0,
    `diff sign ${v.result!.differenceDays}`
  );
}

// Same EDD → 0 difference
{
  const r = calculateEdd({
    currentDate: '2026-04-01',
    lmpDate: '2026-01-01',
    cycleDays: 28,
    ultrasoundDate: '2026-01-01',
    ultrasoundWeeks: 0,
    ultrasoundDays: 0,
  });
  assert(r.lmpEddIso === r.ultrasoundEddIso, 'same edd');
  assert(r.differenceDays === 0, 'zero diff');
}

// One method only
{
  const v = validateEddInput({
    currentDate: '2026-04-01',
    lmpDate: '2026-01-01',
    cycleDays: '28',
    ultrasoundDate: '',
    ultrasoundWeeks: '',
    ultrasoundDays: '',
  });
  assert(v.isValid && v.result?.lmpEddIso && !v.result.ultrasoundEddIso, 'LMP only');
  assert(v.result!.differenceDays == null, 'no diff');
}

// Blank inactive
{
  const v = validateEddInput({
    currentDate: '2026-04-01',
    lmpDate: '',
    cycleDays: '28',
    ultrasoundDate: '',
    ultrasoundWeeks: '',
    ultrasoundDays: '',
  });
  assert(!v.isValid && v.result == null, 'blank inactive');
}

// Leap day path: LMP 2024-02-29 + 280
assert(dueDateFromLmp('2024-02-29', 28) === '2024-12-05', 'leap LMP');

console.log('edd calculation.test.ts: ok');
