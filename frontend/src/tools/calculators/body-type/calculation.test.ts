/**
 * Run: cd frontend && npx tsx src/tools/calculators/body-type/calculation.test.ts
 */
import {
  calculateBodyType,
  classifyBodyShape,
  CM_PER_INCH,
  HIGH_HIP_WAIST_CUTOFF,
  toInches,
} from './calculation';
import { createDefaultInput } from './types';
import { validateBodyTypeInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  // Fixture: 90/60/80/90 cm → hourglass, WHR 0.667
  const r = calculateBodyType(createDefaultInput());
  assert(r.shapeId === 'hourglass', `shape ${r.shapeId}`);
  assert(r.whr === 0.667, `whr ${r.whr}`);
  assert(Math.abs(toInches(90, 'cm') - 90 / CM_PER_INCH) < 1e-12, 'cm');
}

{
  // Just below and above high-hip/waist 1.193 for spoon vs bottom hourglass path
  // hips-bust in [3.6,10), hips-waist ≥ 9
  const bust = 34;
  const waist = 26;
  const hips = 38; // hip-bust=4, hip-waist=12
  const below = waist * (HIGH_HIP_WAIST_CUTOFF - 0.001);
  const above = waist * (HIGH_HIP_WAIST_CUTOFF + 0.001);
  assert(
    classifyBodyShape(bust, waist, below, hips) === 'bottom_hourglass',
    'below cutoff → bottom hourglass',
  );
  assert(
    classifyBodyShape(bust, waist, above, hips) === 'spoon',
    'above cutoff → spoon',
  );
}

{
  // Triangle: hip-bust ≥ 3.6, hip-waist < 9
  assert(classifyBodyShape(34, 30, 32, 38) === 'triangle', 'triangle');
}

{
  // Inverted triangle
  assert(classifyBodyShape(40, 34, 33, 36) === 'inverted_triangle', 'inv');
}

{
  // Rectangle
  assert(classifyBodyShape(36, 32, 34, 36) === 'rectangle', 'rect');
}

{
  const empty = {
    bustText: '',
    bustUnit: 'cm' as const,
    waistText: '',
    waistUnit: 'cm' as const,
    highHipText: '',
    highHipUnit: 'cm' as const,
    hipText: '',
    hipUnit: 'cm' as const,
  };
  const v = validateBodyTypeInput(empty, { requireComplete: true });
  assert(Object.keys(v.errors).length > 0, 'require complete');
}

{
  const v = validateBodyTypeInput(createDefaultInput(), {
    requireComplete: true,
  });
  assert(v.result?.shapeId === 'hourglass', 'default calc');
}

console.log('body-type calculation.test.ts: ok');
