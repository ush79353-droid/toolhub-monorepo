/**
 * Run: npx tsx src/tools/calculators/mmoll-to-mgdl/calculation.test.ts
 */
import {
  calculateMmollToMgdl,
  conversionFactor,
  mgDlToMmolL,
  mmolLToMgDl,
} from './calculation';
import { EMPTY_MMOLL_TO_MGDL_INPUT, type MmollToMgdlInput } from './types';
import { validateMmollToMgdl } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function nearlyEqual(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

{
  assert(conversionFactor(180.156) === 18.0156, 'glucose factor MW/10');
  assert(nearlyEqual(mmolLToMgDl(5, 180.156), 90.078), 'glucose 5 mmol/L → 90.078 mg/dL');
  assert(nearlyEqual(mgDlToMmolL(90.078, 180.156), 5), 'glucose inverse 90.078 → 5');
}

{
  const input: MmollToMgdlInput = {
    ...EMPTY_MMOLL_TO_MGDL_INPUT,
    analyte: 'glucose',
    preset: { source: 'mmolL', mmolL: 5, mgDl: null },
  };
  const result = calculateMmollToMgdl(input);
  assert(result?.preset != null, 'preset conversion present');
  assert(nearlyEqual(result!.preset!.mgDl, 90.078), 'fixture mg/dL');
  assert(nearlyEqual(result!.preset!.mmolL, 5), 'fixture mmol/L');
  assert(result!.custom === null, 'custom blank stays null');
}

{
  const input: MmollToMgdlInput = {
    ...EMPTY_MMOLL_TO_MGDL_INPUT,
    analyte: 'glucose',
    preset: { source: 'mgDl', mmolL: null, mgDl: 90.078 },
  };
  const result = calculateMmollToMgdl(input);
  assert(result?.preset != null, 'inverse preset present');
  assert(nearlyEqual(result!.preset!.mmolL, 5), 'inverse mmol/L');
}

{
  // Independence: custom conversion must not require / alter preset values.
  const input: MmollToMgdlInput = {
    ...EMPTY_MMOLL_TO_MGDL_INPUT,
    analyte: 'glucose',
    preset: { source: 'mmolL', mmolL: 5, mgDl: null },
    customOpen: true,
    customMolarMass: 100,
    custom: { source: 'mmolL', mmolL: 2, mgDl: null },
  };
  const result = calculateMmollToMgdl(input);
  assert(result?.preset != null && nearlyEqual(result.preset.mgDl, 90.078), 'preset intact');
  assert(result?.custom != null && nearlyEqual(result.custom.mgDl, 20), 'custom 2×100/10=20');
  assert(result!.preset!.mmolL === 5, 'preset mmol unchanged by custom');
  assert(result!.custom!.mmolL === 2, 'custom mmol independent');
}

{
  const input: MmollToMgdlInput = {
    ...EMPTY_MMOLL_TO_MGDL_INPUT,
    customOpen: true,
    customMolarMass: 0,
    custom: { source: 'mmolL', mmolL: 1, mgDl: null },
  };
  const validation = validateMmollToMgdl(input);
  assert(!validation.isValid, 'zero MW invalid');
  assert(validation.errors.customMolarMass != null, 'zero MW error');
  assert(validation.result === null, 'no result for zero MW');
}

{
  const input: MmollToMgdlInput = {
    ...EMPTY_MMOLL_TO_MGDL_INPUT,
    customOpen: true,
    customMolarMass: -10,
    custom: { source: 'mmolL', mmolL: 1, mgDl: null },
  };
  const validation = validateMmollToMgdl(input);
  assert(!validation.isValid, 'negative MW invalid');
  assert(validation.errors.customMolarMass != null, 'negative MW error');
}

{
  const input: MmollToMgdlInput = {
    ...EMPTY_MMOLL_TO_MGDL_INPUT,
    preset: { source: 'mmolL', mmolL: -1, mgDl: null },
  };
  const validation = validateMmollToMgdl(input);
  assert(!validation.isValid, 'negative concentration invalid');
  assert(validation.errors.presetMmolL != null, 'negative mmol error');
}

{
  const blank = calculateMmollToMgdl(EMPTY_MMOLL_TO_MGDL_INPUT);
  assert(blank === null, 'blank input → null');
  const ok = validateMmollToMgdl(EMPTY_MMOLL_TO_MGDL_INPUT);
  assert(ok.isValid, 'blank still valid (incomplete, not erroneous)');
  assert(ok.result === null, 'blank result null');
}

{
  // Cholesterol clinical factor sanity: 5.2 × 38.665 ≈ 201.058
  const input: MmollToMgdlInput = {
    ...EMPTY_MMOLL_TO_MGDL_INPUT,
    analyte: 'cholesterol',
    preset: { source: 'mmolL', mmolL: 5.2, mgDl: null },
  };
  const result = calculateMmollToMgdl(input);
  assert(result?.preset != null, 'cholesterol present');
  assert(nearlyEqual(result!.preset!.mgDl, 5.2 * 38.665), 'cholesterol 5.2 mmol/L');
}

console.log('mmoll-to-mgdl calculation.test.ts: ok');
