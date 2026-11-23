/**
 * Focused self-check for Sperm Analysis educational arithmetic.
 * Run: npx tsx src/tools/calculators/sperm-analysis/calculation.test.ts
 */

import {
  computeSpermCounts,
  concentrationToMlnPerMl,
  volumeToMl,
  calculateSpermAnalysis,
} from './calculation';
import { validateSpermAnalysisInput } from './validation';
import { createDefaultInput } from './types';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-9) {
  assert(Math.abs(a - b) <= eps, `expected ${b}, got ${a}`);
}

// Prompt fixture: 3 mL × 20 million/mL = 60 million
{
  const { totalSpermMillion, functionalSpermMillion } = computeSpermCounts(
    3,
    20,
    null,
    null,
    null,
  );
  approx(totalSpermMillion, 60);
  assert(functionalSpermMillion === null, 'functional needs percentages');
}

// Product functional estimate (Omni-style independence assumption)
{
  const { totalSpermMillion, functionalSpermMillion } = computeSpermCounts(
    3,
    50,
    60,
    70,
    4,
  );
  approx(totalSpermMillion, 150);
  assert(functionalSpermMillion !== null, 'functional expected');
  approx(functionalSpermMillion!, 2.52);
}

// µL volume + mln/µL concentration normalize
{
  approx(volumeToMl(3000, 'uL'), 3);
  approx(concentrationToMlnPerMl(0.02, 'mln_per_uL'), 20);
  const r = calculateSpermAnalysis({
    ...createDefaultInput(),
    volumeText: '3000',
    volumeUnit: 'uL',
    concentrationText: '0.02',
    concentrationUnit: 'mln_per_uL',
  });
  approx(r.totalSpermMillion!, 60);
}

// Percent bounds
{
  const bad = validateSpermAnalysisInput({
    ...createDefaultInput(),
    volumeText: '3',
    concentrationText: '20',
    morphologyText: '101',
  });
  assert(Boolean(bad.errors.morphologyText), 'morphology >100 rejected');
}

// Missing optional percentages → total only
{
  const v = validateSpermAnalysisInput({
    ...createDefaultInput(),
    volumeText: '3',
    concentrationText: '20',
    motilityText: '50',
  });
  assert(v.result !== null, 'result expected');
  approx(v.result!.totalSpermMillion!, 60);
  assert(v.result!.functionalSpermMillion === null, 'partial % → no functional');
}

console.log('sperm-analysis calculation.test.ts: ok');
