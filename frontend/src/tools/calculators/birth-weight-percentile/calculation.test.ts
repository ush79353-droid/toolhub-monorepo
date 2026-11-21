/**
 * Assert self-check for Birth Weight Percentile Calculator (FMF BW Table 1).
 * Run: npx tsx src/tools/calculators/birth-weight-percentile/calculation.test.ts
 */
import {
  calculateBirthWeightPercentile,
  gestationalDayFromParts,
  gramsToWeight,
  interpolateCentileGrams,
  shareBirthWeightPercentileText,
  thresholdsAtDay,
  weightToGrams,
} from './calculation';
import { FMF_BW_KNOTS } from './datasets';
import { createExampleInput } from './types';
import { validateBirthWeightPercentileInput } from './validation';

function assert(cond: unknown, message: string): asserts cond {
  if (!cond) throw new Error(message);
}

const fixture = createExampleInput();
const validated = validateBirthWeightPercentileInput(fixture);
assert(validated.isValid && validated.result, 'fixture validates');
assert(
  validated.result.bandKind === 'between' &&
    validated.result.lowerPercentile === 10 &&
    validated.result.upperPercentile === 25,
  `fixture band ${validated.result.headline}`,
);
assert(
  validated.result.headline === 'Between 10th and 25th percentile.',
  `headline ${validated.result.headline}`,
);

const day354 = gestationalDayFromParts(35, 4);
assert(day354 === 35 * 7 + 4, '35+4 day count');
const p10 = interpolateCentileGrams(day354, 10);
const p25 = interpolateCentileGrams(day354, 25);
assert(p10 !== null && p25 !== null, 'interpolated 10/25');
assert(p10! < 2360 && 2360 < p25!, `2360 between ${p10} and ${p25}`);

const knot35 = FMF_BW_KNOTS.find((k) => k.gestationalDay === 248)!;
assert(knot35.p10 === 2262 && knot35.p25 === 2430, '35+3 source knots');

const day0 = thresholdsAtDay(gestationalDayFromParts(20, 0));
assert(day0 && day0[10] === FMF_BW_KNOTS[0]!.p10, 'day 0 holds first knot');
const day6 = thresholdsAtDay(gestationalDayFromParts(41, 6));
assert(day6 && day6[10] === FMF_BW_KNOTS.at(-1)!.p10, 'day 6 holds last knot');

const outside = calculateBirthWeightPercentile({
  weeks: 18,
  days: 0,
  weightGrams: 1000,
  weightUnit: 'g',
});
assert(outside?.bandKind === 'unavailable', 'below range unavailable');

assert(weightToGrams(2.36, 'kg') === 2360, 'kg→g');
assert(Math.abs(gramsToWeight(453.59237, 'lb') - 1) < 1e-9, 'g→lb');

const unitSwitch = validateBirthWeightPercentileInput({
  ...fixture,
  weight: '2.36',
  weightUnit: 'kg',
});
assert(
  unitSwitch.result?.bandKind === 'between' &&
    unitSwitch.result.lowerPercentile === 10,
  'kg fixture same band',
);

const blank = validateBirthWeightPercentileInput({
  weeks: '',
  days: '0',
  dayUnit: 'days',
  weight: '',
  weightUnit: 'g',
});
assert(blank.incomplete && !blank.isValid, 'blank incomplete');

const share = shareBirthWeightPercentileText(
  'https://example.com/tools/birth-weight-percentile-calculator',
);
assert(!share.includes('2360'), 'share omits clinical weight');
assert(share.includes('birth-weight-percentile-calculator'), 'share has url');

console.log('birth-weight-percentile calculation.test.ts: ok');
