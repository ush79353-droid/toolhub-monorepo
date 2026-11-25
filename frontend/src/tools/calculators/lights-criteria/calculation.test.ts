/**
 * Light's criteria — assert-based engine check (Ponytail).
 * Run: npx tsx src/tools/calculators/lights-criteria/calculation.test.ts
 */

import { calculateLightsCriteria, proteinToGdl } from './calculation';
import { createDefaultInput } from './types';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

const blank = createDefaultInput();

// Incomplete: no values → incomplete (not transudate)
const empty = calculateLightsCriteria(blank);
assert(empty.classification === 'incomplete', 'blank → incomplete');

// Boundary equality is NOT exudate (strict >)
const proteinEq = calculateLightsCriteria({
  ...blank,
  pleuralProteinText: '3',
  serumProteinText: '6', // ratio 0.5 exactly
});
assert(proteinEq.proteinCriterionMet === false, 'protein =0.5 not met');
assert(proteinEq.classification === 'incomplete', 'only protein assessed → incomplete');

const proteinEx = calculateLightsCriteria({
  ...blank,
  pleuralProteinText: '3.1',
  serumProteinText: '6', // >0.5
});
assert(proteinEx.classification === 'exudate', 'single protein positive → exudate');
assert(proteinEx.proteinCriterionMet === true, 'protein criterion true');

// LDH ratio boundary
const ldhEq = calculateLightsCriteria({
  ...blank,
  pleuralLdhText: '180',
  serumLdhText: '300', // 0.6 exactly
});
assert(ldhEq.ldhRatioCriterionMet === false, 'LDH ratio =0.6 not met');

const ldhEx = calculateLightsCriteria({
  ...blank,
  pleuralLdhText: '181',
  serumLdhText: '300',
});
assert(ldhEx.classification === 'exudate', 'LDH ratio alone → exudate');

// Absolute LDH vs 2/3 ULN — ULN 300 → 200; equality not exudate
const absEq = calculateLightsCriteria({
  ...blank,
  pleuralLdhText: '200',
  ldhUpperLimitText: '300',
});
assert(absEq.ldhAbsoluteCriterionMet === false, 'LDH =2/3 ULN not met');
assert(approx(absEq.twoThirdsUpperLimit as number, 200), '2/3 of 300 = 200');

const absEx = calculateLightsCriteria({
  ...blank,
  pleuralLdhText: '201',
  ldhUpperLimitText: '300',
});
assert(absEx.classification === 'exudate', 'absolute LDH alone → exudate');

// Full transudate: all three assessed, none met
const trans = calculateLightsCriteria({
  ...blank,
  pleuralProteinText: '2',
  serumProteinText: '6', // 0.333
  pleuralLdhText: '100',
  serumLdhText: '300', // 0.333
  ldhUpperLimitText: '300', // 2/3=200; 100 < 200
});
assert(trans.classification === 'transudate', 'all negative → transudate');

// g/L vs g/dL unit conversion helpers
assert(approx(proteinToGdl(30, 'g_l'), 3), '30 g/L → 3 g/dL');
const gL = calculateLightsCriteria({
  ...blank,
  proteinUnit: 'g_l',
  pleuralProteinText: '31',
  serumProteinText: '60', // ratio >0.5
});
assert(gL.classification === 'exudate', 'g/L path exudate');

// Zero serum protein guarded
const zeroSerum = calculateLightsCriteria({
  ...blank,
  pleuralProteinText: '3',
  serumProteinText: '0',
});
assert(zeroSerum.classification === 'invalid', 'zero serum protein invalid');

console.log('lights-criteria calculation.test.ts: ok');
