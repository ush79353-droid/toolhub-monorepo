/**
 * Run: cd frontend && npx tsx src/tools/calculators/body-shape/calculation.test.ts
 */
import {
  calculateBodyShape,
  classifyBodyShape,
  CM_PER_INCH,
  HIGH_HIP_WAIST_CUTOFF,
  SOURCE_NOTE,
  toInches,
} from './calculation';
import type { BodyShapeInput } from './types';
import { validateBodyShapeInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

const hourglassFixture: BodyShapeInput = {
  bustText: '90',
  bustUnit: 'cm',
  waistText: '60',
  waistUnit: 'cm',
  highHipText: '80',
  highHipUnit: 'cm',
  hipText: '90',
  hipUnit: 'cm',
};

{
  const r = calculateBodyShape(hourglassFixture);
  assert(r.shapeId === 'hourglass', `shape ${r.shapeId}`);
  assert(r.resultHeadline === 'Body shape is Hourglass', r.resultHeadline);
  assert(
    SOURCE_NOTE.includes('Omni') && SOURCE_NOTE.includes('parity'),
    'SOURCE_NOTE must disclose Omni parity',
  );
  assert(Math.abs(toInches(90, 'cm') - 90 / CM_PER_INCH) < 1e-12, 'cm');
}

{
  const bust = 34;
  const waist = 26;
  const hips = 38;
  const below = waist * (HIGH_HIP_WAIST_CUTOFF - 0.001);
  const above = waist * (HIGH_HIP_WAIST_CUTOFF + 0.001);
  assert(
    classifyBodyShape(bust, waist, below, hips) === 'bottom_hourglass',
    'below cutoff',
  );
  assert(classifyBodyShape(bust, waist, above, hips) === 'spoon', 'above cutoff');
}

{
  const v = validateBodyShapeInput(hourglassFixture);
  assert(v.result?.shapeId === 'hourglass', 'live validate');
}

console.log('body-shape calculation.test.ts: ok');