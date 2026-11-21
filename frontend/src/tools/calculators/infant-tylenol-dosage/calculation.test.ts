import assert from 'node:assert/strict';
import {
  calculateInfantTylenolDosage,
  mgFromMl,
  mlFromMg,
  weightToLb,
} from './calculation';
import { createEmptyInput } from './types';
import { validateInfantTylenolDosageInput } from './validation';

// 160 mg / 5 mL ↔ 32 mg/mL
{
  assert.equal(mgFromMl(5, 32), 160);
  assert.equal(mlFromMg(160, 32), 5);
}

// Infant suspension 24–35 lb → 5 mL
{
  const r = calculateInfantTylenolDosage({
    ...createEmptyInput(),
    weightText: '30',
    weightUnit: 'lb',
    productId: 'infantSuspension',
  });
  assert.equal(r.status, 'labeled_dose');
  assert.equal(r.doseMl, 5);
  assert.equal(r.doseMg, 160);
}

// Infant under 24 lb → ask doctor
{
  const r = calculateInfantTylenolDosage({
    ...createEmptyInput(),
    weightText: '20',
    weightUnit: 'lb',
    productId: 'infantSuspension',
  });
  assert.equal(r.status, 'ask_doctor');
  assert.equal(r.doseLine, null);
}

// Children's suspension 36–47 lb → 7.5 mL
{
  const kg = weightToLb(18, 'kg'); // ~39.7 lb
  assert.ok(kg > 36 && kg < 48);
  const r = calculateInfantTylenolDosage({
    ...createEmptyInput(),
    weightText: '18',
    weightUnit: 'kg',
    productId: 'childrensSuspension',
  });
  assert.equal(r.status, 'labeled_dose');
  assert.equal(r.doseMl, 7.5);
  assert.equal(r.doseMg, 240);
}

// Chewable 1½ tablets allowed on label
{
  const r = calculateInfantTylenolDosage({
    ...createEmptyInput(),
    weightText: '40',
    weightUnit: 'lb',
    productId: 'chewable',
  });
  assert.equal(r.status, 'labeled_dose');
  assert.equal(r.doseLine, '1½ tablets (240 mg)');
}

// Dissolve packs: under 48 lb do not use
{
  const r = calculateInfantTylenolDosage({
    ...createEmptyInput(),
    weightText: '40',
    weightUnit: 'lb',
    productId: 'dissolvePack',
  });
  assert.equal(r.status, 'do_not_use');
}

// Blank product
{
  const r = calculateInfantTylenolDosage(createEmptyInput());
  assert.equal(r.status, 'awaiting_product');
}

// Empty validation
{
  const v = validateInfantTylenolDosageInput(createEmptyInput());
  assert.equal(v.isValid, true);
  assert.equal(v.result?.status, 'awaiting_product');
}

console.log('infant-tylenol-dosage calculation.test.ts: ok');
