import assert from 'node:assert/strict';
import { calculateLungCapacity } from './calculation';
import { createDefaultInput, createExampleInput } from './types';

const blank = calculateLungCapacity(createDefaultInput());
assert.equal(blank.tlc, null);

const ex = calculateLungCapacity(createExampleInput());
assert.equal(ex.tlc, 6);
assert.equal(ex.vc, 4.5);
assert.equal(ex.frc, 2.5);
assert.equal(ex.ic, 3.5);

const partial = calculateLungCapacity({
  irvText: '3',
  tvText: '0.5',
  ervText: '',
  rvText: '',
  unit: 'L',
});
assert.equal(partial.ic, 3.5);
assert.equal(partial.vc, null);
assert.equal(partial.tlc, null);

console.log('lung-capacity calculation.test.ts: ok');
