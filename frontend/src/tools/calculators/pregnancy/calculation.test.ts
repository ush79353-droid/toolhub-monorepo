import assert from 'node:assert/strict';
import {
  calculatePregnancy,
  daysBetweenIso,
  dueDateFromMethod,
  IVF_DAY5_TO_DUE_DAYS,
  LMP_BASE_GESTATION_DAYS,
} from './calculation';
import { createDefaultInput } from './types';
import { validatePregnancyInput } from './validation';

// Due-date mode sample Mar 21, 2027 → LMP-equivalent −280
{
  const input = createDefaultInput();
  const r = calculatePregnancy({ ...input, asOfDate: '2027-03-21' });
  assert.ok(r);
  assert.equal(r!.dueDateIso, '2027-03-21');
  assert.equal(r!.lmpEquivalentIso, '2026-06-14'); // 280 days before
  assert.equal(r!.gestationalAgeDays, LMP_BASE_GESTATION_DAYS);
}

// LMP + 280
{
  const derived = dueDateFromMethod({
    ...createDefaultInput(),
    method: 'lmp',
    primaryDate: '2026-06-14',
    cycleDays: '28',
  });
  assert.ok(derived);
  assert.equal(derived!.dueDateIso, '2027-03-21');
}

// Ultrasound: scan + (280 − GA)
{
  const derived = dueDateFromMethod({
    ...createDefaultInput(),
    method: 'ultrasound',
    primaryDate: '2026-09-01',
    usWeeks: '12',
    usDays: '0',
  });
  assert.ok(derived);
  // 280 − 84 = 196 days after scan
  assert.equal(derived!.dueDateIso, '2027-03-16');
}

// IVF day-5
{
  const derived = dueDateFromMethod({
    ...createDefaultInput(),
    method: 'ivf',
    primaryDate: '2026-06-01',
    ivfEmbryoAge: 'day5',
  });
  assert.ok(derived);
  assert.equal(
    daysBetweenIso('2026-06-01', derived!.dueDateIso),
    IVF_DAY5_TO_DUE_DAYS,
  );
}

// Leap-year LMP path
{
  const derived = dueDateFromMethod({
    ...createDefaultInput(),
    method: 'lmp',
    primaryDate: '2024-02-01',
    cycleDays: '28',
  });
  assert.ok(derived);
  assert.equal(derived!.dueDateIso, '2024-11-07');
}

{
  const v = validatePregnancyInput(createDefaultInput());
  assert.equal(v.isValid, true);
  assert.ok(v.result);
}

console.log('pregnancy calculation.test.ts: ok');
