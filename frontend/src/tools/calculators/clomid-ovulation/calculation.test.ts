/**
 * Clomid Ovulation — assert-based engine check.
 * Run: npx tsx src/tools/calculators/clomid-ovulation/calculation.test.ts
 */
import {
  calculateClomidOvulation,
  lastTreatmentDayIso,
  ovulationWindowFromLastDay,
} from './calculation';
import { createExampleInput } from './types';
import { validateClomidOvulationInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Inclusive 5-day course
assert(lastTreatmentDayIso('2026-01-01', 5) === '2026-01-05', 'last day');
assert(lastTreatmentDayIso('2026-01-01', 1) === '2026-01-01', 'one-day course');

{
  const w = ovulationWindowFromLastDay('2026-01-05');
  assert(w.startIso === '2026-01-10', 'window start');
  assert(w.endIso === '2026-01-15', 'window end');
}

// Year rollover
assert(lastTreatmentDayIso('2026-12-30', 5) === '2027-01-03', 'year roll last');
{
  const w = ovulationWindowFromLastDay('2027-01-03');
  assert(w.startIso === '2027-01-08', 'roll window start');
  assert(w.endIso === '2027-01-13', 'roll window end');
}

{
  const v = validateClomidOvulationInput(createExampleInput());
  assert(v.isValid && v.result, 'example valid');
  assert(v.result!.formattedOvulationField.includes('01/10/2026'), 'fmt start');
  assert(v.result!.formattedOvulationField.includes('01/15/2026'), 'fmt end');
  assert(v.result!.lastTreatmentIso === '2026-01-05', 'last iso');
}

{
  const v = validateClomidOvulationInput({
    treatmentStart: '2026-01-01',
    durationDays: '',
  });
  assert(!v.isValid && v.result == null, 'blank duration inactive');
}

{
  const v = validateClomidOvulationInput({
    treatmentStart: '2026-01-01',
    durationDays: '2.5',
  });
  assert(!v.isValid && v.errors.durationDays, 'noninteger');
}

{
  const r = calculateClomidOvulation(
    { treatmentStart: '2026-01-01', durationDays: '5' },
    5
  );
  assert(r.ovulationWindowStartIso === '2026-01-10', 'calc start');
  assert(r.ovulationWindowEndIso === '2026-01-15', 'calc end');
}

console.log('clomid-ovulation calculation.test.ts: ok');
