import assert from 'node:assert/strict';
import {
  calculateCha2ds2Vasc,
  computeCha2ds2VascScore,
  FRIBERG_RATES,
  isFemaleSexOnly,
} from './calculation';
import { createDefaultInput } from './types';

// Defaults → score 0 → 0.2% / 0.3%
{
  const r = calculateCha2ds2Vasc(createDefaultInput());
  assert.equal(r.score, 0);
  assert.equal(r.strokeRiskPercent, 0.2);
  assert.equal(r.compositeRiskPercent, 0.3);
  assert.equal(r.riskBand, 'low');
  assert.match(r.interpretation, /low risk/);
  assert.equal(r.interpretation.includes('Anticoagulation'), false);
}

// Age bands
assert.equal(
  computeCha2ds2VascScore({ ...createDefaultInput(), ageBand: '65to74' }),
  1
);
assert.equal(
  computeCha2ds2VascScore({ ...createDefaultInput(), ageBand: 'ge75' }),
  2
);

// Max score 9
{
  const max = calculateCha2ds2Vasc({
    chf: 'yes',
    hypertension: 'yes',
    ageBand: 'ge75',
    diabetes: 'yes',
    female: 'yes',
    priorStrokeTie: 'yes',
    vascularDisease: 'yes',
  });
  assert.equal(max.score, 9);
  assert.equal(max.strokeRiskPercent, 12.2);
  assert.equal(max.compositeRiskPercent, 17.4);
}

// Female sex only
{
  const f = {
    ...createDefaultInput(),
    female: 'yes' as const,
  };
  assert.equal(isFemaleSexOnly(f), true);
  const r = calculateCha2ds2Vasc(f);
  assert.equal(r.score, 1);
  assert.equal(r.riskBand, 'low');
  assert.ok(r.femaleSexOnlyNote);
}

for (let s = 0; s <= 9; s++) {
  assert.ok(FRIBERG_RATES[s], `missing Friberg row ${s}`);
}

console.log('cha2ds2-vasc calculation.test.ts: ok');
