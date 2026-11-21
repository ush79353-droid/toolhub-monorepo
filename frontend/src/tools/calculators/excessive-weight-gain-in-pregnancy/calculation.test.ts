/**
 * Identity + privacy share self-check.
 * Run: npx tsx src/tools/calculators/excessive-weight-gain-in-pregnancy/calculation.test.ts
 */
import { calculatePregnancyWeightGain as canonical } from '../pregnancy-weight-gain/calculation';
import {
  calculatePregnancyWeightGain,
  shareExcessiveWeightGainText,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateExcessiveWeightGainInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

const defaults = createDefaultInput();
assert(defaults.twins === false, 'twins default No');
assert(defaults.week === '40', 'week 40');
assert(defaults.height === '' && defaults.weight === '', 'blank anthropometry');

const input = createExampleInput();
const a = calculatePregnancyWeightGain(input);
const b = canonical(input);
assert(a != null && b != null, 'both engines return');
assert(a!.bmi === b!.bmi, 'BMI identity');
assert(Math.abs(a!.bmi - 22.04) < 0.01, '165cm/60kg BMI ≈ 22.04');
assert(a!.minGainKg === 11.5 && a!.maxGainKg === 16, 'singleton term gain');
assert(a!.minWeightKg === 71.5 && a!.maxWeightKg === 76, 'singleton term weight');
assert(a!.minGainKg === b!.minGainKg && a!.maxGainKg === b!.maxGainKg, 'gain identity');
assert(a!.minWeightKg === b!.minWeightKg && a!.maxWeightKg === b!.maxWeightKg, 'weight identity');

const twin = calculatePregnancyWeightGain({ ...input, twins: true });
assert(twin != null && twin.minGainKg === 17 && twin.maxGainKg === 25, 'twin normal band');

const v = validateExcessiveWeightGainInput(input);
assert(v.isValid && v.result != null, 'validation ok');

const share = shareExcessiveWeightGainText(
  'https://example.com/tools/excessive-weight-gain-in-pregnancy',
);
assert(!share.includes('165'), 'share omits height');
assert(!share.includes('60'), 'share omits weight');
assert(share.includes('excessive-weight-gain-in-pregnancy'), 'share has slug');

console.log('excessive-weight-gain-in-pregnancy calculation.test.ts: ok');
