/**
 * HAS-BLED — assert-based engine check.
 * Run via: backend node_modules tsx path/to/calculation.test.ts
 */
import {
  computeHasBledScore,
  calculateHasBled,
  riskBandForScore,
  PISTERS_OAC_RATES,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateHasBledInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(computeHasBledScore(createDefaultInput()) === 0, 'defaults 0');
assert(riskBandForScore(0) === 'low', 'low');
assert(riskBandForScore(1) === 'intermediate', 'int 1');
assert(riskBandForScore(2) === 'intermediate', 'int 2');
assert(riskBandForScore(3) === 'high', 'high 3');

{
  const r = calculateHasBled(createDefaultInput());
  assert(r.score === 0, 'score 0');
  assert(r.eventsPer100PatientYears === 1.13, 'rate 1.13');
  assert(r.formattedEventsRate === '1.1', 'display 1.1');
}

{
  const allYes: ReturnType<typeof createDefaultInput> = {
    hypertension: 'yes',
    abnormalRenal: 'yes',
    abnormalLiver: 'yes',
    strokeHistory: 'yes',
    bleeding: 'yes',
    labileInr: 'yes',
    ageOver65: 'yes',
    alcohol: 'yes',
    drugs: 'yes',
  };
  assert(computeHasBledScore(allYes) === 9, 'max 9');
  assert(PISTERS_OAC_RATES[9] == null, 'no rate at 9');
  assert(calculateHasBled(allYes).formattedEventsRate === 'insufficient data', 'insuff');
}

{
  const v = validateHasBledInput(createExampleInput());
  assert(v.isValid && v.result?.score === 3, 'example 3');
  assert(v.result!.riskBand === 'high', 'example high');
  assert(v.result!.eventsPer100PatientYears === 3.74, 'example rate');
}

// Age boundary semantics: field is “>65” — 65 alone would be No in UI
assert(
  computeHasBledScore({ ...createDefaultInput(), ageOver65: 'no' }) === 0,
  'age 65 → no points'
);
assert(
  computeHasBledScore({ ...createDefaultInput(), ageOver65: 'yes' }) === 1,
  'age 66+ → 1'
);

// Renal + liver independent
assert(
  computeHasBledScore({
    ...createDefaultInput(),
    abnormalRenal: 'yes',
    abnormalLiver: 'yes',
  }) === 2,
  'renal+liver = 2'
);

console.log('has-bled calculation.test.ts: ok');
