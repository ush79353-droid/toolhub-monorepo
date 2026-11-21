import assert from 'node:assert/strict';
import {
  calculateParacetamolDosage,
  computeWeightBasedDoses,
  formatMg,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
} from './types';
import { validateParacetamolDosageInput } from './validation';

// Screenshot fixture: 21 kg → 315 / 1260
{
  const d = computeWeightBasedDoses(21);
  assert.equal(d.singleMg, 315);
  assert.equal(d.dailyMg, 1260);
  assert.equal(d.capped, false);
  assert.equal(formatMg(315), '315');
  assert.equal(formatMg(1260), '1,260');
}

{
  const result = calculateParacetamolDosage(createExampleInput());
  assert.equal(result.status, 'ready');
  assert.equal(result.formattedSingleDose, '315');
  assert.equal(result.formattedDailyDose, '1,260');
}

// Under 3 months blocked
{
  const result = calculateParacetamolDosage({
    age: '2',
    ageUnit: 'mos',
    weight: '5',
    weightUnit: 'kg',
  });
  assert.equal(result.status, 'too_young');
  assert.equal(result.singleDoseMg, null);
}

// Adult cap
{
  const d = computeWeightBasedDoses(90);
  assert.equal(d.singleMg, 1000);
  assert.equal(d.dailyMg, 4000);
  assert.equal(d.capped, true);
}

// Empty
{
  const v = validateParacetamolDosageInput(createDefaultInput());
  assert.equal(v.isValid, true);
  assert.equal(v.result.status, 'awaiting_inputs');
  assert.deepEqual(createEmptyInput(), createDefaultInput());
}

console.log('paracetamol-dosage calculation.test.ts: ok');
