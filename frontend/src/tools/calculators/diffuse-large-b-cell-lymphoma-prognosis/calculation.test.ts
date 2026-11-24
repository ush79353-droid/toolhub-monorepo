/**
 * Run: npx tsx calculation.test.ts
 */
import {
  AGE_THRESHOLD_YEARS,
  calculateDlbclPrognosis,
  computeRipiScore,
} from './calculation';
import { createDefaultInput } from './types';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const r = calculateDlbclPrognosis(createDefaultInput());
  assert(r.score === 0, 'default favorable 0');
  assert(r.fourYearOverallSurvivalPercent === 94, '0 pts OS 94');
  assert(r.fourYearProgressionFreeSurvivalPercent === 94, '0 pts PFS 94');
}

{
  const r = calculateDlbclPrognosis({
    ...createDefaultInput(),
    ageYearsText: '45',
  });
  assert(r.score === 0, 'age 45 low');
}

{
  const r = calculateDlbclPrognosis({
    ...createDefaultInput(),
    ageYearsText: '61',
  });
  assert(r.score === 1, 'age 61 adds 1');
}

{
  const r = calculateDlbclPrognosis({
    ageYearsText: '61',
    stage: 'stage_3_4',
    extranodalSites: 'more_than_one',
    ldh: 'elevated',
    ecog: 'two_four',
  });
  assert(r.score === 5, 'max score 5');
  assert(r.fourYearOverallSurvivalPercent === 26, 'high risk OS');
}

assert(computeRipiScore(60, createDefaultInput()) === 0, 'age 60 no point');
assert(computeRipiScore(61, createDefaultInput()) === 1, 'age 61 point');
assert(AGE_THRESHOLD_YEARS === 60, 'threshold 60');

console.log('diffuse-large-b-cell-lymphoma-prognosis calculation.test.ts: ok');