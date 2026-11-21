import assert from 'node:assert/strict';
import {
  calculateBloodPregnancyHcg,
  suggestOvulationIso,
  urineDaysAfterOvulation,
  ivfBloodDaysAfterTransfer,
} from './calculation';
import { createEmptyInput } from './types';

function run() {
  assert.equal(suggestOvulationIso('2026-01-01', 28), '2026-01-15');
  assert.equal(urineDaysAfterOvulation('25', false), 14);
  assert.equal(urineDaysAfterOvulation('10', true), 10);
  assert.equal(ivfBloodDaysAfterTransfer(5), 9);
  assert.equal(ivfBloodDaysAfterTransfer(3), 11);

  const natural = calculateBloodPregnancyHcg({
    ...createEmptyInput(),
    lastPeriodIso: '2026-01-01',
  });
  assert.equal(natural.ovulationIso, '2026-01-15');
  assert.equal(natural.naturalBloodIso, '2026-01-25');
  assert.equal(natural.naturalUrineIso, '2026-01-29');

  const early = calculateBloodPregnancyHcg({
    ...createEmptyInput(),
    lastPeriodIso: '2026-01-01',
    selectTestSensitivity: true,
    testSensitivityMiu: '10',
  });
  assert.equal(early.naturalUrineIso, '2026-01-25');

  const ivf = calculateBloodPregnancyHcg({
    ...createEmptyInput(),
    ivfTransferIso: '2026-03-01',
    embryoAgeDays: 5,
  });
  assert.equal(ivf.ivfBloodIso, '2026-03-10');
  assert.equal(ivf.ivfUrineIso, '2026-03-15');

  console.log('blood-pregnancy-hcg calculation.test.ts: ok');
}

run();
