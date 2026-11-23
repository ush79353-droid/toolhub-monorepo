/**
 * Cardiac Index — assert-based engine check (no test framework).
 * Run: npx tsx src/tools/calculators/cardiac-index/calculation.test.ts
 */
import {
  cardiacIndexFromCo,
  contentToUnit,
  estimatedVo2MlPerMin,
  fickCardiacOutputLPerMin,
  mostellerBsaM2,
  oxygenContentMlPerDl,
  calculateCardiacIndex,
} from './calculation';
import { createDefaultInput } from './types';
import { validateCardiacIndexInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Prompt fixture: CO 5, BSA 2 → CI 2.5 (no BSA rounding in division)
{
  const bsa = 2;
  const ci = cardiacIndexFromCo(5, bsa);
  assert(ci === 2.5, `CI 5/2 expected 2.5 got ${ci}`);
}

// Mosteller: 180 cm, 80 kg → √(180*80/3600) = √4 = 2
{
  const bsa = mostellerBsaM2(180, 80);
  assert(Math.abs(bsa - 2) < 1e-12, `Mosteller 180/80 → 2 got ${bsa}`);
  const ci = cardiacIndexFromCo(5, bsa);
  assert(ci === 2.5, 'CI with exact Mosteller 2');
}

// Unrounded BSA path: 170 cm, 70 kg
{
  const bsa = mostellerBsaM2(170, 70);
  const expected = Math.sqrt((170 * 70) / 3600);
  assert(bsa === expected, 'BSA identity');
  const ci = cardiacIndexFromCo(5, bsa);
  assert(ci === 5 / expected, 'CI uses unrounded BSA');
}

// Fick: VO₂ 250, Δ content 50 mL/L → CO 5
{
  const co = fickCardiacOutputLPerMin(250, 200, 150);
  assert(co === 5, `Fick CO expected 5 got ${co}`);
}

// Content: Hb 15, Sat 100%, PO₂ 100 Torr
{
  const mlDl = oxygenContentMlPerDl(15, 100, 100);
  const expected = 1.34 * 15 * 1 + 0.0031 * 100;
  assert(Math.abs(mlDl - expected) < 1e-12, 'O2 content mL/dL');
  assert(contentToUnit(mlDl, 'mL/L') === mlDl * 10, 'mL/L ×10');
}

assert(estimatedVo2MlPerMin(2) === 250, 'VO2 estimate 125×2');

// Yes-mode end-to-end via validate
{
  const input = {
    ...createDefaultInput(),
    cardiacOutputText: '5',
    heightText: '180',
    weightText: '80',
  };
  const v = validateCardiacIndexInput(input);
  assert(v.result != null, 'yes mode result');
  assert(
    v.result!.cardiacIndexLPerMinPerM2 === 2.5,
    `yes CI got ${v.result!.cardiacIndexLPerMinPerM2}`,
  );
}

// Fick reject nonpositive Ca−Cv
{
  const input = {
    ...createDefaultInput(),
    knowsCardiacOutput: 'no' as const,
    heightText: '180',
    weightText: '80',
    hemoglobinText: '15',
    arterialSaturationText: '70',
    arterialTensionText: '40',
    venousSaturationText: '98',
    venousTensionText: '90',
  };
  const r = calculateCardiacIndex(input);
  assert(r.cardiacIndexLPerMinPerM2 == null, 'reject inverted AV difference');
  assert(r.cardiacOutputLPerMin == null, 'no CO when Ca≤Cv');
}

// Empty defaults → awaiting
{
  const v = validateCardiacIndexInput(createDefaultInput());
  assert(v.result != null, 'awaiting result object');
  assert(v.result!.cardiacIndexLPerMinPerM2 == null, 'blank CI');
}

console.log('cardiac-index calculation.test.ts: ok');
