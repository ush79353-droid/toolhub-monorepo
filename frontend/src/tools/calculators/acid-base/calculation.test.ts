/**
 * Run: cd frontend && npx tsx src/tools/calculators/acid-base/calculation.test.ts
 */
import {
  albuminCorrectedAnionGap,
  anionGap,
  calculateAcidBase,
  interpretAbg,
  wintersExpectedPco2,
} from './calculation';
import { createDefaultInput } from './types';
import { validateAcidBaseInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const ag = anionGap(140, 104, 24);
  assert(ag === 12, `prompt fixture AG ${ag}`);

  const r = calculateAcidBase({
    ...createDefaultInput(),
    sodiumText: '140',
    chlorideText: '104',
    bicarbonateText: '24',
  });
  assert(r.anionGap === 12, 'wired AG');
  assert(r.formattedAnionGap === '12.0', 'format');
  assert(r.correctedAnionGap === null, 'no alb');
}

{
  const cag = albuminCorrectedAnionGap(12, 2);
  assert(Math.abs(cag - 17) < 1e-12, `cAG ${cag}`);

  const r = calculateAcidBase({
    ...createDefaultInput(),
    sodiumText: '140',
    chlorideText: '104',
    bicarbonateText: '24',
    albuminText: '2',
  });
  assert(r.correctedAnionGap != null && Math.abs(r.correctedAnionGap - 17) < 1e-12, 'wired cAG');
}

{
  assert(Math.abs(wintersExpectedPco2(10) - 23) < 1e-12, 'Winters');
  const abg = interpretAbg(7.25, 23, 10);
  assert(/Acidemia/i.test(abg.headline), abg.headline);
  assert(/Metabolic acidosis/i.test(abg.headline), abg.headline);
}

{
  const v = validateAcidBaseInput(createDefaultInput());
  assert(v.result != null && v.result.anionGap == null, 'blank');
}

{
  const v = validateAcidBaseInput({
    ...createDefaultInput(),
    sodiumText: 'bad',
  });
  assert(v.errors.sodiumText, 'bad na');
  assert(v.result == null, 'no result on error');
}

console.log('acid-base calculation.test.ts: ok');
