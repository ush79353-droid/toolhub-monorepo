/**
 * Focused self-check — reuses urine-home fixtures with article defaults (sensitivity on).
 * Run: npx tsx src/tools/calculators/positive-pregnancy-test-3-weeks/calculation.test.ts
 */
import assert from 'node:assert/strict';
import { calculatePositivePregnancyTestAt3Weeks } from './calculation';
import { createEmptyInput } from './types';

function run() {
  const defaults = createEmptyInput();
  assert.equal(defaults.showNaturalSensitivity, true);
  assert.equal(defaults.showIvfSensitivity, true);
  assert.equal(defaults.embryoAgeDays, 5);
  assert.equal(defaults.naturalSensitivityMiu, '25');

  const natural = calculatePositivePregnancyTestAt3Weeks({
    ...defaults,
    lastPeriodIso: '2026-01-01',
  });
  assert.equal(natural.ovulationIso, '2026-01-15');
  // Sensitivity 25 mIU → +14 DPO urine (same as typical missed-period band)
  assert.equal(natural.naturalUrineIso, '2026-01-29');
  assert.equal(natural.naturalBloodIso, '2026-01-25');

  const early = calculatePositivePregnancyTestAt3Weeks({
    ...defaults,
    lastPeriodIso: '2026-01-01',
    naturalSensitivityMiu: '10',
  });
  assert.equal(early.naturalUrineIso, '2026-01-25');

  const ivf = calculatePositivePregnancyTestAt3Weeks({
    ...defaults,
    ivfTransferIso: '2026-03-01',
    embryoAgeDays: 5,
  });
  assert.equal(ivf.ivfBloodIso, '2026-03-10');
  assert.equal(ivf.ivfUrineIso, '2026-03-15');

  console.log('positive-pregnancy-test-3-weeks calculation.test.ts: ok');
}

run();
