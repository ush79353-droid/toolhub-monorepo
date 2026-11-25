import assert from 'node:assert/strict';
import {
  calculateTidalVolume,
  chulaEttDepthCm,
  heightToCm,
  idealBodyWeightKg,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateTidalVolumeInput } from './validation';

assert.equal(heightToCm(1.67, 'm'), 167);
assert.ok(Math.abs(heightToCm(65.748, 'in') - 167) < 0.05);

assert.equal(chulaEttDepthCm(167), 20.7);

const ibw = idealBodyWeightKg(167, 'female');
assert.ok(Math.abs(ibw - 58.73) < 0.05);

const blank = calculateTidalVolume(createDefaultInput());
assert.equal(blank.vtMinMl, null);
assert.equal(blank.ettDepthCm, null);

const example = calculateTidalVolume(createExampleInput());
assert.ok(example.ibwKg != null && Math.abs(example.ibwKg - 58.73) < 0.05);
assert.ok(example.vtMinMl != null && Math.abs(example.vtMinMl - 6 * 58.73) < 0.5);
assert.ok(example.vtMaxMl != null && Math.abs(example.vtMaxMl - 8 * 58.73) < 0.5);
assert.equal(example.ettDepthCm, 20.7);

const male = calculateTidalVolume({
  ...createExampleInput(),
  sex: 'male',
});
assert.ok(male.ibwKg != null && Math.abs(male.ibwKg - 63.23) < 0.05);

const invalid = validateTidalVolumeInput({
  ...createDefaultInput(),
  height: 50,
  heightUnit: 'cm',
});
assert.ok(invalid.errors.height);
assert.equal(invalid.result, null);

console.log('tidal-volume calculation.test.ts: ok');
