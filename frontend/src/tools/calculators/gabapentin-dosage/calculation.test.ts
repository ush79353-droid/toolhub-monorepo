import assert from 'node:assert/strict';
import { calculateGabapentinDosage, parseAgeYears } from './calculation';
import { createEmptyInput } from './types';

function run() {
  assert.equal(parseAgeYears(''), null);
  assert.equal(parseAgeYears('45'), 45);
  assert.equal(parseAgeYears('x'), 'invalid');

  const empty = calculateGabapentinDosage(createEmptyInput());
  assert.equal(empty.scope, 'awaiting_input');
  assert.equal(empty.doseLines.length, 0);

  const adultEpilepsy = calculateGabapentinDosage({
    indication: 'epilepsy',
    ageYearsText: '30',
  });
  assert.equal(adultEpilepsy.scope, 'fda_labeled');
  assert.ok(adultEpilepsy.doseLines.some((l) => /300 mg three times/i.test(l)));

  const childEpilepsy = calculateGabapentinDosage({
    indication: 'epilepsy',
    ageYearsText: '8',
  });
  assert.equal(childEpilepsy.scope, 'fda_labeled');
  assert.ok(childEpilepsy.doseLines.some((l) => /mg\/kg/i.test(l)));

  const toddler = calculateGabapentinDosage({
    indication: 'epilepsy',
    ageYearsText: '2',
  });
  assert.equal(toddler.scope, 'age_not_labeled');

  const phn = calculateGabapentinDosage({
    indication: 'phn',
    ageYearsText: '55',
  });
  assert.equal(phn.scope, 'fda_labeled');
  assert.ok(phn.doseLines.some((l) => /Day 1/i.test(l)));

  const phnChild = calculateGabapentinDosage({
    indication: 'phn',
    ageYearsText: '15',
  });
  assert.equal(phnChild.scope, 'age_not_labeled');

  const rls = calculateGabapentinDosage({
    indication: 'rls',
    ageYearsText: '40',
  });
  assert.equal(rls.scope, 'alternate_product');
  assert.equal(rls.doseLines.length, 0);

  const anxiety = calculateGabapentinDosage({
    indication: 'anxiety',
    ageYearsText: '40',
  });
  assert.equal(anxiety.scope, 'off_label_informational');
  assert.equal(anxiety.doseLines.length, 0);

  console.log('gabapentin-dosage calculation.test.ts: ok');
}

run();
