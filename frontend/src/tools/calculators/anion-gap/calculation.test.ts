/**
 * Run: cd frontend && npx tsx src/tools/calculators/anion-gap/calculation.test.ts
 */
import {
  albuminCorrectedAnionGap,
  anionGapWithK,
  anionGapWithoutK,
  calculateAnionGap,
} from './calculation';
import { createDefaultInput } from './types';
import { validateAnionGapInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  assert(anionGapWithoutK(140, 104, 24) === 12, 'ag');
  assert(anionGapWithK(140, 0, 104, 24) === 12, 'agk0');
  assert(anionGapWithK(140, 4, 104, 24) === 16, 'agk4');
}

{
  // Albumin 4 → zero Figge term; K=0 → corrected equals primary AG
  const r = calculateAnionGap({
    sodiumText: '140',
    chlorideText: '104',
    bicarbonateText: '24',
    potassiumText: '0',
    albuminText: '4',
  });
  assert(r.anionGap === 12, 'main');
  assert(r.correctedAnionGap === 12, `corr ${r.correctedAnionGap}`);
  assert(r.formattedCorrected === '12.0', 'fmt');
}

{
  // K entered does not change primary AG
  const r = calculateAnionGap({
    sodiumText: '140',
    chlorideText: '104',
    bicarbonateText: '24',
    potassiumText: '4',
    albuminText: '4',
  });
  assert(r.anionGap === 12, 'main ignores K');
  assert(r.anionGapWithK === 16, 'panel uses K');
  assert(r.correctedAnionGap === 16, 'corr with K alb4');
}

{
  // Blank albumin → no corrected display
  const r = calculateAnionGap({
    sodiumText: '140',
    chlorideText: '104',
    bicarbonateText: '24',
    potassiumText: '0',
    albuminText: '',
  });
  assert(r.anionGap === 12, 'ag blank alb');
  assert(r.correctedAnionGap == null, 'no corr');
  assert(r.formattedCorrected === '', 'blank corr');
}

{
  // Hypoalbuminemia correction: AG 12, alb 2 → +5 → 17
  assert(albuminCorrectedAnionGap(12, 2) === 17, 'figge');
}

{
  const v = validateAnionGapInput(createDefaultInput());
  assert(v.result != null && v.result.anionGap == null, 'blank');
}

console.log('anion-gap calculation.test.ts: ok');
