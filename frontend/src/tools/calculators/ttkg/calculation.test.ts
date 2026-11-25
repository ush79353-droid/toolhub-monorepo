import assert from 'node:assert/strict';
import { calculateTtkg, computeTtkg } from './calculation';
import { createDefaultInput, createExampleInput } from './types';

const blank = calculateTtkg(createDefaultInput());
assert.equal(blank.ttkg, null);

const ex = calculateTtkg(createExampleInput());
assert.equal(ex.ttkg, 10);

assert.throws(() => computeTtkg(40, 0, 300, 300));
assert.throws(() => computeTtkg(40, 4, 0, 300));
assert.throws(() => computeTtkg(40, 4, 300, 0));

const matched = computeTtkg(50, 4, 600, 300);
assert.equal(matched, 6.25);

console.log('ttkg calculation.test.ts: ok');