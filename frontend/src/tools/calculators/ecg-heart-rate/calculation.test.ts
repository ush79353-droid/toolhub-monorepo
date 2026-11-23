/**
 * ECG Heart Rate — assert-based engine check (no test framework).
 * Run: npx tsx src/tools/calculators/ecg-heart-rate/calculation.test.ts
 */
import {
  BIG_BOX_MM,
  boxesToDistanceMm,
  bpmFromDurationSec,
  calculateEcgHeartRate,
  durationSecFromDistanceMm,
  intervalToDistanceMm,
} from './calculation';
import { createEmptyInput, createExampleInput } from './types';
import { validateEcgHeartRateInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Prompt: 20 mm @ 25 mm/s → 75 bpm
{
  const d = durationSecFromDistanceMm(20, 25);
  assert(d === 0.8, '20/25=0.8s');
  assert(bpmFromDurationSec(0.8) === 75, '60/0.8=75');
  const r = calculateEcgHeartRate({ distanceMm: 20, paperSpeed: 25 });
  assert(r?.bpm === 75, 'calc 75');
}

// Four large boxes = 20 mm
assert(BIG_BOX_MM === 5, 'big=5');
assert(boxesToDistanceMm(4, 'big') === 20, '4 big=20');
{
  const v = validateEcgHeartRateInput({
    ...createEmptyInput(),
    boxesValue: '4',
    boxType: 'big',
    paperSpeed: 25,
    lastEdited: 'boxes',
  });
  assert(v.result?.bpm === 75, '4 big boxes → 75');
  assert(v.synced.intervalValue === '20', 'sync mm 20');
}

// Example input
{
  const v = validateEcgHeartRateInput(createExampleInput());
  assert(v.isValid && v.result?.bpm === 75, 'example 75');
}

// Blank inactive
{
  const v = validateEcgHeartRateInput(createEmptyInput());
  assert(!v.isValid && v.result == null, 'blank inactive');
}

// Zero rejected
{
  const v = validateEcgHeartRateInput({
    ...createEmptyInput(),
    intervalValue: '0',
    lastEdited: 'interval',
  });
  assert(!v.isValid && v.errors.intervalValue, 'zero rejected');
}

// Time unit: 0.8 s @ 25 → 20 mm → 75
{
  const mm = intervalToDistanceMm(0.8, 's', 25);
  assert(mm === 20, '0.8s → 20mm');
  const v = validateEcgHeartRateInput({
    ...createEmptyInput(),
    intervalValue: '0.8',
    intervalUnit: 's',
    paperSpeed: 25,
    lastEdited: 'interval',
  });
  assert(v.result?.bpm === 75, '0.8s → 75');
}

// 50 mm/s: 20 mm → 0.4 s → 150 bpm
{
  const v = validateEcgHeartRateInput({
    ...createEmptyInput(),
    intervalValue: '20',
    paperSpeed: 50,
    lastEdited: 'interval',
  });
  assert(v.result?.bpm === 150, '50mm/s → 150');
}

console.log('ecg-heart-rate calculation.test.ts: ok');
