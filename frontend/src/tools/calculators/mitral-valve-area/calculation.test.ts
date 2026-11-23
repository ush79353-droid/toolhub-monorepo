/**
 * Mitral Valve Area — assert-based engine check.
 */
import {
  lvotAreaCm2,
  mvaContinuityCm2,
  mvaFromDtMs,
  mvaFromPhtMs,
  phtFromDtMs,
  HATLE_CONSTANT_MS,
  PHT_FROM_DT_FACTOR,
} from './calculation';
import { createExampleInput } from './types';
import { validateMitralValveAreaInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Continuity: d=2 · VTI 20/40 → π/2 ≈ 1.5708
{
  const area = lvotAreaCm2(2)!;
  assert(Math.abs(area - Math.PI) < 1e-9, 'area π');
  const mva = mvaContinuityCm2(2, 20, 40)!;
  assert(Math.abs(mva - Math.PI / 2) < 1e-6, `mva got ${mva}`);
  assert(Math.abs(mva - 1.571) < 0.001, '≈1.571');
}

assert(mvaFromPhtMs(220) === 1, 'PHT 220 → 1');
assert(mvaFromPhtMs(110)! - 2 < 1e-9, 'PHT 110 → 2');
assert(mvaFromPhtMs(0) == null, 'PHT 0');
assert(HATLE_CONSTANT_MS === 220, 'Hatle 220');

{
  const pht = phtFromDtMs(1000)!;
  assert(Math.abs(pht - 290) < 1e-9, '0.29×1000');
  const mva = mvaFromDtMs(1000)!;
  assert(Math.abs(mva - 220 / 290) < 1e-9, 'DT path');
  assert(PHT_FROM_DT_FACTOR === 0.29, 'factor');
}

{
  const v = validateMitralValveAreaInput(createExampleInput());
  assert(v.isValid && v.result != null, 'example');
  assert(Math.abs(v.result!.mvaCm2 - Math.PI / 2) < 1e-6, 'example mva');
}

{
  const v = validateMitralValveAreaInput({
    ...createExampleInput(),
    method: 'pht',
    phtValue: '220',
  });
  assert(v.isValid && v.result?.mvaCm2 === 1, 'pht mode');
}

{
  const v = validateMitralValveAreaInput({
    ...createExampleInput(),
    method: 'continuity',
    lvotValue: '',
    lvotVtiValue: '',
    mitralVtiValue: '',
  });
  assert(!v.isValid && v.result == null, 'blank inactive');
}

console.log('mitral-valve-area calculation.test.ts: ok');
