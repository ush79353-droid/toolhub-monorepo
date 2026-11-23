/**
 * Fertility by Age — assert-based engine check.
 * Run: npx tsx src/tools/calculators/fertility-by-age/calculation.test.ts
 */
import { findBand, FECUNDABILITY_BANDS } from './calculation';
import { validateFertilityByAgeInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(findBand(20)?.percent === 24, '20 → 24');
assert(findBand(24)?.percent === 24, '24 edge');
assert(findBand(25)?.percent === 20, '25');
assert(findBand(34)?.percent === 17, '34');
assert(findBand(35)?.percent === 12, '35');
assert(findBand(44)?.percent === 6, '44');
assert(findBand(19) === null, '19 unsupported');
assert(findBand(45) === null, '45 unsupported');

{
  const v = validateFertilityByAgeInput({ ageYears: '' });
  assert(!v.isValid && !v.result, 'Select placeholder');
}

{
  const v = validateFertilityByAgeInput({ ageYears: '30' });
  assert(v.isValid && v.result?.chancePerCyclePercent === 17, '30 → 17');
  assert(v.result?.formattedPercent === '17', 'fmt');
}

assert(FECUNDABILITY_BANDS.length === 5, 'five bands');

console.log('fertility-by-age calculation.test.ts: ok');
