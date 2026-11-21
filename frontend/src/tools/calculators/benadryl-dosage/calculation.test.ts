import assert from 'node:assert/strict';
import { calculateBenadrylDosage, parseAgeYears } from './calculation';
import { createEmptyInput } from './types';

function run() {
  assert.equal(parseAgeYears(''), null);
  assert.equal(parseAgeYears('30'), 30);
  assert.equal(parseAgeYears('abc'), 'invalid');
  assert.equal(parseAgeYears('-1'), 'invalid');

  const empty = calculateBenadrylDosage(createEmptyInput());
  assert.equal(empty.status, 'awaiting_age');
  assert.equal(empty.maxDosesPer24Hours, 6);
  assert.match(empty.indicationHtmlSafe, /hay fever/);
  assert.match(empty.maxDosesNote ?? '', /6 doses/);

  const adult = calculateBenadrylDosage({
    ...createEmptyInput(),
    ageYearsText: '30',
  });
  assert.equal(adult.status, 'labeled_dose');
  assert.equal(adult.doseLine, '1 to 2 tablets');

  const child = calculateBenadrylDosage({
    ...createEmptyInput(),
    ageYearsText: '8',
  });
  assert.equal(child.doseLine, '1 tablet');

  const toddler = calculateBenadrylDosage({
    ...createEmptyInput(),
    ageYearsText: '4',
  });
  assert.equal(toddler.status, 'do_not_use');

  const extraYoung = calculateBenadrylDosage({
    ...createEmptyInput(),
    productId: 'extraStrength',
    ageYearsText: '10',
  });
  assert.equal(extraYoung.status, 'do_not_use');

  const liquid = calculateBenadrylDosage({
    ...createEmptyInput(),
    productId: 'childrensLiquid',
    ageYearsText: '7',
  });
  assert.equal(liquid.doseLine, '5 mL to 10 mL');

  const liquidAdult = calculateBenadrylDosage({
    ...createEmptyInput(),
    productId: 'dyeFreeLiquid',
    ageYearsText: '40',
  });
  assert.equal(liquidAdult.status, 'not_labeled_for_age');

  console.log('benadryl-dosage calculation.test.ts: ok');
}

run();
