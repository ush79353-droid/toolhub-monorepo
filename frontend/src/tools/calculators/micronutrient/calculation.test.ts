/**
 * Micronutrient Calculator — engine tests (run: npx tsx calculation.test.ts).
 */

import {
  ageToYears,
  calculateMicronutrient,
  formatAmount,
  parseNumber,
} from './calculation';
import {
  ELEMENT_SPECS,
  recommendationKindFor,
  resolveLifeStage,
} from './micronutrient-data';
import { createDefaultInput, ELEMENT_OPTIONS, type MicronutrientInput } from './types';
import { validateMicronutrientInput } from './validation';

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

// --- Life-stage boundaries (calcium transitions) ---
assert(resolveLifeStage(0)?.id === 'mo0_6', '0 y → 0–6 mo');
assert(resolveLifeStage(0.49)?.id === 'mo0_6', '0.49 y → 0–6 mo');
assert(resolveLifeStage(0.5)?.id === 'mo0_6', '6 mo (0.5 y) → 0–6 mo');
assert(resolveLifeStage(7 / 12)?.id === 'mo7_12', '7 mo → 7–12 mo');
assert(resolveLifeStage(1)?.id === 'y1_3', '1 y → 1–3');
assert(resolveLifeStage(3.9)?.id === 'y1_3', '3.9 y → 1–3');
assert(resolveLifeStage(4)?.id === 'y4_8', '4 y → 4–8');
assert(resolveLifeStage(8.9)?.id === 'y4_8', '8.9 → 4–8');
assert(resolveLifeStage(9)?.id === 'y9_13', '9 → 9–13');
assert(resolveLifeStage(14)?.id === 'y14_18', '14 → 14–18');
assert(resolveLifeStage(19)?.id === 'y19_30', '19 → 19–30');
assert(resolveLifeStage(30.9)?.id === 'y19_30', '30.9 → 19–30');
assert(resolveLifeStage(31)?.id === 'y31_50', '31 → 31–50');
assert(resolveLifeStage(51)?.id === 'y51_70', '51 → 51–70');
assert(resolveLifeStage(71)?.id === 'y71plus', '71 → >70');

// --- Element list completeness (Omni-aligned 15 minerals) ---
assert(ELEMENT_OPTIONS.length === 15, '15 element options');
assert(ELEMENT_SPECS.length === 15, '15 element specs');
for (const opt of ELEMENT_OPTIONS) {
  assert(
    ELEMENT_SPECS.some((s) => s.id === opt.id),
    `spec exists for ${opt.id}`,
  );
}

// --- Blank age: no recommendation ---
{
  const r = calculateMicronutrient(createDefaultInput());
  assert(r.recommendationAmount === null, 'blank age → no RDA');
  assert(r.statusHeadline === 'Enter age', 'blank status');
}

// --- Calcium age transitions (male) — NIH ODS Table 1 + UL Table 3 ---
function calciumMale(ageYears: number): MicronutrientInput {
  return {
    ageText: String(ageYears),
    ageUnit: 'years',
    sex: 'male',
    elementId: 'calcium',
  };
}

{
  const r = calculateMicronutrient(calciumMale(0.25));
  assert(r.recommendationAmount === 200, 'Ca male 3 mo AI 200');
  assert(r.recommendationKind === 'ai', 'Ca infant AI not RDA');
  assert(r.ulAmount === 1000, 'Ca UL 0–6 mo 1000');
}
{
  const r = calculateMicronutrient({
    ...calciumMale(0),
    ageText: '9',
    ageUnit: 'months',
  });
  assert(approx(ageToYears(9, 'months'), 0.75), '9 mo years');
  assert(r.recommendationAmount === 260, 'Ca male 9 mo AI 260');
  assert(r.recommendationKind === 'ai', 'Ca 7–12 mo AI');
  assert(r.ulAmount === 1500, 'Ca UL 7–12 mo 1500');
}
{
  const r = calculateMicronutrient(calciumMale(2));
  assert(r.recommendationAmount === 700, 'Ca 1–3 RDA 700');
  assert(r.recommendationKind === 'rda', 'Ca 1–3 RDA');
  assert(r.ulAmount === 2500, 'Ca UL 1–3 2500');
}
{
  const r = calculateMicronutrient(calciumMale(6));
  assert(r.recommendationAmount === 1000, 'Ca 4–8 1000');
  assert(r.ulAmount === 2500, 'Ca UL 4–8 2500');
}
{
  const r = calculateMicronutrient(calciumMale(12));
  assert(r.recommendationAmount === 1300, 'Ca 9–13 1300');
  assert(r.ulAmount === 3000, 'Ca UL 9–13 3000');
}
{
  const r = calculateMicronutrient(calciumMale(16));
  assert(r.recommendationAmount === 1300, 'Ca 14–18 1300');
  assert(r.ulAmount === 3000, 'Ca UL 14–18 3000');
}
{
  const r = calculateMicronutrient(calciumMale(25));
  assert(r.recommendationAmount === 1000, 'Ca male 19–30 1000');
  assert(r.recommendationKind === 'rda', 'Ca adult RDA');
  assert(r.ulAmount === 2500, 'Ca UL 19–50 2500');
  assert(r.populationLabel === 'males 19–30 y', 'population label');
}
{
  const r = calculateMicronutrient(calciumMale(40));
  assert(r.recommendationAmount === 1000, 'Ca male 31–50 1000');
  assert(r.ulAmount === 2500, 'Ca UL 31–50 2500');
}
{
  const r = calculateMicronutrient(calciumMale(60));
  assert(r.recommendationAmount === 1000, 'Ca male 51–70 1000');
  assert(r.ulAmount === 2000, 'Ca UL ≥51 2000');
}
{
  const r = calculateMicronutrient(calciumMale(75));
  assert(r.recommendationAmount === 1200, 'Ca male >70 1200');
  assert(r.ulAmount === 2000, 'Ca UL >70 2000');
}

