/**
 * TIMI UA/NSTEMI — Antman JAMA 2000 self-check (run: npx tsx …/calculation.test.ts)
 */

import assert from 'node:assert/strict';
import {
  calculateTimiUanstemi,
  displayEventRatePercent,
  publishedEventRatePercent,
  PUBLISHED_EVENT_RATE_BY_SCORE,
} from './calculation';
import {
  createDefaultInput,
  createExampleInput,
  createEmptyInput,
  type TimiFactorKey,
  type TimiUanstemiInput,
} from './types';
import { validateTimiUanstemiInput } from './validation';

const FACTOR_KEYS: readonly TimiFactorKey[] = [
  'ageGe65',
  'cadRiskFactorsGe3',
  'knownCadStenosisGe50',
  'aspirinPast7Days',
  'severeAnginaGe2In24h',
  'stDeviation',
  'positiveCardiacMarker',
];

function withOnly(key: TimiFactorKey): TimiUanstemiInput {
  const base = createDefaultInput();
  return { ...base, [key]: 'yes' };
}

// Screenshot defaults — all No → score 0, display 5% (published 4.7)
{
  const r = calculateTimiUanstemi(createDefaultInput());
  assert.equal(r.score, 0);
  assert.equal(r.formattedScore, '0');
  assert.equal(r.publishedEventRatePercent, 4.7);
  assert.equal(r.displayEventRatePercent, 5);
  assert.equal(r.formattedDisplayEventRate, '5%');
}

// Score 1 — single toggle each factor; same 0/1 published band
for (const key of FACTOR_KEYS) {
  const r = calculateTimiUanstemi(withOnly(key));
  assert.equal(r.score, 1, `single Yes on ${key}`);
  assert.equal(r.publishedEventRatePercent, 4.7);
  assert.equal(r.displayEventRatePercent, 5);
  for (const k of FACTOR_KEYS) {
    assert.equal(r.breakdown[k], k === key ? 1 : 0, `breakdown ${k}`);
  }
}

// Score 7 — all Yes
{
  const r = calculateTimiUanstemi(createExampleInput());
  assert.equal(r.score, 7);
  assert.equal(r.publishedEventRatePercent, 40.9);
  assert.equal(r.displayEventRatePercent, 41);
  assert.equal(r.formattedDisplayEventRate, '41%');
}

// Full published table + display rounding
{
  assert.deepEqual([...PUBLISHED_EVENT_RATE_BY_SCORE], [
    4.7, 4.7, 8.3, 13.2, 19.9, 26.2, 40.9, 40.9,
  ]);
  assert.equal(publishedEventRatePercent(2), 8.3);
  assert.equal(displayEventRatePercent(2), 8);
  assert.equal(displayEventRatePercent(3), 13);
  assert.equal(displayEventRatePercent(4), 20);
  assert.equal(displayEventRatePercent(5), 26);
  assert.equal(displayEventRatePercent(6), 41);
  assert.equal(displayEventRatePercent(0), 5);
  assert.equal(displayEventRatePercent(1), 5);
}

// Intermediate score 3 (three factors)
{
  const input: TimiUanstemiInput = {
    ...createEmptyInput(),
    ageGe65: 'yes',
    stDeviation: 'yes',
    positiveCardiacMarker: 'yes',
  };
  const r = calculateTimiUanstemi(input);
  assert.equal(r.score, 3);
  assert.equal(r.publishedEventRatePercent, 13.2);
  assert.equal(r.displayEventRatePercent, 13);
}

// Validation always valid for binary inputs
{
  const v = validateTimiUanstemiInput(createDefaultInput());
  assert.equal(v.isValid, true);
  assert.equal(v.result.score, 0);
}

// Endpoint copy present
{
  const r = calculateTimiUanstemi(createDefaultInput());
  assert.ok(r.endpointLines.length === 3);
  assert.match(r.riskSummary, /5%/);
}

console.log('timi-uanstemi calculation.test.ts: ok');
