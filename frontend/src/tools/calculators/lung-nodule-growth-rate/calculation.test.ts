import assert from 'node:assert/strict';
import {
  brockLogOdds,
  calculateLungNoduleGrowthRate,
  probabilityFromLogOdds,
  sizeTransformMm,
} from './calculation';
import { createDefaultInput } from './types';

// 4 mm size → transform 0
assert.ok(Math.abs(sizeTransformMm(4) - 0) < 1e-9);

// Male, 62y, no risk factors, solid 4 mm, count 4 → near intercept
const baseLog = brockLogOdds({
  age: 62,
  female: false,
  familyHistory: false,
  emphysema: false,
  spiculation: false,
  upperLobe: false,
  count: 4,
  sizeMm: 4,
  noduleType: 'solid',
});
assert.ok(Math.abs(baseLog - -6.7892) < 1e-9);
assert.ok(Math.abs(probabilityFromLogOdds(baseLog) - 0.112) < 0.01);

const filled = createDefaultInput();
filled.ageText = '62';
filled.countText = '4';
filled.sizeText = '4';
const r = calculateLungNoduleGrowthRate(filled);
assert.equal(r.formattedProbability !== '', true);
assert.ok(r.probabilityPercent !== null && r.probabilityPercent < 1);

console.log('lung-nodule-growth-rate calculation.test.ts: ok');
