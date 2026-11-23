/**
 * VBAC (Grobman 2021 race-neutral) — assert-based engine check.
 * Run: npx tsx src/tools/calculators/vbac/calculation.test.ts
 */
import {
  TABLE3_FIXTURES,
  calculateVbac,
  computeLogOdds,
  historyToIndicators,
  logOddsToProbabilityPercent,
} from './calculation';
import { createEmptyInput, createExampleInput } from './types';
import { validateVbacInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function assertClose(actual: number, expected: number, tol = 0.6): void {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tol) {
    throw new Error(`expected ~${expected}, got ${actual}`);
  }
}

// Published Table 3 scenarios
for (const row of TABLE3_FIXTURES) {
  const w = computeLogOdds(
    row.age,
    row.weightKg,
    row.heightCm,
    row.arrest,
    row.history,
    row.htn
  );
  const pct = logOddsToProbabilityPercent(w);
  assertClose(pct, row.expectedPercent);
}

// Coefficient sign spot-check
{
  const wNone = computeLogOdds(30, 71, 156, false, 'none', false);
  const wVbac = computeLogOdds(30, 71, 156, false, 'priorVbac', false);
  assert(wVbac > wNone, 'prior VBAC raises log-odds');
}

// Obstetric history mutual encoding
{
  const a = historyToIndicators('vaginalBeforePriorCesarean');
  const b = historyToIndicators('priorVbac');
  const c = historyToIndicators('none');
  assert(a.vaginalBeforePriorCesarean === 1 && a.priorVbac === 0, 'before CS');
  assert(b.priorVbac === 1 && b.vaginalBeforePriorCesarean === 0, 'prior VBAC');
  assert(c.vaginalBeforePriorCesarean === 0 && c.priorVbac === 0, 'none');
}

// Example 7 via validate
{
  const v = validateVbacInput(createExampleInput());
  assert(v.isValid && v.result != null, 'example valid');
  assertClose(v.result!.probabilityPercent, 59.4);
}

// Incomplete → no result
{
  const v = validateVbacInput(createEmptyInput());
  assert(!v.isValid && v.result == null, 'blank inactive');
}

// Prior vaginal before CS only (Table 3 #3)
{
  const v = validateVbacInput({
    ...createExampleInput(),
    priorVaginalHistory: 'vaginalBeforePriorCesarean',
  });
  assert(v.isValid && v.result != null, 'vaginal before CS valid');
  assertClose(v.result!.probabilityPercent, 77.7);
}

// Engine direct
{
  const r = calculateVbac(
    { ageYears: 30, weightKg: 71, heightCm: 171 },
    {
      arrestIndicationForPriorCesarean: false,
      priorVaginalHistory: 'priorVbac',
      treatedChronicHypertension: false,
    }
  );
  assertClose(r.probabilityPercent, 95.6);
}

console.log('vbac calculation ok');