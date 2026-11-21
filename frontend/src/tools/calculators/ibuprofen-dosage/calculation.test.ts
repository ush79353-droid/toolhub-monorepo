import assert from 'node:assert/strict';
import { calculateIbuprofenDosage, toKgAndLb } from './calculation';
import { LB_PER_KG, findWeightBand } from './labels';

// Screenshot example 1: 9.6 kg → Infants’ 18–23 lb → 1.875 mL
{
  const { lb } = toKgAndLb(9.6, 'kg');
  assert.ok(Math.abs(lb - 9.6 * LB_PER_KG) < 1e-12);
  const band = findWeightBand(lb);
  assert.ok(band);
  assert.equal(band!.doseMl, 1.875);
  assert.equal(band!.productId, 'infants_drops');

  const result = calculateIbuprofenDosage({
    isSixMonthsOrOlder: true,
    weightText: '9.6',
    weightUnit: 'kg',
  });
  assert.equal(result.status, 'labeled_dose');
  assert.equal(result.doseMl, 1.875);
  assert.equal(result.doseMg, 75);
}

// Screenshot example 2: 31.8 kg → Children’s 60–71 lb → 12.5 mL
{
  const result = calculateIbuprofenDosage({
    isSixMonthsOrOlder: true,
    weightText: '31.8',
    weightUnit: 'kg',
  });
  assert.equal(result.status, 'labeled_dose');
  assert.equal(result.doseMl, 12.5);
  assert.equal(result.doseMg, 250);
  assert.equal(result.productId, 'childrens_suspension');
}

// Age gate: unchecked → no dose even with weight
{
  const result = calculateIbuprofenDosage({
    isSixMonthsOrOlder: false,
    weightText: '9.6',
    weightUnit: 'kg',
  });
  assert.equal(result.status, 'age_gate_blocked');
  assert.equal(result.doseMl, null);
}

// Blank weight → awaiting (checkbox alone insufficient)
{
  const result = calculateIbuprofenDosage({
    isSixMonthsOrOlder: true,
    weightText: '',
    weightUnit: 'kg',
  });
  assert.equal(result.status, 'awaiting_weight');
  assert.equal(result.doseMl, null);
}

// Do not round kg into a wrong band: 10.884 kg ≈ 24.000 lb boundary → Children’s 5 mL
{
  const exactly24lbAsKg = 24 / LB_PER_KG;
  const result = calculateIbuprofenDosage({
    isSixMonthsOrOlder: true,
    weightText: String(exactly24lbAsKg),
    weightUnit: 'kg',
  });
  assert.equal(result.status, 'labeled_dose');
  assert.equal(result.doseMl, 5);
  assert.equal(result.productId, 'childrens_suspension');
}

// Just under 24 lb stays on Infants’ 1.875 mL
{
  const justUnder = calculateIbuprofenDosage({
    isSixMonthsOrOlder: true,
    weightText: '23.999',
    weightUnit: 'lb',
  });
  assert.equal(justUnder.doseMl, 1.875);
  assert.equal(justUnder.productId, 'infants_drops');
}

console.log('ibuprofen-dosage calculation.test.ts: ok');
