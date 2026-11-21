/**
 * Run: npx tsx src/tools/calculators/maintain-pregnancy-weight/calculation.test.ts
 */
import {
  calculateBmi,
  calculateMaintainPregnancyWeight,
  gainProgressFraction,
  totalGainRangeKg,
} from './calculation';
import { createEmptyInput, createExampleInput } from './types';
import { validateMaintainPregnancyWeightInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

assert(Math.abs(calculateBmi(1.65, 60) - 60 / (1.65 * 1.65)) < 1e-12, 'bmi');
assert(gainProgressFraction(0) === 0, 'w0');
assert(gainProgressFraction(40) === 1, 'w40');
assert(gainProgressFraction(20) === 0.5, 'w20');

const normal = totalGainRangeKg('normal', false);
assert(normal.min === 11.5 && normal.max === 16, 'singleton normal');

const ex = calculateMaintainPregnancyWeight(createExampleInput());
assert(ex != null, 'example');
assert(ex!.bmiCategoryLabel.startsWith('Normal'), 'normal band');
assert(Math.abs(ex!.minGainKg - 11.5) < 1e-9, `minGain ${ex!.minGainKg}`);
assert(Math.abs(ex!.maxGainKg - 16) < 1e-9, `maxGain ${ex!.maxGainKg}`);

const mid = calculateMaintainPregnancyWeight({
  ...createExampleInput(),
  week: '20',
});
assert(mid != null && Math.abs(mid.minGainKg - 5.75) < 1e-9, 'half gain');

assert(!validateMaintainPregnancyWeightInput(createEmptyInput()).isValid, 'empty');

console.log('maintain-pregnancy-weight calculation.test.ts: all asserts passed');
