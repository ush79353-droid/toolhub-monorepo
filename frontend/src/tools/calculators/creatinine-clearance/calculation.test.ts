/**
 * Run: npx tsx calculation.test.ts
 */
import {
  cockcroftGaultCrClMlMin,
  calculateCreatinineClearance,
  directCrClMlMin,
  idealBodyWeightKg,
  selectCockcroftWeightKg,
} from './calculation';
import { createDefaultInput } from './types';
import { validateCreatinineClearanceInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 0.05): boolean {
  return Math.abs(a - b) <= eps;
}

{
  const r = calculateCreatinineClearance(createDefaultInput());
  assert(r.estimatedCrClMlMin === null, 'blank estimate null');
  assert(r.directCrClMlMin === null, 'blank direct null with default time alone');
}

{
  // Direct fixture from prompt: UCr=100, SCr=1, 1440 mL in 24h → 100
  const d = directCrClMlMin(100, 1440, 1, 1440);
  assert(d === 100, `direct fixture expected 100 got ${d}`);
}

{
  const r = calculateCreatinineClearance({
    ...createDefaultInput(),
    urineCreatinineText: '100',
    urineVolumeMlText: '1440',
    directSerumCreatinineText: '1',
    collectionTimeText: '24',
    collectionTimeUnit: 'hours',
  });
  assert(r.directCrClMlMin === 100, 'direct panel fixture 100');
  assert(r.formattedDirectCrCl === '100', 'formatted direct 100');
  assert(r.estimatedCrClMlMin === null, 'modes independent — estimate blank');
}

{
  // Omni Bob example: male 67y, 92 kg, 173 cm, SCr 1.4 → ~56.6
  const ibw = idealBodyWeightKg(173, 'male');
  assert(approx(ibw, 68.9), `IBW ~68.9 got ${ibw}`);
  const sel = selectCockcroftWeightKg(92, 173, 'male');
  assert(sel.basis === 'adjusted', 'BMI≥25 adjusted');
  assert(approx(sel.weightKg, 78.14, 0.05), `ABW ~78.14 got ${sel.weightKg}`);
  const crcl = cockcroftGaultCrClMlMin(67, sel.weightKg, 'male', 1.4);
  assert(approx(crcl, 56.6, 0.15), `Omni Bob ~56.6 got ${crcl}`);

  const r = calculateCreatinineClearance({
    ...createDefaultInput(),
    ageYearsText: '67',
    sex: 'male',
    weightText: '92',
    heightText: '173',
    serumCreatinineText: '1.4',
  });
  assert(r.estimatedCrClMlMin != null, 'estimate present');
  assert(
    approx(r.estimatedCrClMlMin!, 56.6, 0.15),
    `panel Bob ~56.6 got ${r.estimatedCrClMlMin}`,
  );
  assert(r.weightBasis === 'adjusted', 'panel adjusted basis');
}

{
  // Female multiplier: age 40, IBW path (BMI normal), SCr 1
  // height 165 cm → IBW = 45.5 + 0.9*(165-152) = 57.2
  // weight 58 kg → BMI = 58/(1.65^2) ≈ 21.3 → ideal
  const r = calculateCreatinineClearance({
    ...createDefaultInput(),
    ageYearsText: '40',
    sex: 'female',
    weightText: '58',
    heightText: '165',
    serumCreatinineText: '1',
  });
  assert(r.weightBasis === 'ideal', 'normal BMI uses IBW');
  const expected = ((140 - 40) * 57.2 * 0.85) / (72 * 1);
  assert(
    approx(r.estimatedCrClMlMin!, expected, 0.05),
    `female CG got ${r.estimatedCrClMlMin} expected ${expected}`,
  );
}

{
  // Underweight uses actual weight
  const sel = selectCockcroftWeightKg(45, 170, 'female');
  assert(sel.basis === 'actual', 'BMI<18.5 actual');
  assert(sel.weightKg === 45, 'uses TBW');
}

{
  const v = validateCreatinineClearanceInput({
    ...createDefaultInput(),
    ageYearsText: '10',
  });
  assert(v.errors.ageYearsText, 'pediatric age rejected');
  assert(v.result === null, 'no result on error');
}

{
  const v = validateCreatinineClearanceInput({
    ...createDefaultInput(),
    serumCreatinineText: '0',
  });
  assert(v.errors.serumCreatinineText, 'zero SCr rejected');
}

console.log('creatinine-clearance calculation.test.ts: ok');
