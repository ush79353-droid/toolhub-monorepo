/**
 * Focused WHR engine self-check.
 * Run: npx tsx src/tools/calculators/waist-to-hip/calculation.test.ts
 */

import {
  calculateWhr,
  calculateWhrRatio,
  formatRatioDisplay,
  toCm,
} from './calculation';
import { createDefaultInput } from './types';
import { validateWhrInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

function nearly(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

assert(nearly(calculateWhrRatio(80, 100), 0.8), '80/100');
assert(formatRatioDisplay(0.8) === '0.8', 'format 0.8');

const r = calculateWhr({
  waistText: '80',
  waistUnit: 'cm',
  hipText: '100',
  hipUnit: 'cm',
});
assert(r.ratio === 0.8, 'result 0.8');
assert(r.formattedRatio === '0.8', 'display');

const mixed = calculateWhr({
  waistText: '0.8',
  waistUnit: 'm',
  hipText: '100',
  hipUnit: 'cm',
});
assert(nearly(mixed.ratio!, 0.8), 'unit normalize');
assert(nearly(toCm(0.8, 'm'), 80), '0.8 m = 80 cm');

const blank = calculateWhr(createDefaultInput());
assert(blank.ratio === null, 'blank clears');

const bad = validateWhrInput({
  ...createDefaultInput(),
  waistText: '80',
  hipText: '0',
});
assert(bad.result === null, 'hip 0 blocks');

console.log('waist-to-hip calculation.test.ts: ok');
