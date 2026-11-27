/**
 * Run: cd frontend && npx tsx src/tools/calculators/body-frame-size/calculation.test.ts
 */
import {
  bodyFrameIndex,
  calculateBodyFrameSize,
  categorizeFrame,
  heightToCm,
  lengthToCm,
} from './calculation';
import { createDefaultInput } from './types';
import { validateBodyFrameSizeInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  // Female 1.70 m / 16 cm → 170/16 = 10.625 → medium
  const r = calculateBodyFrameSize({
    sex: 'female',
    heightText: '1.7',
    heightUnit: 'm',
    wristText: '16',
    wristUnit: 'cm',
  });
  assert(r.index === 10.63, `idx ${r.index}`);
  assert(r.category === 'medium', `cat ${r.category}`);
}

{
  // Same physical values via cm/in
  assert(Math.abs(heightToCm(170, 'cm') - 170) < 1e-9, 'cm');
  assert(Math.abs(lengthToCm(6.299212598, 'in') - 16) < 1e-4, 'in wrist');
  const r = calculateBodyFrameSize({
    sex: 'female',
    heightText: '170',
    heightUnit: 'cm',
    wristText: String(16 / 2.54),
    wristUnit: 'in',
  });
  assert(r.category === 'medium', 'unit parity medium');
}

{
  assert(categorizeFrame(11.01, 'female') === 'small', 'F small');
  assert(categorizeFrame(11, 'female') === 'medium', 'F 11 medium');
  assert(categorizeFrame(10.1, 'female') === 'medium', 'F 10.1 medium');
  assert(categorizeFrame(10.09, 'female') === 'large', 'F large');
  assert(categorizeFrame(10.41, 'male') === 'small', 'M small');
  assert(categorizeFrame(10.4, 'male') === 'medium', 'M 10.4 medium');
  assert(categorizeFrame(9.6, 'male') === 'medium', 'M 9.6 medium');
  assert(categorizeFrame(9.59, 'male') === 'large', 'M large');
}

{
  assert(Math.abs(bodyFrameIndex(163, 15.2) - 10.723684) < 1e-6, 'example');
}

{
  const v = validateBodyFrameSizeInput(createDefaultInput());
  assert(v.result != null && v.result.index == null, 'blank');
}

{
  const v = validateBodyFrameSizeInput({
    sex: 'female',
    heightText: '1.7',
    heightUnit: 'm',
    wristText: '0',
    wristUnit: 'cm',
  });
  assert(v.errors.wristText != null, 'zero wrist');
}

console.log('body-frame-size calculation.test.ts: ok');
