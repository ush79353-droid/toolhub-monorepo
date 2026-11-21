import assert from 'node:assert/strict';
import {
  calculateUrineHomePregnancyTest,
  suggestOvulationIso,
} from './calculation';
import { createEmptyInput } from './types';

function run() {
  assert.equal(suggestOvulationIso('2026-01-01', 28), '2026-01-15');

  const natural = calculateUrineHomePregnancyTest({
    ...createEmptyInput(),
    lastPeriodIso: '2026-01-01',
  });
  assert.equal(natural.ovulationIso, '2026-01-15');
  assert.equal(natural.naturalBloodIso, '2026-01-25');
  assert.equal(natural.naturalUrineIso, '2026-01-29');

  const earlyNatural = calculateUrineHomePregnancyTest({
    ...createEmptyInput(),
    lastPeriodIso: '2026-01-01',
    showNaturalSensitivity: true,
    naturalSensitivityMiu: '10',
  });
  assert.equal(earlyNatural.naturalUrineIso, '2026-01-25');

  const ivf = calculateUrineHomePregnancyTest({
    ...createEmptyInput(),
    ivfTransferIso: '2026-03-01',
    embryoAgeDays: 5,
  });
  assert.equal(ivf.ivfBloodIso, '2026-03-10');
  assert.equal(ivf.ivfUrineIso, '2026-03-15');

  const earlyIvfOnly = calculateUrineHomePregnancyTest({
    ...createEmptyInput(),
    lastPeriodIso: '2026-01-01',
    ivfTransferIso: '2026-03-01',
    showIvfSensitivity: true,
    ivfSensitivityMiu: '10',
    showNaturalSensitivity: false,
  });
  assert.equal(earlyIvfOnly.naturalUrineIso, '2026-01-29');
  assert.equal(earlyIvfOnly.ivfUrineIso, '2026-03-11');

  console.log('urine-home-pregnancy-test calculation.test.ts: ok');
}

run();
