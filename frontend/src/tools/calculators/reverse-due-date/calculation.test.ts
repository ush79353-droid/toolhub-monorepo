/**
 * Run: npx tsx src/tools/calculators/reverse-due-date/calculation.test.ts
 */
import {
  calculateReverseDueDateFromInput,
  conceptionFromDue,
  conceptionOffsetDays,
  dueFromConception,
  intercourseStartFromConception,
  pregnancyLengthToDays,
} from './calculation';
import { createExampleInput } from './types';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  assert(pregnancyLengthToDays(40, 'weeks') === 280, '40w=280d');
  assert(conceptionOffsetDays(280) === 266, 'offset 266');
}

{
  // Prompt/ACOG: EDD 2023-08-01 · 280d → conception 2022-11-08
  const c = conceptionFromDue('2023-08-01', 280);
  assert(c === '2022-11-08', `conception got ${c}`);
  const d = dueFromConception('2022-11-08', 280);
  assert(d === '2023-08-01', `due got ${d}`);
  const i = intercourseStartFromConception('2022-11-08');
  assert(i === '2022-11-01', `intercourse got ${i}`);
}

{
  const r = calculateReverseDueDateFromInput(createExampleInput());
  assert(r != null, 'example');
  assert(r!.conceptionDateIso === '2022-11-08', r!.conceptionDateIso);
  assert(r!.intercourseStartIso === '2022-11-01', r!.intercourseStartIso);
  assert(r!.dueDateIso === '2023-08-01', r!.dueDateIso);
}

{
  // Round-trip from conception
  const r = calculateReverseDueDateFromInput({
    dueDate: '',
    conceptionDate: '2022-11-08',
    intercourseDate: '',
    pregnancyLength: '40',
    lengthUnit: 'weeks',
    lastEdited: 'conceptionDate',
  });
  assert(r != null && r.dueDateIso === '2023-08-01', 'from conception');
}

{
  // Intercourse as earliest window → +7 conception
  const r = calculateReverseDueDateFromInput({
    dueDate: '',
    conceptionDate: '',
    intercourseDate: '2022-11-01',
    pregnancyLength: '40',
    lengthUnit: 'weeks',
    lastEdited: 'intercourseDate',
  });
  assert(r != null && r.conceptionDateIso === '2022-11-08', 'from intercourse');
  assert(r!.dueDateIso === '2023-08-01', 'due from intercourse');
}

console.log('reverse-due-date calculation.test.ts: ok');
