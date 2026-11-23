import assert from 'node:assert/strict';
import {
  calculateAorticValveArea,
  classifySeverity,
  computeAvaCm2,
  lengthToCm,
  vtiToCm,
} from './calculation';
import { createExampleInput } from './types';
import { validateAorticValveAreaInput } from './validation';

// Prompt fixture: 20 mm, 20 cm, 80 cm → 0.7854 cm²
{
  const lvotCm = lengthToCm(20, 'mm');
  const v1 = vtiToCm(20, 'cm');
  const v2 = vtiToCm(80, 'cm');
  assert.ok(lvotCm != null && v1 != null && v2 != null);
  const ava = computeAvaCm2(lvotCm, v1, v2);
  assert.ok(ava != null);
  assert.ok(Math.abs(ava - Math.PI / 4) < 1e-10);
  assert.equal(Number(ava.toFixed(4)), 0.7854);
  assert.equal(classifySeverity(ava), 'severe');
}

// Equivalent units: 2 cm LVOT, 0.2 m VTI1, 0.8 m VTI2
{
  const ava = computeAvaCm2(2, 20, 80);
  const avaAlt = computeAvaCm2(
    lengthToCm(2, 'cm')!,
    vtiToCm(0.2, 'm')!,
    vtiToCm(0.8, 'm')!
  );
  assert.ok(ava != null && avaAlt != null);
  assert.ok(Math.abs(ava - avaAlt) < 1e-12);
}

// Positive denominator required
{
  assert.equal(computeAvaCm2(2, 20, 0), null);
  assert.equal(computeAvaCm2(2, 20, -1), null);
}

// Severity boundary resolution
{
  assert.equal(classifySeverity(0.999), 'severe');
  assert.equal(classifySeverity(1), 'moderate');
  assert.equal(classifySeverity(1.5), 'moderate');
  assert.equal(classifySeverity(1.5001), 'mild');
  assert.equal(classifySeverity(3), 'mild');
  assert.equal(classifySeverity(3.0001), 'normal');
}

// Validation wires example
{
  const v = validateAorticValveAreaInput(createExampleInput());
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  assert.equal(Number(v.result.avaCm2.toFixed(4)), 0.7854);
  const mm2 = calculateAorticValveArea(2, 20, 80, 'mm2');
  assert.ok(mm2);
  assert.equal(Number(mm2.avaDisplay.toFixed(2)), 78.54);
}

console.log('aortic-valve-area calculation.test.ts: ok');
