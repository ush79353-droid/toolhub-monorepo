/**
 * Iron Deficiency (Ganzoni) — assert-based engine check.
 * Run: npx tsx src/tools/calculators/iron-deficiency/calculation.test.ts
 */
import {
  calculateIronDeficiency,
  formatMg,
  GANZONI_FACTOR_G_PER_DL,
  ganzoniIronDeficitMg,
  ganzoniIronDeficitMgFromGPerL,
  hemoglobinToGPerDl,
  ironStoresMg,
  weightToKg,
} from './calculation';
import { createDefaultInput } from './types';
import { validateIronDeficiencyInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

// NBA / OPAS worked example: 70 kg, Hb 9 → 15 g/dL → 1,508 mg
{
  const r = ganzoniIronDeficitMg(70, 9, 15);
  assert(r.ironStoresMg === 500, `stores ${r.ironStoresMg}`);
  assert(r.hemoglobinDeficitMg === 70 * 6 * 2.4, `hb ${r.hemoglobinDeficitMg}`);
  assert(r.deficitMg === 1508, `deficit ${r.deficitMg}`);
}

// Stores bands
{
  assert(ironStoresMg(35) === 500, '35 kg → 500');
  assert(ironStoresMg(34.9) === 15 * 34.9, 'under 35 → 15 mg/kg');
  assert(ironStoresMg(20) === 300, '20 kg → 300');
}

// g/L equivalence: 70 kg, 90→150 g/L ≡ 9→15 g/dL
{
  const fromGdl = ganzoniIronDeficitMg(70, 9, 15).deficitMg;
  const fromGl = ganzoniIronDeficitMgFromGPerL(70, 90, 150);
  assert(approx(fromGdl, fromGl), `g/L equiv ${fromGdl} vs ${fromGl}`);
  assert(approx(fromGl, 1508), `g/L deficit ${fromGl}`);
}

// Unit helpers
{
  assert(approx(weightToKg(220.462, 'lb'), 100, 1e-3), 'lb→kg');
  assert(hemoglobinToGPerDl(150, 'g/L') === 15, 'g/L→g/dL');
  assert(hemoglobinToGPerDl(12.5, 'g/dL') === 12.5, 'g/dL passthrough');
}

// Target below actual: raw negative Hb component + stores
{
  const r = ganzoniIronDeficitMg(70, 15, 12);
  assert(r.hemoglobinDeficitMg === 70 * (12 - 15) * GANZONI_FACTOR_G_PER_DL, 'neg hb');
  assert(r.deficitMg === r.hemoglobinDeficitMg + 500, 'total with stores');
  assert(r.deficitMg < 500, 'deficit below stores when target < actual');
}

// Throws
{
  let threw = false;
  try {
    ironStoresMg(0);
  } catch {
    threw = true;
  }
  assert(threw, 'zero weight throws');
}

{
  let threw = false;
  try {
    ganzoniIronDeficitMg(70, -1, 15);
  } catch {
    threw = true;
  }
  assert(threw, 'negative Hb throws');
}

// Validation / wiring
{
  const v = validateIronDeficiencyInput(createDefaultInput());
  assert(v.result != null && v.result.deficitMg == null, 'blank');
}

{
  const v = validateIronDeficiencyInput({
    weightText: '70',
    weightUnit: 'kg',
    actualHemoglobinText: '',
    actualHemoglobinUnit: 'g/dL',
    targetHemoglobinText: '',
    targetHemoglobinUnit: 'g/dL',
  });
  assert(v.result?.ironStoresMg === 500, 'stores from weight alone');
  assert(v.result?.deficitMg == null, 'no deficit without Hb');
}

{
  const v = validateIronDeficiencyInput({
    weightText: '-5',
    weightUnit: 'kg',
    actualHemoglobinText: '9',
    actualHemoglobinUnit: 'g/dL',
    targetHemoglobinText: '15',
    targetHemoglobinUnit: 'g/dL',
  });
  assert(v.errors.weightText != null, 'neg weight error');
  assert(v.result == null, 'invalid null result');
}

{
  const r = calculateIronDeficiency({
    weightText: '70',
    weightUnit: 'kg',
    actualHemoglobinText: '9',
    actualHemoglobinUnit: 'g/dL',
    targetHemoglobinText: '15',
    targetHemoglobinUnit: 'g/dL',
  });
  assert(r.deficitMg === 1508, `calc path ${r.deficitMg}`);
  assert(formatMg(1508) === '1,508', `fmt ${formatMg(1508)}`);
}

{
  const r = calculateIronDeficiency({
    weightText: '70',
    weightUnit: 'kg',
    actualHemoglobinText: '90',
    actualHemoglobinUnit: 'g/L',
    targetHemoglobinText: '150',
    targetHemoglobinUnit: 'g/L',
  });
  assert(r.deficitMg === 1508, `g/L input path ${r.deficitMg}`);
}

{
  const r = calculateIronDeficiency({
    weightText: '70',
    weightUnit: 'kg',
    actualHemoglobinText: '15',
    actualHemoglobinUnit: 'g/dL',
    targetHemoglobinText: '12',
    targetHemoglobinUnit: 'g/dL',
  });
  assert(r.deficitMg != null && r.deficitMg < 500, 'target below actual');
  assert(
    r.statusDetail.includes('Target is below actual'),
    'target-below note',
  );
}

console.log('iron-deficiency calculation.test.ts: ok');
