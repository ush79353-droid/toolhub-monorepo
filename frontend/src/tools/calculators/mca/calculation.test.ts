/**
 * Run: npx tsx src/tools/calculators/mca/calculation.test.ts
 */
import {
  calculateMcaMoM,
  formatMom,
  formatVelocity,
  medianDisplayForInput,
  psvFromCmPerS,
  psvToCmPerS,
} from './calculation';
import { MARI_SINGLETON_MEDIAN_CMS } from './reference-data';
import { createEmptyInput } from './types';
import { validateMcaInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

const median14 = MARI_SINGLETON_MEDIAN_CMS[14];
assert(median14 === 19.3, 'fixture median 14w = 19.3');

const atMedian = calculateMcaMoM('single', 14, median14)!;
assert(Math.abs(atMedian.mom - 1) < 1e-9, 'median → MoM 1');

const atDouble = calculateMcaMoM('single', 14, median14 * 2)!;
assert(Math.abs(atDouble.mom - 2) < 1e-9, '2× median → MoM 2');

const w15 = calculateMcaMoM('single', 15, 20.2)!;
assert(Math.abs(w15.mom - 1) < 1e-9, 'week 15 boundary');

const cm = psvToCmPerS(193, 'mm/s');
assert(Math.abs(cm - 19.3) < 1e-9, 'mm/s → cm/s');
const back = psvFromCmPerS(19.3, 'mm/s');
assert(Math.abs(back - 193) < 1e-6, 'cm/s → mm/s display');

const input = createEmptyInput();
input.psvText = '19.3';
const mmInput = { ...input, velocityUnit: 'mm/s' as const, psvText: '193' };
const mmVal = validateMcaInput(mmInput);
assert(mmVal.isValid && mmVal.result, 'mm/s MoM valid');
assert(Math.abs(mmVal.result!.mom - 1) < 1e-9, 'mm/s MoM = 1');

input.plurality = 'twin';
input.gaWeeks = 14;
const twin14 = medianDisplayForInput(input);
assert(twin14.medianPsvCm == null, 'twin 14w no median');

input.gaWeeks = 15;
input.psvText = '25.4';
const twin15 = validateMcaInput(input);
assert(twin15.isValid && twin15.result, 'twin 15w MoM');
assert(Math.abs(twin15.result!.mom - 1) < 0.01, 'twin median MoM ~1');

input.plurality = 'single';
input.gaWeeks = 14;
input.psvText = '';
const afterPlurality = validateMcaInput(input);
assert(afterPlurality.result === null, 'cleared PSV after plurality switch');
assert(
  afterPlurality.medianDisplay.formattedMedian === formatVelocity(19.3, 'cm/s'),
  'singleton median after twin switch',
);

assert(formatMom(1.23456).includes('1.235') || formatMom(1.23456) === '1.235', 'mom format');

console.log('mca calculation.test.ts: ok');