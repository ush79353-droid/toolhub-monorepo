/**
 * 4Ts HIT score — assert-based engine check.
 * Run: npx tsx src/tools/calculators/four-t-score/calculation.test.ts
 */
import {
  calculateFourTScore,
  computeFourTScore,
  probabilityBandForScore,
  thrombocytopeniaPoints,
  timingPoints,
  thrombosisPoints,
  otherCausesPoints,
  interpretationForBand,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateFourTScoreInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Screenshot fixture: fall <30%, nadir <10, timing 0, thrombosis none, other definite → 0
{
  const r = calculateFourTScore(createDefaultInput());
  assert(r.score === 0, 'screenshot default score 0');
  assert(r.probabilityBand === 'low', 'screenshot low band');
  assert(
    r.interpretation.includes('low (~5%)'),
    'screenshot interpretation',
  );
  assert(r.thrombocytopeniaPoints === 0, 'screenshot thrombocytopenia 0');
}

assert(computeFourTScore(createDefaultInput()) === 0, 'compute default 0');

// Discordant fall/nadir: >50% fall + nadir <10 → thrombocytopenia 0 (not 2)
assert(
  thrombocytopeniaPoints('over50', 'under10') === 0,
  'discordant >50% + nadir <10 → 0',
);
assert(
  thrombocytopeniaPoints('over50', 'ge20') === 2,
  'concordant >50% + nadir ≥20 → 2',
);
assert(
  thrombocytopeniaPoints('30to50', '10to19') === 1,
  'partial fall/nadir → 1',
);

// Component point maps
assert(timingPoints('clear_onset_5_10') === 2, 'timing 2');
assert(timingPoints('onset_under4_no_heparin') === 0, 'timing 0');
assert(thrombosisPoints('none') === 0, 'thrombosis 0');
assert(otherCausesPoints('definite') === 0, 'other definite 0');
assert(otherCausesPoints('none') === 2, 'other none 2');

// Band boundaries
assert(probabilityBandForScore(0) === 'low', 'band 0 low');
assert(probabilityBandForScore(3) === 'low', 'band 3 low');
assert(probabilityBandForScore(4) === 'intermediate', 'band 4 int');
assert(probabilityBandForScore(5) === 'intermediate', 'band 5 int');
assert(probabilityBandForScore(6) === 'high', 'band 6 high');
assert(probabilityBandForScore(8) === 'high', 'band 8 high');

assert(
  interpretationForBand('intermediate').includes('~14%'),
  'intermediate wording',
);
assert(interpretationForBand('high').includes('~64%'), 'high wording');

// Max score path (2+2+2+2)
{
  const max = calculateFourTScore({
    plateletFall: 'over50',
    timing: 'clear_onset_5_10',
    plateletNadir: 'ge20',
    thrombosis: 'new_thrombosis_necrosis_asr',
    otherCauses: 'none',
  });
  assert(max.score === 8, 'max score 8');
  assert(max.probabilityBand === 'high', 'max high');
}

{
  const v = validateFourTScoreInput(createExampleInput());
  assert(v.isValid && v.result != null, 'example validates');
  assert(v.result!.score >= 4, 'example intermediate-ish');
}

console.log('four-t-score calculation.test.ts: ok');