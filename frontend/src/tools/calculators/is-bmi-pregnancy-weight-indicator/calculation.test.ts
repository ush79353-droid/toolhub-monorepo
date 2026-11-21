/**
 * Identity + article framing self-check.
 * Run: npx tsx src/tools/calculators/is-bmi-pregnancy-weight-indicator/calculation.test.ts
 */
import { calculatePregnancyWeightGain as canonical } from '../pregnancy-weight-gain/calculation';
import { createExampleInput } from '../pregnancy-weight-gain/types';
import {
  ARTICLE_THESIS,
  calculatePregnancyWeightGain,
  shareIsBmiPregnancyWeightIndicatorText,
} from './calculation';
import { validatePregnancyWeightGainInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

const input = createExampleInput();
const a = calculatePregnancyWeightGain(input);
const b = canonical(input);
assert(a != null && b != null, 'both engines return');
assert(a!.bmi === b!.bmi, 'BMI identity');
assert(a!.minGainKg === b!.minGainKg, 'min gain identity');
assert(a!.maxGainKg === b!.maxGainKg, 'max gain identity');
assert(a!.minWeightKg === b!.minWeightKg, 'min weight identity');
assert(a!.maxWeightKg === b!.maxWeightKg, 'max weight identity');
assert(a!.bmiCategory === 'normal', '165cm/60kg normal');
assert(ARTICLE_THESIS.toLowerCase().includes('does not measure'), 'thesis');

const v = validatePregnancyWeightGainInput(input);
assert(v.isValid && v.result != null, 'validation ok');

const share = shareIsBmiPregnancyWeightIndicatorText(
  'https://example.com/tools/is-bmi-body-mass-index-a-weight-gain-indicator-in-pregnancy',
);
assert(!share.includes('165'), 'share omits height');
assert(!share.includes('60'), 'share omits weight');
assert(share.includes('is-bmi-body-mass-index'), 'share has slug');

console.log('is-bmi-pregnancy-weight-indicator calculation.test.ts: ok');
