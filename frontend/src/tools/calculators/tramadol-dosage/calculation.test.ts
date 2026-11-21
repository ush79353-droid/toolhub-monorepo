import assert from 'node:assert/strict';
import {
  calculateTramadolDosage,
  convertPrescribedAmount,
  educationalMaxMg,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
} from './types';
import { validateTramadolDosageInput } from './validation';

{
  assert.equal(educationalMaxMg('adult', 'chronic', false), 300);
  assert.equal(educationalMaxMg('adult', 'acute', false), 400);
  assert.equal(educationalMaxMg('adult', 'chronic', true), 200);
  assert.equal(educationalMaxMg('under_17', 'chronic', false), null);
}

{
  const c = convertPrescribedAmount(100, '300', '', 'dailyMg');
  assert.equal(c.status, 'ready');
  assert.equal(c.tablets, 3);
}

{
  const c = convertPrescribedAmount(100, '250', '', 'dailyMg');
  assert.equal(c.status, 'not_divisible');
}

{
  const r = calculateTramadolDosage(createExampleInput());
  assert.equal(r.status, 'ready');
  assert.equal(r.formattedDailyMg, '300');
  assert.equal(r.formattedTablets, '3');
}

{
  const r = calculateTramadolDosage({
    ...createDefaultInput(),
    ageBand: 'under_17',
    dailyMg: '100',
    lastEdited: 'dailyMg',
  });
  assert.equal(r.status, 'contraindicated_age');
}

{
  const r = calculateTramadolDosage({
    ...createExampleInput(),
    dailyMg: '400',
    tablets: '4',
    lastEdited: 'dailyMg',
  });
  assert.equal(r.status, 'over_max');
}

{
  const v = validateTramadolDosageInput(createDefaultInput());
  assert.equal(v.isValid, true);
  assert.deepEqual(createEmptyInput(), createDefaultInput());
}

console.log('tramadol-dosage calculation.test.ts: ok');
