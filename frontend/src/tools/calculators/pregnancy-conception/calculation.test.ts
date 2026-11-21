import { CONCEPTION_TO_DUE_DAYS } from '../due-date/types';
import {
  calculatePregnancyConception,
  conceptionFromDueDate,
  dueDateFromUltrasound,
  intercourseWindow,
} from './calculation';
import { createDefaultInput } from './types';
import { validatePregnancyConceptionInput } from './validation';

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(msg);
}

// Sample screenshot: EDD 2027-03-21 → conception = EDD − 266
{
  const c = conceptionFromDueDate('2027-03-21');
  assert(c === '2026-06-28', `conception got ${c}`);
  const w = intercourseWindow(c!)!;
  assert(w.toIso === '2026-06-28', 'window end');
  assert(w.fromIso === '2026-06-23', `window start ${w.fromIso}`);
}

{
  const r = calculatePregnancyConception(createDefaultInput())!;
  assert(r.dueDateIso === '2027-03-21', 'edd');
  assert(r.conceptionIso === '2026-06-28', 'conc');
  assert(r.intercourseFromIso === '2026-06-23', 'from');
}

// LMP 28-day: LMP + 280 = EDD; conception = EDD − 266 = LMP + 14
{
  const r = calculatePregnancyConception({
    ...createDefaultInput(),
    method: 'lmp',
    lmpDate: '2026-06-14',
    cycleDays: '28',
  })!;
  assert(r.dueDateIso === '2027-03-21', `lmp edd ${r.dueDateIso}`);
  assert(r.conceptionIso === '2026-06-28', 'lmp conc');
}

// Ultrasound: GA 10w0d on exam → remaining 210 days to EDD
{
  const edd = dueDateFromUltrasound('2026-08-23', 10, 0);
  assert(edd === '2027-03-21', `us edd ${edd}`);
  const r = calculatePregnancyConception({
    ...createDefaultInput(),
    method: 'ultrasound',
    ultrasoundDate: '2026-08-23',
    ultrasoundWeeks: '10',
    ultrasoundDays: '0',
  })!;
  assert(r.conceptionIso === '2026-06-28', 'us conc');
}

assert(CONCEPTION_TO_DUE_DAYS === 266, '266');

{
  const v = validatePregnancyConceptionInput({
    ...createDefaultInput(),
    dueDate: '',
  });
  assert(!v.isValid && v.errors.dueDate, 'blank due');
}

console.log('pregnancy-conception calculation.test.ts: ok');
