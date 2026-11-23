/**
 * Cerebral Perfusion Pressure — assert-based engine check (no test framework).
 * Run: npx tsx src/tools/calculators/cerebral-perfusion-pressure/calculation.test.ts
 */
import {
  AGE_REFERENCE_BANDS,
  approximateMapFromBloodPressure,
  calculateCerebralPerfusionPressure,
  formatPressureMmHg,
} from './calculation';
import { createExampleInput, createEmptyInput } from './types';
import { validateCerebralPerfusionPressureInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Prompt fixture: 90 − 15 = 75
{
  const v = validateCerebralPerfusionPressureInput(createExampleInput());
  assert(v.isValid && v.result != null, 'example valid');
  assert(v.result!.cppMmHg === 75, `expected 75 got ${v.result!.cppMmHg}`);
  assert(v.result!.mapSource === 'measured', 'measured MAP');
  assert(v.result!.ageGroup === '18+', 'adult default');
  assert(v.result!.referenceLowMmHg === 60, 'adult low band');
  assert(v.result!.referenceHighMmHg === 80, 'adult high band');
}

// Blank / missing ICP → inactive
{
  const v = validateCerebralPerfusionPressureInput({
    ...createExampleInput(),
    icpMmHg: '',
  });
  assert(!v.isValid && v.result == null, 'missing ICP inactive');
}

// Empty defaults inactive
{
  const v = validateCerebralPerfusionPressureInput(createEmptyInput());
  assert(!v.isValid && v.result == null, 'empty inactive');
}

// MAP from SBP/DBP: (120 + 2×80)/3 = 280/3 ≈ 93.333…
{
  const map = approximateMapFromBloodPressure(120, 80);
  assert(map != null && Math.abs(map - 280 / 3) < 1e-9, 'MAP formula');
  const v = validateCerebralPerfusionPressureInput({
    ageGroup: '18+',
    calculateMap: true,
    mapMmHg: '',
    sbpMmHg: '120',
    dbpMmHg: '80',
    icpMmHg: '10',
  });
  assert(v.isValid && v.result != null, 'calculated MAP valid');
  assert(v.result!.mapSource === 'calculated', 'calculated source');
  assert(
    Math.abs(v.result!.cppMmHg - (280 / 3 - 10)) < 1e-9,
    `cpp from calculated MAP got ${v.result!.cppMmHg}`
  );
}

// SBP < DBP rejected
{
  const v = validateCerebralPerfusionPressureInput({
    ageGroup: '18+',
    calculateMap: true,
    mapMmHg: '',
    sbpMmHg: '80',
    dbpMmHg: '120',
    icpMmHg: '10',
  });
  assert(!v.isValid && v.errors.form, 'SBP < DBP error');
}

// Pediatric age band changes interpretation only
{
  const r = calculateCerebralPerfusionPressure({
    ageGroup: '0-5',
    mapMmHg: 90,
    icpMmHg: 15,
    mapSource: 'measured',
  });
  assert(r.cppMmHg === 75, 'same arithmetic');
  assert(r.referenceLowMmHg === 30 && r.referenceHighMmHg === 40, '0-5 band');
  assert(AGE_REFERENCE_BANDS['6-11'].low === 35, '6-11 low');
  assert(AGE_REFERENCE_BANDS['12-17'].high === 60, '12-17 high');
}

// Formatting
assert(formatPressureMmHg(75) === '75', 'int format');
assert(formatPressureMmHg(93.333333) === '93.33', '2dp format');

// Non-finite rejected
{
  const v = validateCerebralPerfusionPressureInput({
    ...createExampleInput(),
    mapMmHg: 'NaN',
  });
  assert(!v.isValid && v.errors.mapMmHg, 'NaN MAP');
}

console.log('cerebral-perfusion-pressure calculation.test.ts: ok');
