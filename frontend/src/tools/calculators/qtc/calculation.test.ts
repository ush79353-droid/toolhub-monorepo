/**
 * QTc — assert-based engine check (no test framework).
 * Run: npx tsx src/tools/calculators/qtc/calculation.test.ts
 */
import {
  calculateQtc,
  heartRateFromRrSec,
  qtcBazettMs,
  qtcFridericiaMs,
  qtcFraminghamMs,
  qtcHodgesMs,
  rrSecFromHeartRate,
} from './calculation';
import { createEmptyInput, createExampleInput } from './types';
import { validateQtcInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Prompt: 400 ms QT at HR 60 → QTc 400; HR 120 → RR 500 ms
{
  const rr60 = rrSecFromHeartRate(60);
  assert(rr60 === 1, '60 bpm → RR 1 s');
  assert(qtcBazettMs(400, 1) === 400, 'Bazett @60 = 400');
  const rr120 = rrSecFromHeartRate(120);
  assert(rr120 === 0.5, '120 bpm → 0.5 s');
  assert(Math.abs((rr120 ?? 0) * 1000 - 500) < 1e-9, 'RR 500 ms');
}

{
  const r = calculateQtc({ qtMs: 400, rrSec: 1, heartRateBpm: 60 });
  assert(r?.bazettMs === 400, 'calc bazett 400');
  assert(r?.methods.length === 4, '4 methods');
}

// Fridericia / Framingham / Hodges sanity at 60 bpm
{
  assert(qtcFridericiaMs(400, 1) === 400, 'Fridericia @60');
  assert(qtcFraminghamMs(400, 1) === 400, 'Framingham @60');
  assert(qtcHodgesMs(400, 60) === 400, 'Hodges @60');
}

// Example validation
{
  const v = validateQtcInput(createExampleInput());
  assert(v.isValid && v.result?.bazettMs === 400, 'example 400');
  assert(v.synced.rrValue === '1000', 'sync RR 1000 ms');
}

// HR 120 syncs RR 500 ms
{
  const v = validateQtcInput({
    ...createEmptyInput(),
    qtValue: '400',
    heartRateBpm: '120',
    lastEdited: 'heartRate',
  });
  assert(v.isValid, 'hr120 valid');
  assert(v.synced.rrValue === '500', 'RR 500');
  const expected = 400 / Math.sqrt(0.5);
  assert(
    Math.abs((v.result?.bazettMs ?? 0) - expected) < 1e-9,
    'Bazett @120'
  );
}

// RR edit syncs HR
{
  const v = validateQtcInput({
    ...createEmptyInput(),
    qtValue: '400',
    rrValue: '1000',
    rrUnit: 'ms',
    lastEdited: 'rr',
  });
  assert(v.synced.heartRateBpm === '60', 'HR sync 60');
  assert(v.result?.bazettMs === 400, 'RR path 400');
}

// Blank inactive
{
  const v = validateQtcInput(createEmptyInput());
  assert(!v.isValid && v.result == null, 'blank inactive');
}

// Zero RR / HR rejected
{
  const v = validateQtcInput({
    ...createEmptyInput(),
    qtValue: '400',
    heartRateBpm: '0',
    lastEdited: 'heartRate',
  });
  assert(!v.isValid && v.errors.heartRateBpm, 'zero HR rejected');
}

{
  const v = validateQtcInput({
    ...createEmptyInput(),
    qtValue: '400',
    rrValue: '0',
    lastEdited: 'rr',
  });
  assert(!v.isValid && v.errors.rrValue, 'zero RR rejected');
}

assert(heartRateFromRrSec(0.5) === 120, '0.5s → 120 bpm');

console.log('qtc calculation.test.ts: ok');
