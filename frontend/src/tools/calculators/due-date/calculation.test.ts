/**
 * Due Date Calculator — engine self-check.
 * Run: npx --yes tsx src/tools/calculators/due-date/calculation.test.ts
 */

import {
  dueDateFromConception,
  dueDateFromLmp,
  lmpGestationDays,
} from './calculation';
import { validateDueDateInput } from './validation';
import { createDefaultInput } from './types';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

assert(lmpGestationDays(28) === 280, '28-day cycle → 280');
assert(lmpGestationDays(30) === 282, '30-day cycle → 282');
assert(lmpGestationDays(26) === 278, '26-day cycle → 278');
assert(lmpGestationDays(20) == null, 'cycle too short');
assert(lmpGestationDays(46) == null, 'cycle too long');

// LMP 2024-01-01 + 280 = 2024-10-07
assert(dueDateFromLmp('2024-01-01', 28) === '2024-10-07', 'LMP Jan 1 → Oct 7');

// Month/year rollover: 2023-11-15 + 280 = 2024-08-21
assert(
  dueDateFromLmp('2023-11-15', 28) === '2024-08-21',
  'LMP Nov rollover',
);

// Cycle adjustment: 2024-01-01 + 282 = 2024-10-09
assert(dueDateFromLmp('2024-01-01', 30) === '2024-10-09', 'LMP +2 cycle');

// Conception 2024-01-15 + 266 = 2024-10-07
assert(
  dueDateFromConception('2024-01-15') === '2024-10-07',
  'conception +266',
);

{
  const input = createDefaultInput();
  input.lmpDate = '2024-01-01';
  input.cycleDays = '28';
  const v = validateDueDateInput(input);
  assert(v.isValid && v.result?.dueDateIso === '2024-10-07', 'validate LMP');
}

{
  const input = createDefaultInput();
  input.method = 'conception';
  input.conceptionDate = '2024-01-15';
  const v = validateDueDateInput(input);
  assert(
    v.isValid && v.result?.dueDateIso === '2024-10-07',
    'validate conception',
  );
}

{
  const input = createDefaultInput();
  input.lmpDate = '2024-13-40';
  const v = validateDueDateInput(input);
  assert(!v.isValid, 'invalid date rejected');
}

console.log('due-date calculation.test.ts: ok');
