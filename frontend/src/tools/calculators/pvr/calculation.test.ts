/**
 * PVR — assert-based engine check (no test framework).
 * Run: npx tsx src/tools/calculators/pvr/calculation.test.ts
 */
import {
  WOOD_TO_DYNES,
  calculatePvr,
  formatResistance,
  mmHgToPressureUnit,
  pressureToMmHg,
} from './calculation';
import { createEmptyInput, createExampleInput } from './types';
import { validatePvrInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Prompt fixture: 30, 10, 5 → 320 dyn·s·cm⁻⁵
{
  const v = validatePvrInput(createExampleInput());
  assert(v.isValid && v.result != null, 'example valid');
  assert(v.result!.woodUnits === 4, `wood expected 4 got ${v.result!.woodUnits}`);
  assert(
    v.result!.dynesSecCm5 === 320,
    `dynes expected 320 got ${v.result!.dynesSecCm5}`,
  );
  assert(v.result!.formattedDynes === '320', 'formatted dynes');
  assert(v.result!.formattedPrimary === '320', 'primary dyn display');
}

// Wood display switch
{
  const v = validatePvrInput({
    ...createExampleInput(),
    resistanceUnit: 'wood',
  });
  assert(v.isValid && v.result != null, 'wood display valid');
  assert(v.result!.formattedPrimary === '4', 'primary wood display');
}

// Empty / missing inactive
{
  const v = validatePvrInput(createEmptyInput());
  assert(!v.isValid && v.result == null, 'empty inactive');
}

// Missing CO
{
  const v = validatePvrInput({ ...createExampleInput(), coText: '' });
  assert(!v.isValid && v.result == null, 'missing CO inactive');
}

// Zero CO rejected
{
  const v = validatePvrInput({ ...createExampleInput(), coText: '0' });
  assert(!v.isValid && v.errors.coText, 'zero CO error');
  assert(v.result == null, 'zero CO no result');
}

// Physiologically inconsistent gradient (LAP ≥ mPAP)
{
  const v = validatePvrInput({
    ...createExampleInput(),
    mpapText: '10',
    lapText: '15',
  });
  assert(!v.isValid && v.errors.form, 'negative gradient form error');
  assert(v.result == null, 'negative gradient no result');
}

// Equivalent unit switch: 30 mmHg ↔ kPa preserves math
{
  const kPa = mmHgToPressureUnit(30, 'kPa');
  assert(Math.abs(pressureToMmHg(kPa, 'kPa') - 30) < 1e-9, 'round-trip mmHg');
  const v = validatePvrInput({
    mpapText: String(kPa),
    mpapUnit: 'kPa',
    lapText: '10',
    lapUnit: 'mmHg',
    coText: '5',
    resistanceUnit: 'dyn',
  });
  assert(v.isValid && v.result != null, 'kPa mPAP valid');
  assert(
    Math.abs(v.result!.dynesSecCm5 - 320) < 1e-6,
    `kPa path dynes got ${v.result!.dynesSecCm5}`,
  );
}

// Direct engine
{
  const r = calculatePvr({
    mpapMmHg: 30,
    lapMmHg: 10,
    coLPerMin: 5,
    resistanceUnit: 'dyn',
  });
  assert(r.woodUnits * WOOD_TO_DYNES === r.dynesSecCm5, '×80 identity');
}

assert(formatResistance(320) === '320', 'int format');
assert(formatResistance(4.5) === '4.5', '1dp format');

// NaN rejected
{
  const v = validatePvrInput({ ...createExampleInput(), mpapText: 'NaN' });
  assert(!v.isValid && v.errors.mpapText, 'NaN mPAP');
}

console.log('pvr calculation.test.ts: ok');
