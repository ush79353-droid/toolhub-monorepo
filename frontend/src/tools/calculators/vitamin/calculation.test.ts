/**
 * Vitamin Calculator — engine tests (run: npx tsx calculation.test.ts).
 */

import {
  ageToYears,
  calculateVitamin,
  formatAmount,
  getVitaminNutrient,
  parseNumber,
  resolveDriAgeBand,
} from './calculation';
import { DRI_NUTRIENTS } from '../dri/dri-data';
import { VITAMIN_UL_SPECS } from './vitamin-ul-data';
import {
  createDefaultInput,
  VITAMIN_OPTIONS,
  type VitaminInput,
} from './types';
import { validateVitaminInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(`FAIL: ${msg}`);
}

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

// --- Parse / age units ---
assert(parseNumber('') === null, 'blank parse');
assert(parseNumber('25') === 25, 'parse 25');
assert(parseNumber('1,000') === 1000, 'parse comma');
assert(approx(ageToYears(24, 'months'), 2), '24 mo → 2 y');
assert(approx(ageToYears(6, 'months'), 0.5), '6 mo → 0.5 y');

// --- DriAgeBand boundaries (shared dri-data bands) ---
assert(resolveDriAgeBand(0)?.id === 'birth_6mo', '0 y → birth–6 mo');
assert(resolveDriAgeBand(0.49)?.id === 'birth_6mo', '0.49 → birth–6 mo');
assert(resolveDriAgeBand(0.5)?.id === 'birth_6mo', '6 mo (0.5 y) → 0–6 mo');
assert(resolveDriAgeBand(7 / 12)?.id === 'mo7_12', '7 mo → 7–12 mo');
assert(resolveDriAgeBand(1)?.id === 'y1_3', '1 → 1–3');
assert(resolveDriAgeBand(3.9)?.id === 'y1_3', '3.9 → 1–3');
assert(resolveDriAgeBand(4)?.id === 'y4_8', '4 → 4–8');
assert(resolveDriAgeBand(8.9)?.id === 'y4_8', '8.9 → 4–8');
assert(resolveDriAgeBand(9)?.id === 'y9_13', '9 → 9–13');
assert(resolveDriAgeBand(14)?.id === 'y14_18', '14 → 14–18');
assert(resolveDriAgeBand(19)?.id === 'y19_50', '19 → 19–50');
assert(resolveDriAgeBand(50.9)?.id === 'y19_50', '50.9 → 19–50');
assert(resolveDriAgeBand(51)?.id === 'y51_70', '51 → 51–70');
assert(resolveDriAgeBand(71)?.id === 'y71plus', '71 → >70');

// --- Vitamin list from DRI_NUTRIENTS (no invented rows) ---
assert(VITAMIN_OPTIONS.length === 14, '14 vitamin options');
assert(VITAMIN_OPTIONS[0]?.id === 'vit_a', 'dropdown starts with A');
assert(VITAMIN_UL_SPECS.length === 14, '14 UL specs');
for (const opt of VITAMIN_OPTIONS) {
  const dri = DRI_NUTRIENTS.find((n) => n.id === opt.id);
  assert(dri != null, `DRI_NUTRIENTS has ${opt.id}`);
  assert(getVitaminNutrient(opt.id) != null, `getVitaminNutrient ${opt.id}`);
  assert(
    VITAMIN_UL_SPECS.some((s) => s.id === opt.id),
    `UL spec for ${opt.id}`,
  );
}
assert(getVitaminNutrient('calcium' as never) === undefined, 'reject minerals');

// --- Blank age: no recommendation ---
{
  const r = calculateVitamin(createDefaultInput());
  assert(r.recommendationAmount === null, 'blank age → no RDA');
  assert(r.statusHeadline === 'Enter age', 'blank status');
}

function vitAMale(ageYears: number): VitaminInput {
  return {
    ageText: String(ageYears),
    ageUnit: 'years',
    sex: 'male',
    vitaminId: 'vit_a',
  };
}

// --- Vitamin A age boundaries (RDA from dri-data) + UL ---
{
  const r = calculateVitamin(vitAMale(0.25));
  assert(r.recommendationAmount === 400, 'A male 3 mo 400');
  assert(r.recommendationKind === 'rda', 'A infant RDA in dri-data');
  assert(r.ulAmount === 600, 'A UL 0–6 mo 600');
}
{
  const r = calculateVitamin({
    ...vitAMale(0),
    ageText: '9',
    ageUnit: 'months',
  });
  assert(approx(ageToYears(9, 'months'), 0.75), '9 mo years');
  assert(r.recommendationAmount === 500, 'A male 9 mo 500');
  assert(r.ulAmount === 600, 'A UL 7–12 mo 600');
}
{
  const r = calculateVitamin(vitAMale(2));
  assert(r.recommendationAmount === 300, 'A 1–3 300');
  assert(r.ulAmount === 600, 'A UL 1–3 600');
}
{
  const r = calculateVitamin(vitAMale(6));
  assert(r.recommendationAmount === 400, 'A 4–8 400');
  assert(r.ulAmount === 900, 'A UL 4–8 900');
}
{
  const r = calculateVitamin(vitAMale(12));
  assert(r.recommendationAmount === 600, 'A 9–13 600');
  assert(r.ulAmount === 1700, 'A UL 9–13 1700');
}
{
  const r = calculateVitamin(vitAMale(16));
  assert(r.recommendationAmount === 900, 'A male 14–18 900');
  assert(r.ulAmount === 2800, 'A UL 14–18 2800');
}
{
  const r = calculateVitamin(vitAMale(25));
  assert(r.recommendationAmount === 900, 'A male 19–50 900');
  assert(r.recommendationKind === 'rda', 'A adult RDA');
  assert(r.ulAmount === 3000, 'A UL adult 3000');
  assert(r.populationLabel === 'males 19–50 y', 'population label');
  assert(r.ulNote != null && /preformed/i.test(r.ulNote), 'preformed A note');
}
{
  const r = calculateVitamin(vitAMale(60));
  assert(r.recommendationAmount === 900, 'A male 51–70 900');
  assert(r.ulAmount === 3000, 'A UL 51–70 3000');
}
{
  const r = calculateVitamin(vitAMale(75));
  assert(r.recommendationAmount === 900, 'A male >70 900');
}

