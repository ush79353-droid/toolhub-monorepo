/**
 * Focused draw-length engine self-check.
 * Run: npx tsx src/tools/calculators/draw-length/calculation.test.ts
 */

import {
  calculateDrawLength,
  drawLengthFromWingspanCm,
  formatLength,
  fromCm,
  toCm,
  wingspanFromDrawLengthCm,
} from './calculation';
import { createDefaultInput } from './types';
import { validateDrawLengthInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

function nearly(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

assert(nearly(toCm(1, 'm'), 100), '1 m = 100 cm');
assert(nearly(fromCm(100, 'm'), 1), '100 cm = 1 m');
assert(nearly(drawLengthFromWingspanCm(toCm(70, 'in')), toCm(28, 'in')), '70→28 in');
assert(nearly(wingspanFromDrawLengthCm(toCm(28, 'in')), toCm(70, 'in')), '28→70 in');

const forward = calculateDrawLength({
  wingspanText: '70',
  wingspanUnit: 'in',
  drawLengthText: '',
  drawLengthUnit: 'in',
  lastEdited: 'wingspan',
});
assert(forward.formattedDrawLength === '28', 'format 28');

const metric = calculateDrawLength({
  wingspanText: '1',
  wingspanUnit: 'm',
  drawLengthText: '',
  drawLengthUnit: 'cm',
  lastEdited: 'wingspan',
});
assert(nearly(metric.drawLengthCm!, 40), '1 m → 40 cm draw');
assert(metric.formattedDrawLength === '40', 'display 40 cm');

const blank = calculateDrawLength(createDefaultInput());
assert(blank.drawLengthCm === null, 'blank clears');

const invalid = validateDrawLengthInput({
  ...createDefaultInput(),
  wingspanText: 'abc',
  lastEdited: 'wingspan',
});
assert(invalid.result === null, 'invalid blocks');

assert(formatLength(28) === '28', 'format int');

console.log('draw-length calculation.test.ts: ok');
