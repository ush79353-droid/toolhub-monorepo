/**
 * Crown-rump Length — assert-based engine check.
 * Run: npx tsx src/tools/calculators/crown-rump-length/calculation.test.ts
 */
import {
  crlToMm,
  gestationalAgeDaysFromCrlMm,
  mmToCrlUnit,
  splitGestationalAge,
  MAX_CRL_MM,
  MIN_CRL_MM,
} from './calculation';
import { validateCrownRumpLengthInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Unit conversion
assert(crlToMm(3, 'cm') === 30, '3 cm → 30 mm');
assert(Math.abs(crlToMm(1, 'in')! - 25.4) < 1e-9, '1 in');
assert(mmToCrlUnit(30, 'cm') === 3, '30 mm → 3 cm');

// Robinson fixtures (rounded once)
// 10 mm: 8.052*sqrt(10)+23.73 ≈ 49.19 → 49
assert(gestationalAgeDaysFromCrlMm(10) === 49, '10 mm');
// 20 mm: 8.052*sqrt(20)+23.73 ≈ 59.74 → 60
assert(gestationalAgeDaysFromCrlMm(20) === 60, '20 mm → 8w4d');
assert(splitGestationalAge(60).weeks === 8 && splitGestationalAge(60).days === 4, '8w4d');
// 30 mm: 8.052*sqrt(30)+23.73 ≈ 67.84 → 68
assert(gestationalAgeDaysFromCrlMm(30) === 68, '30 mm');
// 60 mm: 8.052*sqrt(60)+23.73 ≈ 86.12 → 86
assert(gestationalAgeDaysFromCrlMm(60) === 86, '60 mm');

// Bounds — no extrapolation
assert(gestationalAgeDaysFromCrlMm(MIN_CRL_MM - 0.1) === null, 'below min');
assert(gestationalAgeDaysFromCrlMm(MAX_CRL_MM + 0.1) === null, 'above max');
assert(gestationalAgeDaysFromCrlMm(MAX_CRL_MM) != null, 'at max');

// Week transition: 63 days = 9w0d
{
  const s = splitGestationalAge(63);
  assert(s.weeks === 9 && s.days === 0, '9w0d');
}

// Validation blank inactive
{
  const v = validateCrownRumpLengthInput({
    crlValue: '',
    crlUnit: 'mm',
    gaDisplayUnit: 'days',
  });
  assert(!v.isValid && !v.result, 'blank');
}

// cm path equivalence
{
  const v = validateCrownRumpLengthInput({
    crlValue: '2',
    crlUnit: 'cm',
    gaDisplayUnit: 'weeksDays',
  });
  assert(v.result?.crlMm === 20, '2 cm');
  assert(v.result?.gestationalAgeDays === 60, '2 cm → 60d');
}

console.log('crown-rump-length calculation.test.ts: ok');
