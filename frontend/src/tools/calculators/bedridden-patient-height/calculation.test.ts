/**
 * Run: cd frontend && npx tsx src/tools/calculators/bedridden-patient-height/calculation.test.ts
 */
import {
  mitchellLipschitzHeightCm,
  rossWeightKg,
  whoHeightCm,
  calculateBedridden,
} from './calculation';
import { createDefaultInput } from './types';
import { validateBedriddenInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  assert(mitchellLipschitzHeightCm(85) === 170, 'mitchell');
  const r = calculateBedridden({
    ...createDefaultInput(),
    semiSpanText: '85',
  });
  assert(r.heightCm === 170, `h ${r.heightCm}`);
}

{
  const w = rossWeightKg('male', 'white', 50, 30);
  const expected = 1.19 * 50 + 3.21 * 30 - 86.82;
  assert(Math.abs(w - expected) < 1e-9, `ross ${w}`);
  const r = calculateBedridden({
    ...createDefaultInput(),
    weightStudy: 'ross',
    weightSex: 'male',
    weightRace: 'white',
    kneeWeightText: '50',
    armCircText: '30',
  });
  assert(r.weightKg != null && Math.abs(r.weightKg - expected) < 1e-9, 'ross wired');
}

{
  // WHO: half-arm span 91 cm → 1.76 m = 176 cm
  const cm = whoHeightCm(91);
  assert(Math.abs(cm - 175.86) < 0.01, `who ${cm}`);
}

{
  const v = validateBedriddenInput(createDefaultInput());
  assert(v.result != null && v.result.heightCm == null, 'blank height');
}

{
  // Method switch clearing is behavioral in UI; engine ignores unused fields
  const r = calculateBedridden({
    ...createDefaultInput(),
    heightStudy: 'mitchellLipschitz',
    semiSpanText: '85',
    kneeHeightText: '999',
  });
  assert(r.heightCm === 170, 'unused knee ignored');
}

console.log('bedridden-patient-height calculation.test.ts: ok');
