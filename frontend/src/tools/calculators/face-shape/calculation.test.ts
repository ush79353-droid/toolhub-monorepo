/**
 * Run: cd frontend && npx tsx src/tools/calculators/face-shape/calculation.test.ts
 */
import { calculateFaceShape, classifyFaceShape, toCm } from './calculation';
import type { FaceShapeInput } from './types';
import { validateFaceShapeInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const probe: FaceShapeInput = {
    sex: 'unset',
    foreheadText: '13.5',
    foreheadUnit: 'cm',
    cheeksText: '13.5',
    cheeksUnit: 'cm',
    jawlineText: '11.5',
    jawlineUnit: 'cm',
    faceLengthText: '19.5',
    faceLengthUnit: 'cm',
    sharpness: 'somewhat',
  };
  const r = calculateFaceShape(probe);
  assert(r.shapeId === 'heart', `Omni-style probe expected heart, got ${r.shapeId}`);
  assert(r.matchedRule === 1, `expected rule 1, got ${r.matchedRule}`);
}

{
  // Rule 1 threshold: forehead 5% above cheeks with narrow jaw and long face
  const c = classifyFaceShape(14.175, 13.5, 11.5, 19.5, 'somewhat');
  assert(c.shapeId === 'heart' && c.matchedRule === 1, 'explicit rule 1');
}

{
  const r = calculateFaceShape({
    sex: 'unset',
    foreheadText: '0',
    foreheadUnit: 'cm',
    cheeksText: '13',
    cheeksUnit: 'cm',
    jawlineText: '12',
    jawlineUnit: 'cm',
    faceLengthText: '18',
    faceLengthUnit: 'cm',
    sharpness: 'somewhat',
  });
  assert(r.shapeId === null, 'zero forehead');
  assert(r.statusHeadline === 'Invalid measurements', 'invalid headline');
}

{
  const v = validateFaceShapeInput({
    sex: 'unset',
    foreheadText: 'abc',
    foreheadUnit: 'cm',
    cheeksText: '13',
    cheeksUnit: 'cm',
    jawlineText: '12',
    jawlineUnit: 'cm',
    faceLengthText: '18',
    faceLengthUnit: 'cm',
    sharpness: 'somewhat',
  });
  assert(v.errors.foreheadText, 'parse error');
  assert(v.result === null, 'no result on error');
}

{
  const inches = 5;
  const cm = toCm(inches, 'in');
  assert(Math.abs(cm - inches * 2.54) < 1e-9, 'in→cm');
}

console.log('face-shape calculation.test.ts: ok');