// --- Sex difference: Vit A female 19–50 is 700 vs male 900 ---
{
  const r = calculateVitamin({
    ageText: '30',
    ageUnit: 'years',
    sex: 'female',
    vitaminId: 'vit_a',
  });
  assert(r.recommendationAmount === 700, 'A female 19–50 700');
  assert(r.ulAmount === 3000, 'A female UL 3000');
}

// --- RDA vs AI: Vitamin K is AI; Vitamin C adult is RDA ---
{
  const k = calculateVitamin({
    ageText: '30',
    ageUnit: 'years',
    sex: 'male',
    vitaminId: 'vit_k',
  });
  assert(k.recommendationKind === 'ai', 'K is AI');
  assert(k.recommendationAmount === 120, 'K male AI 120');
  assert(k.ulAmount === null, 'K no UL');
  assert(/not established/i.test(k.ulDisplay), 'K UL not established');
}
{
  const c = calculateVitamin({
    ageText: '30',
    ageUnit: 'years',
    sex: 'male',
    vitaminId: 'vit_c',
  });
  assert(c.recommendationKind === 'rda', 'C is RDA');
  assert(c.recommendationAmount === 90, 'C male RDA 90');
  assert(c.ulAmount === 2000, 'C UL 2000');
}
{
  // Infant C: RDA exists; UL is ND
  const cInf = calculateVitamin({
    ageText: '3',
    ageUnit: 'months',
    sex: 'male',
    vitaminId: 'vit_c',
  });
  assert(cInf.recommendationAmount === 40, 'C infant 40');
  assert(cInf.ulAmount === null, 'C infant UL null');
  assert(/not determinable/i.test(cInf.ulDisplay), 'C infant ND');
}

// --- Vitamin D 2011 UL (not legacy 50 mcg for ages 1+) ---
{
  const d = calculateVitamin({
    ageText: '30',
    ageUnit: 'years',
    sex: 'female',
    vitaminId: 'vit_d',
  });
  assert(d.recommendationAmount === 15, 'D RDA 15');
  assert(d.ulAmount === 100, 'D UL adult 100 (2011)');
}
{
  const d = calculateVitamin({
    ageText: '2',
    ageUnit: 'years',
    sex: 'male',
    vitaminId: 'vit_d',
  });
  assert(d.recommendationAmount === 15, 'D 1–3 RDA 15');
  assert(d.ulAmount === 63, 'D UL 1–3 63');
}

// --- Biotin AI vs B6 RDA ---
{
  const b7 = calculateVitamin({
    ageText: '40',
    ageUnit: 'years',
    sex: 'female',
    vitaminId: 'biotin',
  });
  assert(b7.recommendationKind === 'ai', 'biotin AI');
  assert(b7.recommendationAmount === 30, 'biotin AI 30');
  assert(b7.ulAmount === null, 'biotin no UL');
}
{
  const b6 = calculateVitamin({
    ageText: '60',
    ageUnit: 'years',
    sex: 'male',
    vitaminId: 'vit_b6',
  });
  assert(b6.recommendationKind === 'rda', 'B6 RDA');
  assert(b6.recommendationAmount === 1.7, 'B6 male 51–70 1.7');
  assert(b6.ulAmount === 100, 'B6 UL 100');
}

// --- formatAmount ---
assert(formatAmount(900) === '900', 'format int');
assert(formatAmount(1.7) === '1.7', 'format 1.7');

// --- Validation ---
{
  const blank = validateVitaminInput(createDefaultInput());
  assert(blank.errors.ageText === undefined, 'blank age ok');
  assert(blank.result?.recommendationAmount === null, 'blank no rec');
}
{
  const bad = validateVitaminInput({
    ...createDefaultInput(),
    ageText: 'abc',
  });
  assert(bad.errors.ageText != null, 'invalid age error');
  assert(bad.result === null, 'no result on error');
}
{
  const ok = validateVitaminInput(vitAMale(25));
  assert(ok.result?.recommendationAmount === 900, 'valid A male 25');
}

console.log('vitamin calculation.test.ts: ok');
