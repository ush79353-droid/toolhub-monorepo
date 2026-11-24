import assert from 'node:assert/strict';
import { calculatePeptide, toMcg } from './calculation';
import { createEmptyInput } from './types';

assert.equal(toMcg(5, 'mg'), 5000);
assert.equal(toMcg(250, 'mcg'), 250);

// 5 mg in 1 mL; dose 250 mcg; U-100 → 5 units
{
  const input = createEmptyInput();
  input.vialMassText = '5';
  input.vialMassUnit = 'mg';
  input.diluentMlText = '1';
  input.doseText = '250';
  input.doseUnit = 'mcg';
  input.syringeUnitsPerMlText = '100';
  const r = calculatePeptide(input);
  assert.ok(r.concentrationMcgPerMl != null);
  assert.equal(r.concentrationMcgPerMl, 5000);
  assert.ok(r.drawVolumeMl != null);
  assert.ok(Math.abs(r.drawVolumeMl - 0.05) < 1e-9);
  assert.ok(r.syringeUnits != null);
  assert.ok(Math.abs(r.syringeUnits - 5) < 1e-9);
}

// Unknown / missing scale → no units
{
  const input = createEmptyInput();
  input.vialMassText = '5';
  input.diluentMlText = '1';
  input.doseText = '250';
  input.syringeUnitsPerMlText = '';
  const r = calculatePeptide(input);
  assert.equal(r.syringeUnits, null);
}

// Dose exceeds vial
{
  const input = createEmptyInput();
  input.vialMassText = '1';
  input.vialMassUnit = 'mg';
  input.diluentMlText = '1';
  input.doseText = '2000';
  input.doseUnit = 'mcg';
  input.syringeUnitsPerMlText = '100';
  const r = calculatePeptide(input);
  assert.equal(r.syringeUnits, null);
  assert.match(r.statusHeadline, /exceeds/i);
}

console.log('peptide calculation.test.ts: ok');
