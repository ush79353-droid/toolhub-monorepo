/**
 * Run: npx tsx calculation.test.ts
 */
import {
  MENTZER_CUTOFF,
  calculateMentzerIndex,
  mentzerBand,
  mentzerIndex,
} from './calculation';
import { createDefaultInput } from './types';
import { validateMentzerIndexInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const r = calculateMentzerIndex(createDefaultInput());
  assert(r.index === null, 'blank index is null');
  assert(r.formattedIndex === '', 'blank formatted empty');
  assert(r.band === null, 'blank band null');
}

{
  // Prompt fixture: MCV 72 / RBC 6 → 12
  const r = calculateMentzerIndex({
    mcvFlText: '72',
    rbcText: '6',
    rbcUnit: 'million_per_mm3',
  });
  assert(r.index === 12, '72/6 = 12');
  assert(r.formattedIndex === '12', 'formatted 12');
  assert(r.band === 'thalassemia_trait_favored', '12 < 13 favors thalassemia');
}

{
  const r = calculateMentzerIndex({
    mcvFlText: '78',
    rbcText: '5',
    rbcUnit: 'million_per_ul',
  });
  assert(r.index === 15.6, '78/5 = 15.6');
  assert(r.band === 'iron_deficiency_favored', '>13 favors iron deficiency');
}

{
  const r = calculateMentzerIndex({
    mcvFlText: '65',
    rbcText: '5',
    rbcUnit: 'x10e12_per_l',
  });
  assert(r.index === 13, '65/5 = 13 borderline');
  assert(r.band === 'borderline', 'exactly 13 is borderline');
}

{
  assert(mentzerBand(12.99) === 'thalassemia_trait_favored', 'just under cutoff');
  assert(mentzerBand(MENTZER_CUTOFF) === 'borderline', 'cutoff borderline');
  assert(mentzerBand(13.01) === 'iron_deficiency_favored', 'just over cutoff');
}

{
  let threw = false;
  try {
    mentzerIndex(72, 0);
  } catch {
    threw = true;
  }
  assert(threw, 'zero RBC guarded');
}

{
  const v = validateMentzerIndexInput({
    mcvFlText: '72',
    rbcText: '0',
    rbcUnit: 'million_per_mm3',
  });
  assert(v.errors.rbcText, 'zero RBC field error');
  assert(v.result === null, 'no result on error');
}

{
  const v = validateMentzerIndexInput({
    mcvFlText: 'not-a-number',
    rbcText: '6',
    rbcUnit: 'million_per_mm3',
  });
  assert(v.errors.mcvFlText, 'invalid MCV field error');
}

console.log('mentzer-index calculation.test.ts: ok');
