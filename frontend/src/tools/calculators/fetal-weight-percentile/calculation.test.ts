/**
 * Run: npx tsx src/tools/calculators/fetal-weight-percentile/calculation.test.ts
 */
import {
  hadlockEfwGrams,
  shareFetalWeightPercentileText,
  thresholdsAtDay,
} from './calculation';
import { createExampleInput } from './types';
import { validateFetalWeightPercentileInput } from './validation';

function assert(cond: unknown, message: string): asserts cond {
  if (!cond) throw new Error(message);
}

const efw = hadlockEfwGrams({
  hcCm: 18,
  acCm: 15.4,
  bpdCm: 5.62,
  flCm: 3,
});
assert(Math.abs(efw - 334.37) < 0.01, `Hadlock EFW ${efw}`);

const fixture = validateFetalWeightPercentileInput(createExampleInput());
assert(fixture.isValid && fixture.result, 'fixture validates');
assert(
  Math.abs(fixture.result.efwGrams - 334.37) < 0.01,
  `result EFW ${fixture.result.efwGrams}`,
);
assert(
  fixture.result.bandKind === 'between' &&
    fixture.result.lowerPercentile === 25 &&
    fixture.result.upperPercentile === 50,
  `FMF band ${fixture.result.headline} (Omni screenshot said 50th; FMF median≈346g)`,
);
assert(fixture.result.normalRange, 'within 10–90');

const t = thresholdsAtDay(20 * 7);
assert(t && t[50] === 346, '20w holds first-knot median');

const blank = validateFetalWeightPercentileInput({
  ...createExampleInput(),
  weeks: '',
  ac: '',
});
assert(blank.incomplete, 'blank incomplete');

const share = shareFetalWeightPercentileText(
  'https://example.com/tools/fetal-weight-percentile-calculator',
);
assert(!share.includes('334'), 'share omits clinical EFW');

console.log('fetal-weight-percentile calculation.test.ts: ok');
