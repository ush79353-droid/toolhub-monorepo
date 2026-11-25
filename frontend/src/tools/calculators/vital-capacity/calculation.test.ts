import assert from 'node:assert/strict';
import {
  calculateVitalCapacity,
  predictedVcLiters,
  heightToCm,
} from './calculation';
import { createExampleInput, createDefaultInput } from './types';

// Female 30 y · 167 cm — Omni/Baldwin form
const femaleVc = predictedVcLiters('female', 30, 167);
assert.ok(Math.abs(femaleVc - 3.13125) < 0.001);

// Male 25 y · 175 cm
const maleVc = predictedVcLiters('male', 25, 175);
assert.ok(Math.abs(maleVc - 4.34525) < 0.001);

assert.equal(heightToCm(1.75, 'm'), 175);
assert.equal(heightToCm(70, 'in'), 177.8);

const blank = calculateVitalCapacity(createDefaultInput());
assert.equal(blank.vcLiters, null);

const ex = calculateVitalCapacity(createExampleInput());
assert.ok(ex.vcLiters != null && Math.abs(ex.vcLiters - 3.13125) < 0.001);

console.log('vital-capacity calculation.test.ts: ok');