/**
 * Bishop Score — assert-based engine check (no test framework).
 * Run: npx tsx src/tools/calculators/bishop-score/calculation.test.ts
 */
import {
  calculateBishopScore,
  cmToDilationUnit,
  dilationToCm,
  scoreDilationCm,
  EFFACEMENT_POINTS,
  CONSISTENCY_POINTS,
  STATION_POINTS,
  POSITION_POINTS,
  MAX_DILATION_CM,
} from './calculation';
import { createExampleInput } from './types';
import { validateBishopScoreInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Dilation band edges
assert(scoreDilationCm(0) === 0, 'closed 0');
assert(scoreDilationCm(0.9) === 0, '0.9 → 0');
assert(scoreDilationCm(1) === 1, '1 → 1');
assert(scoreDilationCm(2.9) === 1, '2.9 → 1');
assert(scoreDilationCm(3) === 2, '3 → 2');
assert(scoreDilationCm(4.9) === 2, '4.9 → 2');
assert(scoreDilationCm(5) === 3, '5 → 3');
assert(scoreDilationCm(10) === 3, '10 → 3');
assert(scoreDilationCm(10.1) === null, 'above max');
assert(scoreDilationCm(-1) === null, 'negative');

// Unit conversion
assert(dilationToCm(20, 'mm') === 2, '20 mm → 2 cm');
assert(dilationToCm(2, 'cm') === 2, '2 cm');
assert(cmToDilationUnit(2, 'mm') === 20, '2 cm → 20 mm');

// Minima: all zero bands
{
  const input = createExampleInput();
  const v = validateBishopScoreInput(input);
  assert(v.isValid && v.result != null, 'example valid');
  assert(v.result!.totalScore === 0, 'min score 0');
}

// Maxima: 13
{
  const input = {
    dilationValue: '5',
    dilationUnit: 'cm' as const,
    effacement: '80+' as const,
    consistency: 'soft' as const,
    station: 'plus1Or2' as const,
    position: 'anterior' as const,
  };
  const pts = scoreDilationCm(5)!;
  const r = calculateBishopScore(input, 5, pts);
  assert(r.totalScore === 13, `max got ${r.totalScore}`);
  assert(
    EFFACEMENT_POINTS['80+'] +
      CONSISTENCY_POINTS.soft +
      STATION_POINTS.plus1Or2 +
      POSITION_POINTS.anterior +
      3 ===
      13,
    'component sum 13'
  );
}

// Blank dilation → inactive
{
  const v = validateBishopScoreInput({
    ...createExampleInput(),
    dilationValue: '',
  });
  assert(!v.isValid && v.result == null, 'blank inactive');
}

// mm path: 50 mm = 5 cm → 3 points
{
  const v = validateBishopScoreInput({
    ...createExampleInput(),
    dilationValue: '50',
    dilationUnit: 'mm',
    effacement: '80+',
    consistency: 'soft',
    station: 'plus1Or2',
    position: 'anterior',
  });
  assert(v.result?.totalScore === 13, 'mm max 13');
  assert(v.result?.dilationCm === 5, '50 mm → 5 cm');
}

// Over max dilation
{
  const v = validateBishopScoreInput({
    ...createExampleInput(),
    dilationValue: String(MAX_DILATION_CM + 1),
  });
  assert(!v.isValid && v.errors.dilationValue, 'over max error');
}

console.log('bishop-score calculation.test.ts: ok');
