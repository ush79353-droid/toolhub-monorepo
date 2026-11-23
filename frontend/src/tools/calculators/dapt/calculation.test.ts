import assert from 'node:assert/strict';
import { calculateDaptScore, sumBreakdown, buildBreakdown } from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateDaptInput } from './validation';

// Defaults → 0
{
  const r = calculateDaptScore(createDefaultInput());
  assert.equal(r.totalScore, 0);
  assert.equal(r.highScoreBand, false);
}

// Age ≥75 alone → −2
{
  const r = calculateDaptScore(createExampleInput());
  assert.equal(r.totalScore, -2);
}

// Age 65–74 → −1
{
  const r = calculateDaptScore({
    ...createDefaultInput(),
    ageBand: 'age65to74',
  });
  assert.equal(r.totalScore, -1);
}

// Max score: under65 + all factors = 0+1+1+1+1+2+2+1+1 = 10
{
  const r = calculateDaptScore({
    ageBand: 'under65',
    diabetes: true,
    priorMiOrPci: true,
    miAtPresentation: true,
    stentDiameterLt3mm: true,
    veinGraftStent: true,
    chfOrLowEf: true,
    smoker: true,
    paclitaxelElutingStent: true,
  });
  assert.equal(r.totalScore, 10);
  assert.equal(r.highScoreBand, true);
}

// Stent exactly 3 mm is NOT <3 mm — no point when flag false
{
  const r = calculateDaptScore({
    ...createDefaultInput(),
    stentDiameterLt3mm: false,
  });
  assert.equal(r.breakdown.stentLt3Points, 0);
}

// Boundary ≥2
{
  const low = calculateDaptScore({
    ...createDefaultInput(),
    diabetes: true,
  });
  assert.equal(low.totalScore, 1);
  assert.equal(low.highScoreBand, false);
  const high = calculateDaptScore({
    ...createDefaultInput(),
    diabetes: true,
    smoker: true,
  });
  assert.equal(high.totalScore, 2);
  assert.equal(high.highScoreBand, true);
}

{
  const v = validateDaptInput(createDefaultInput());
  assert.equal(v.isValid, true);
  assert.equal(v.result?.totalScore, 0);
  assert.equal(sumBreakdown(buildBreakdown(createDefaultInput())), 0);
}

console.log('dapt calculation.test.ts: ok');
