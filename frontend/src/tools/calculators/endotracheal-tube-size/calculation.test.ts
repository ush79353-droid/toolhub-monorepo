import assert from 'node:assert/strict';
import {
  calculateEndotrachealTubeSize,
  coleUncuffedMm,
  insertionDepthCm,
  khineCuffedMm,
  roundHalfMm,
  toAgeYears,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';

assert.equal(toAgeYears(24, 'mos'), 2);
assert.equal(coleUncuffedMm(4), 5);
assert.equal(khineCuffedMm(4), 4);
assert.equal(insertionDepthCm(4), 14);
assert.equal(roundHalfMm(5.24), 5);
assert.equal(roundHalfMm(5.25), 5.5);

const blank = calculateEndotrachealTubeSize(createDefaultInput());
assert.equal(blank.uncuffedMm, null);

const ex = calculateEndotrachealTubeSize(createExampleInput());
assert.equal(ex.uncuffedMm, 5);
assert.equal(ex.cuffedMm, 4);
assert.equal(ex.insertionDepthCm, 14);

const infant = calculateEndotrachealTubeSize({ ageText: '6', ageUnit: 'mos' });
assert.equal(infant.uncuffedMm, null);
assert.match(infant.statusHeadline, /outside Cole/i);

const adult = calculateEndotrachealTubeSize({ ageText: '30', ageUnit: 'yrs' });
assert.equal(adult.uncuffedMm, null);

const edge = calculateEndotrachealTubeSize({ ageText: '1', ageUnit: 'yrs' });
assert.equal(edge.uncuffedMm, 4.5); // 1/4+4 = 4.25 → 4.5
assert.equal(edge.cuffedMm, 3.5); // 1/4+3 = 3.25 → 3.5

console.log('endotracheal-tube-size calculation.test.ts: ok');
