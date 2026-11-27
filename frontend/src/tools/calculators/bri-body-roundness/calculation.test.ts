/**
 * Run: cd frontend && npx tsx src/tools/calculators/bri-body-roundness/calculation.test.ts
 */
import { calculateBri, thomasBri } from './calculation';
import { createDefaultInput } from './types';
import { validateBriInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const ratio = 90 / (Math.PI * 180);
  const expected = 364.2 - 365.5 * Math.sqrt(1 - ratio * ratio);
  const bri = thomasBri(180, 90);
  assert(Math.abs(bri - expected) < 1e-12, `fixture ${bri}`);
}

{
  // Equal waist/height ratios → equal BRI (scale invariance).
  const a = thomasBri(180, 90);
  const b = thomasBri(90, 45);
  assert(Math.abs(a - b) < 1e-12, 'scale invariance');
}

{
  const r = calculateBri({
    ...createDefaultInput(),
    heightText: '180',
    waistText: '90',
  });
  assert(r.bri != null && Number.isFinite(r.bri), 'wired');
  assert(r.formattedBri.length > 0, 'fmt');
}

{
  let threw = false;
  try {
    thomasBri(0, 90);
  } catch {
    threw = true;
  }
  assert(threw, 'zero height');
}

{
  // waist > π×height → negative radicand → unavailable (not clamped).
  const r = calculateBri({
    ...createDefaultInput(),
    heightText: '100',
    waistText: '400',
  });
  assert(r.bri == null, 'out of domain not clamped');
}

{
  const v = validateBriInput(createDefaultInput());
  assert(v.result != null && v.result.bri == null, 'blank');
}

console.log('bri-body-roundness calculation.test.ts: ok');
