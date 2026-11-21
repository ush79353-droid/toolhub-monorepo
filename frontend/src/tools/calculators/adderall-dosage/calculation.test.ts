/**
 * Run: npx tsx src/tools/calculators/adderall-dosage/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  calculateAdderallDosage,
  educationalStartingDoseMg,
  tabletQuantity,
} from './calculation';
import { createDefaultInput } from './types';

function run() {
  assert.equal(tabletQuantity(10, 5), 2);
  assert.equal(tabletQuantity(7.5, 5), 1.5);

  assert.equal(educationalStartingDoseMg(4, 'adhd').doseMg, 2.5);
  assert.equal(educationalStartingDoseMg(10, 'adhd').doseMg, 5);
  assert.equal(educationalStartingDoseMg(30, 'adhd').doseMg, 5);
  assert.equal(educationalStartingDoseMg(10, 'narcolepsy').doseMg, 5);
  assert.equal(educationalStartingDoseMg(14, 'narcolepsy').doseMg, 10);
  assert.equal(educationalStartingDoseMg(2, 'adhd').doseMg, null);

  const blank = calculateAdderallDosage(createDefaultInput());
  assert.equal(blank.outcome, 'awaiting_age');

  const adhd = calculateAdderallDosage({
    ...createDefaultInput(),
    ageYearsText: '8',
    indication: 'adhd',
    tabletStrengthMg: 5,
  });
  assert.equal(adhd.outcome, 'label_reference');
  assert.equal(adhd.educationalStartingDoseMg, 5);

  const custom = calculateAdderallDosage({
    ...createDefaultInput(),
    ageYearsText: '30',
    indication: 'custom',
    prescribedDoseMgText: '10',
    tabletStrengthMg: 5,
  });
  assert.equal(custom.outcome, 'custom_tablet_quantity');
  assert.equal(custom.tabletQuantity, 2);
  assert.equal(custom.fractionalTabletNote, null);

  const frac = calculateAdderallDosage({
    ...createDefaultInput(),
    ageYearsText: '30',
    indication: 'custom',
    prescribedDoseMgText: '7.5',
    tabletStrengthMg: 5,
  });
  assert.equal(frac.tabletQuantity, 1.5);
  assert.ok(frac.fractionalTabletNote);

  console.log('adderall-dosage calculation.test.ts: ok');
}

run();
