/**
 * Implantation Calculator — assert-based engine check.
 * Run: npx tsx src/tools/calculators/implantation/calculation.test.ts
 */
import { addDaysToIsoDate } from '../loan/calculation';
import {
  NATURAL_IMPLANT_MAX_DPO,
  NATURAL_IMPLANT_MIN_DPO,
  NATURAL_IMPLANT_TYPICAL_DPO,
  IVF_IMPLANT_TYPICAL_AFTER_TRANSFER,
  calculateImplantation,
  formatDisplayDate,
  suggestOvulationFromLmp,
} from './calculation';
import { createEmptyInput } from './types';
import { validateImplantationInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Natural known ovulation → window
{
  const ov = '2026-03-15';
  const r = calculateImplantation({
    ...createEmptyInput(),
    natural: {
      knowsOvulation: 'yes',
      ovulationIso: ov,
      cycleLengthDaysText: '28',
      lastPeriodIso: '',
    },
  });
  assert(r.natural.ready, 'natural ready');
  assert(
    r.natural.window?.typicalIso ===
      addDaysToIsoDate(ov, NATURAL_IMPLANT_TYPICAL_DPO),
    'typical DPO',
  );
  assert(
    r.natural.window?.startIso ===
      addDaysToIsoDate(ov, NATURAL_IMPLANT_MIN_DPO),
    'min DPO',
  );
  assert(
    r.natural.window?.endIso === addDaysToIsoDate(ov, NATURAL_IMPLANT_MAX_DPO),
    'max DPO',
  );
}

// Natural unknown ovulation → LMP + cycle
{
  const input = createEmptyInput();
  input.natural.knowsOvulation = 'no';
  input.natural.lastPeriodIso = '2026-01-01';
  input.natural.cycleLengthDaysText = '30';
  const r = calculateImplantation(input);
  const expectedOv = suggestOvulationFromLmp('2026-01-01', 30);
  assert(r.natural.ovulationIso === expectedOv, 'estimated ovulation');
  assert(r.natural.ovulationEstimated, 'flag estimated');
}

// IVF transfer only — no embryo age
{
  const transfer = '2026-04-10';
  const r = calculateImplantation({
    ...createEmptyInput(),
    ivf: { transferIso: transfer },
  });
  assert(
    r.ivf.window?.typicalIso ===
      addDaysToIsoDate(transfer, IVF_IMPLANT_TYPICAL_AFTER_TRANSFER),
    'ivf typical',
  );
  assert(r.ivf.embryoAgeSpecified === false, 'no embryo age');
}

// Month/year rollover
assert(
  addDaysToIsoDate('2026-01-30', 5) === '2026-02-04',
  'jan rollover',
);
assert(
  addDaysToIsoDate('2024-02-28', 3) === '2024-03-02',
  'leap feb',
);

// Incomplete branches
{
  const v = validateImplantationInput(createEmptyInput());
  assert(!v.result, 'empty input');
}
{
  const input = createEmptyInput();
  input.natural.knowsOvulation = 'yes';
  input.natural.ovulationIso = 'not-a-date';
  const v = validateImplantationInput(input);
  assert(!v.result && v.errors.naturalOvulation, 'bad ovulation');
}
{
  const input = createEmptyInput();
  input.natural.knowsOvulation = 'no';
  input.natural.cycleLengthDaysText = '10';
  input.natural.lastPeriodIso = '2026-01-01';
  const v = validateImplantationInput(input);
  assert(!v.result && v.errors.naturalCycle, 'bad cycle');
}

// Display format
assert(formatDisplayDate('2026-07-04') === '07/04/2026', 'US display');

// Mode switch clears stale path — partial natural without LMP
{
  const input = createEmptyInput();
  input.natural.knowsOvulation = 'no';
  input.natural.cycleLengthDaysText = '28';
  const v = validateImplantationInput(input);
  assert(!v.result, 'no LMP');
}

console.log('implantation calculation.test.ts: ok');