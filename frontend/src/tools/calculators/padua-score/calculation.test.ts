import assert from 'node:assert/strict';
import {
  calculatePaduaScore,
  HIGH_RISK_THRESHOLD,
  MAX_SCORE,
  sumBreakdown,
  buildBreakdown,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';

{
  const r = calculatePaduaScore(createDefaultInput());
  assert.equal(r.totalScore, 0);
  assert.equal(r.highRiskBand, false);
}

{
  const r = calculatePaduaScore(createExampleInput());
  assert.equal(r.totalScore, 1);
  assert.equal(r.highRiskBand, false);
}

{
  const r = calculatePaduaScore({
    ...createDefaultInput(),
    activeCancer: true,
  });
  assert.equal(r.totalScore, 3);
  assert.equal(r.highRiskBand, false);
}

{
  const r = calculatePaduaScore({
    ...createDefaultInput(),
    activeCancer: true,
    age70Plus: true,
  });
  assert.equal(r.totalScore, 4);
  assert.equal(r.highRiskBand, true);
}

{
  const all = {
    age70Plus: true,
    obesityBmi30: true,
    reducedMobility: true,
    hormonalTreatment: true,
    activeCancer: true,
    traumaOrSurgeryMonth: true,
    previousVte: true,
    thrombophilia: true,
    heartOrRespiratoryFailure: true,
    acuteMiOrIschemicStroke: true,
    acuteInfectionOrRheumatologic: true,
  };
  const r = calculatePaduaScore(all);
  assert.equal(r.totalScore, MAX_SCORE);
  assert.equal(sumBreakdown(buildBreakdown(all)), MAX_SCORE);
}

{
  assert.equal(HIGH_RISK_THRESHOLD, 4);
  const justUnder = calculatePaduaScore({
    ...createDefaultInput(),
    traumaOrSurgeryMonth: true,
    age70Plus: true,
  });
  assert.equal(justUnder.totalScore, 3);
  assert.equal(justUnder.highRiskBand, false);
}

console.log('padua-score calculation.test.ts: ok');
