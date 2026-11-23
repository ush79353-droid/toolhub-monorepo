/**
 * Pearl Index — assert-based engine check.
 * Run: npx tsx src/tools/calculators/pearl-index/calculation.test.ts
 */
import {
  pearlIndexEqualFollowUp,
  calculatePearlIndex,
  durationToMonths,
} from './calculation';
import { createDefaultInput } from './types';
import { validatePearlIndexInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Prompt: 100 × 12 months, 2 pregnancies → Pearl 2
{
  const r = pearlIndexEqualFollowUp(100, 12, 2);
  assert(r.womanYears === 100, `wy ${r.womanYears}`);
  assert(r.pearlIndex === 2, `pi ${r.pearlIndex}`);
}

// Zero events → 0
{
  const r = pearlIndexEqualFollowUp(100, 12, 0);
  assert(r.pearlIndex === 0, 'zero events');
}

// Zero exposure invalid
{
  let threw = false;
  try {
    pearlIndexEqualFollowUp(100, 0, 1);
  } catch {
    threw = true;
  }
  assert(threw, 'zero duration throws');
}

assert(durationToMonths(1, 'years') === 12, '1y→12mo');
assert(durationToMonths(6, 'months') === 6, '6mo');

{
  const v = validatePearlIndexInput(createDefaultInput());
  assert(v.result != null && v.result.pearlIndex == null, 'blank');
}

{
  const r = calculatePearlIndex({
    womenText: '100',
    durationText: '1',
    durationUnit: 'years',
    pregnanciesText: '2',
  });
  assert(r.pearlIndex === 2, '1 year path');
}

console.log('pearl-index calculation.test.ts: ok');
