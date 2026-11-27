/**
 * Run: cd frontend && npx tsx src/tools/calculators/ciwa/calculation.test.ts
 */
import assert from 'node:assert/strict';
import { calculateCiwa } from './calculation';
import {
  CIWA_ITEMS,
  CIWA_MAX_TOTAL,
  createDefaultInput,
  createExampleInput,
} from './types';
import { validateCiwaInput } from './validation';

assert.equal(CIWA_ITEMS.length, 10);
assert.equal(
  CIWA_ITEMS.reduce((s, i) => s + i.max, 0),
  CIWA_MAX_TOTAL,
);

const zero = calculateCiwa(createDefaultInput());
assert.equal(zero.total, 0);
assert.equal(zero.allAssessed, true);
assert.equal(zero.band, 'low');
assert.equal(zero.maxTotal, 67);

const example = calculateCiwa(createExampleInput());
assert.equal(example.total, 8);
assert.equal(example.band, 'low');

const maxInput = createDefaultInput();
for (const item of CIWA_ITEMS) {
  maxInput[item.id] = item.max;
}
const max = calculateCiwa(maxInput);
assert.equal(max.total, 67);
assert.equal(max.band, 'severe');

const mid = calculateCiwa({
  ...createDefaultInput(),
  nausea: 7,
  tremor: 7,
  orientation: 0,
});
assert.equal(mid.total, 14);
assert.equal(mid.band, 'moderate');

const incomplete = calculateCiwa({
  ...createDefaultInput(),
  nausea: null,
});
assert.equal(incomplete.allAssessed, false);
assert.equal(incomplete.assessedCount, 9);
assert.equal(incomplete.band, 'incomplete');
assert.equal(incomplete.total, 0);

const bad = validateCiwaInput({
  ...createDefaultInput(),
  orientation: 7,
});
assert.equal(bad.isValid, false);
assert.ok(bad.errors.orientation);

const ok = validateCiwaInput(createDefaultInput());
assert.equal(ok.isValid, true);
assert.equal(ok.result?.total, 0);

console.log('ciwa calculation.test.ts: ok');
