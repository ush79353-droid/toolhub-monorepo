/**
 * Egg Freezing — assert-based engine check (no test framework).
 * Run: npx tsx src/tools/calculators/egg-freezing/calculation.test.ts
 */
import {
  formatPercentDisplay,
  pBlastocyst,
  pEuploid,
  pPerMatureOocyte,
  probabilityAtLeastOneLiveBirth,
} from './calculation';
import { createExampleInput } from './types';
import { validateEggFreezingInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 0.01): boolean {
  return Math.abs(a - b) <= eps;
}

// Table SI euploidy
assert(pEuploid(35) === 0.574, '≤35 euploid');
assert(pEuploid(30) === 0.574, 'age 30 uses ≤35');
assert(pEuploid(37) === 0.486, 'age 37 euploid');
assert(pEuploid(44) === 0.127, 'age 44 euploid');

// Published examples (Table SII / paper text)
{
  const p = probabilityAtLeastOneLiveBirth(35, 10);
  assert(p != null && approx(p, 0.69, 0.015), `35/10 got ${p}`);
  assert(formatPercentDisplay(p!) === '69', '35/10 display 69');
}
{
  const p = probabilityAtLeastOneLiveBirth(37, 20);
  assert(p != null && approx(p, 0.75, 0.02), `37/20 got ${p}`);
}
{
  const p = probabilityAtLeastOneLiveBirth(42, 20);
  assert(p != null && approx(p, 0.37, 0.02), `42/20 got ${p}`);
}
{
  const p = probabilityAtLeastOneLiveBirth(34, 20);
  assert(p != null && approx(p, 0.9, 0.02), `34/20 got ${p}`);
}

// Zero eggs
assert(probabilityAtLeastOneLiveBirth(35, 0) === 0, 'zero eggs');

// Survival switch
assert(pBlastocyst(35) > pBlastocyst(36), 'survival drop at 36');

// Validation example
{
  const v = validateEggFreezingInput(createExampleInput());
  assert(v.isValid && v.result != null, 'example valid');
  assert(v.result!.percentDisplay === '69', 'example 69%');
}

// Out of domain
{
  const v = validateEggFreezingInput({ ageYears: '50', matureEggs: '10' });
  assert(!v.isValid && v.result == null, 'age 50 suppressed');
  assert(Boolean(v.errors.ageYears), 'age error');
}

{
  const v = validateEggFreezingInput({ ageYears: '', matureEggs: '' });
  assert(v.result == null, 'blank inactive');
}

assert(pPerMatureOocyte(35) != null && pPerMatureOocyte(35)! > 0, 'p>0');

console.log('egg-freezing calculation.test.ts: ok');