// --- Calcium female 51–70 differs from male (RDA 1200 vs 1000) ---
{
  const r = calculateMicronutrient({
    ageText: '60',
    ageUnit: 'years',
    sex: 'female',
    elementId: 'calcium',
  });
  assert(r.recommendationAmount === 1200, 'Ca female 51–70 1200');
  assert(r.ulAmount === 2000, 'Ca female UL 2000');
}

// --- RDA vs AI: chromium is AI; copper adult is RDA ---
{
  const r = calculateMicronutrient({
    ageText: '30',
    ageUnit: 'years',
    sex: 'male',
    elementId: 'chromium',
  });
  assert(r.recommendationKind === 'ai', 'chromium AI');
  assert(r.recommendationAmount === 35, 'chromium male 35 mcg');
  assert(r.ulAmount === null, 'chromium no UL');
  assert(r.ulDisplay.toLowerCase().includes('not established'), 'chromium UL text');
}
{
  const r = calculateMicronutrient({
    ageText: '30',
    ageUnit: 'years',
    sex: 'female',
    elementId: 'copper',
  });
  assert(r.recommendationKind === 'rda', 'copper RDA');
  assert(r.recommendationAmount === 900, 'copper 900 mcg');
  assert(r.ulAmount === 10000, 'copper UL 10000');
}

// --- Magnesium: RDA sex split + supplemental UL distinction ---
{
  const m = calculateMicronutrient({
    ageText: '25',
    ageUnit: 'years',
    sex: 'male',
    elementId: 'magnesium',
  });
  const f = calculateMicronutrient({
    ageText: '25',
    ageUnit: 'years',
    sex: 'female',
    elementId: 'magnesium',
  });
  assert(m.recommendationAmount === 400, 'Mg male 19–30 400');
  assert(f.recommendationAmount === 310, 'Mg female 19–30 310');
  assert(m.ulAmount === 350, 'Mg supplement UL 350');
  assert(m.ulNote != null && m.ulNote.toLowerCase().includes('supplement'), 'Mg UL note');
}
{
  const m = calculateMicronutrient({
    ageText: '40',
    ageUnit: 'years',
    sex: 'male',
    elementId: 'magnesium',
  });
  assert(m.recommendationAmount === 420, 'Mg male 31–50 420');
}

// --- Sodium CDRR vs classic UL ---
{
  const r = calculateMicronutrient({
    ageText: '30',
    ageUnit: 'years',
    sex: 'male',
    elementId: 'sodium',
  });
  assert(r.recommendationKind === 'cdrr', 'sodium CDRR');
  assert(r.recommendationAmount === 2300, 'sodium CDRR 2300');
  assert(r.ulAmount === null, 'sodium no classic UL');
}
assert(recommendationKindFor(ELEMENT_SPECS.find((s) => s.id === 'sodium')!, 'y9_13') === 'ai', 'sodium child AI');

// --- Iron female reproductive vs postmenopausal ---
{
  const young = calculateMicronutrient({
    ageText: '30',
    ageUnit: 'years',
    sex: 'female',
    elementId: 'iron',
  });
  const older = calculateMicronutrient({
    ageText: '55',
    ageUnit: 'years',
    sex: 'female',
    elementId: 'iron',
  });
  assert(young.recommendationAmount === 18, 'iron female 19–50 18');
  assert(older.recommendationAmount === 8, 'iron female 51+ 8');
  assert(young.ulAmount === 45, 'iron UL 45');
}

// --- Validation blocks bad age ---
{
  const v = validateMicronutrientInput({
    ...createDefaultInput(),
    ageText: 'abc',
  });
  assert(v.errors.ageText != null, 'invalid age error');
  assert(v.result === null, 'invalid → null result');
}
{
  const v = validateMicronutrientInput({
    ...createDefaultInput(),
    ageText: '30',
  });
  assert(v.errors.ageText == null, 'valid age');
  assert(v.result?.recommendationAmount === 1000, 'valid Ca male 1000');
}

assert(formatAmount(1000) === '1,000', 'format 1000');
assert(formatAmount(0.27) === '0.27', 'format 0.27');

console.log('micronutrient calculation.test.ts: ok');
