/**
 * Run: npx tsx --tsconfig tsconfig.json src/tools/calculators/protein/calculation.test.ts
 */
import {
  ACSM_SPORT_BANDS,
  PROTEIN_SHARE,
  PROTEIN_SHARE_PERCENTS,
  buildSportBand,
  calculateProtein,
  iomRdaGPerKg,
  proteinGramsFromKcalAndShare,
  weightToKg,
} from './calculation';
import { createDefaultInput } from './types';
import { validateProteinInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(PROTEIN_SHARE.min === 10 && PROTEIN_SHARE.max === 35, 'IOM AMDR 10–35');
assert(PROTEIN_SHARE_PERCENTS[0] === 10, 'table starts at 10%');
assert(PROTEIN_SHARE_PERCENTS[PROTEIN_SHARE_PERCENTS.length - 1] === 35, 'ends 35%');

// --- AMDR grams independent of weight (4 kcal/g) ---
assert(
  Math.abs(proteinGramsFromKcalAndShare(2000, 10) - 50) < 1e-9,
  '2000 kcal × 10% / 4 = 50 g',
);
assert(
  Math.abs(proteinGramsFromKcalAndShare(2000, 35) - 175) < 1e-9,
  '2000 kcal × 35% / 4 = 175 g',
);

{
  const r = calculateProtein({
    ...createDefaultInput(),
    caloriesText: '2000',
  });
  assert(r.amdrRows.length === PROTEIN_SHARE_PERCENTS.length, 'amdr rows');
  assert(r.tdeeSource === 'Calories field', 'kcal override');
  const row20 = r.amdrRows.find((x) => x.sharePercent === 20);
  assert(row20 != null && Math.abs(row20.proteinGramsPerDay - 100) < 1e-9, '20% → 100 g');
  assert(r.rdaGramsPerDay == null, 'no weight → no RDA grams');
}

// --- IOM RDA g/kg life-stage boundaries ---
assert(iomRdaGPerKg(1) === 1.05, '1–3 → 1.05');
assert(iomRdaGPerKg(3) === 1.05, 'age 3');
assert(iomRdaGPerKg(4) === 0.95, '4–8');
assert(iomRdaGPerKg(13) === 0.95, '9–13');
assert(iomRdaGPerKg(14) === 0.85, '14–18');
assert(iomRdaGPerKg(18) === 0.85, 'age 18');
assert(iomRdaGPerKg(19) === 0.8, 'adult 19');
assert(iomRdaGPerKg(100) === 0.8, 'adult 100');
assert(iomRdaGPerKg(0.5) === null, 'under 1 unsupported');
assert(iomRdaGPerKg(101) === null, 'over 100 unsupported');

{
  const r = calculateProtein({
    ...createDefaultInput(),
    weightText: '70',
    weightUnit: 'kg',
    ageYearsText: '30',
  });
  assert(r.rdaGPerKg === 0.8, 'adult RDA factor');
  assert(r.rdaGramsPerDay != null && Math.abs(r.rdaGramsPerDay - 56) < 1e-9, '70×0.8=56');
  assert(r.amdrRows.length === 0, 'no kcal → no AMDR');
}

{
  // Equivalent weight: 154.3235835 lb ≈ 70 kg
  const kg = weightToKg(154.3235835, 'lb');
  assert(Math.abs(kg - 70) < 1e-6, 'lb→kg');
  const r = calculateProtein({
    ...createDefaultInput(),
    weightText: '154.3235835',
    weightUnit: 'lb',
    ageYearsText: '30',
  });
  assert(r.rdaGramsPerDay != null && Math.abs(r.rdaGramsPerDay - 56) < 1e-4, 'lb equiv RDA');
}

{
  const teen = calculateProtein({
    ...createDefaultInput(),
    weightText: '60',
    ageYearsText: '16',
  });
  assert(teen.rdaGPerKg === 0.85, 'teen RDA');
  assert(teen.rdaGramsPerDay != null && Math.abs(teen.rdaGramsPerDay - 51) < 1e-9, '60×0.85');
}

// --- Sport ACSM bands ---
assert(ACSM_SPORT_BANDS.endurance.minGPerKg === 1.2, 'endurance min');
assert(ACSM_SPORT_BANDS.endurance.maxGPerKg === 1.4, 'endurance max');
assert(ACSM_SPORT_BANDS.strength.minGPerKg === 1.6, 'strength min');
assert(ACSM_SPORT_BANDS.strength.maxGPerKg === 1.7, 'strength max');
assert(ACSM_SPORT_BANDS.athletic.minGPerKg === 1.2, 'athletic min');
assert(ACSM_SPORT_BANDS.athletic.maxGPerKg === 2.0, 'athletic max');

{
  const band = buildSportBand(80, 'endurance');
  assert(Math.abs(band.minGramsPerDay - 96) < 1e-9, '80×1.2');
  assert(Math.abs(band.maxGramsPerDay - 112) < 1e-9, '80×1.4');
}

{
  const r = calculateProtein({
    ...createDefaultInput(),
    mode: 'sport',
    sportFocus: 'strength',
    weightText: '80',
    caloriesText: '2000',
  });
  assert(r.sportBand != null, 'sport band');
  assert(r.sportBand!.minGPerKg === 1.6 && r.sportBand!.maxGPerKg === 1.7, 'strength band');
  assert(Math.abs(r.sportBand!.minGramsPerDay - 128) < 1e-9, '80×1.6');
  assert(Math.abs(r.sportBand!.maxGramsPerDay - 136) < 1e-9, '80×1.7');
  assert(r.amdrRows.length === PROTEIN_SHARE_PERCENTS.length, 'AMDR still from kcal');
  assert(r.rdaGramsPerDay == null, 'sport mode hides general RDA');
}

{
  const r = calculateProtein({
    ...createDefaultInput(),
    mode: 'sport',
    sportFocus: 'athletic',
  });
  assert(r.sportBand == null, 'sport needs weight');
  assert(r.statusHeadline.includes('weight'), 'prompt for weight');
}

// --- Mifflin path (calories blank) ---
{
  const r = calculateProtein({
    ...createDefaultInput(),
    sex: 'female',
    ageYearsText: '30',
    heightText: '165',
    weightText: '60',
    activityId: 'light',
  });
  assert(r.totalKcalPerDay != null && r.amdrRows.length > 0, 'tdee path');
  assert(r.tdeeSource === 'Mifflin–St Jeor × PAL', 'tdee source');
  assert(r.rdaGramsPerDay != null && Math.abs(r.rdaGramsPerDay - 48) < 1e-9, '60×0.8');
}

{
  const r = calculateProtein(createDefaultInput());
  assert(r.amdrRows.length === 0 && r.rdaGramsPerDay == null, 'empty default');
}

{
  const v = validateProteinInput({
    ...createDefaultInput(),
    ageYearsText: '0',
  });
  assert(v.errors.ageYearsText != null, 'age boundary 0');
}

{
  const v = validateProteinInput({
    ...createDefaultInput(),
    ageYearsText: '101',
  });
  assert(v.errors.ageYearsText != null, 'age boundary 101');
}

{
  const v = validateProteinInput({
    ...createDefaultInput(),
    weightText: '-5',
  });
  assert(v.errors.weightText != null, 'negative weight');
}

{
  const v = validateProteinInput({
    ...createDefaultInput(),
    caloriesText: '0',
  });
  assert(v.errors.caloriesText != null, 'calories must be positive');
}

console.log('protein calculation.test.ts: ok');
