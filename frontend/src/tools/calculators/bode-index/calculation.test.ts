import assert from 'node:assert/strict';
import {
  calculateBodeIndex,
  fev1Points,
  mmrcPoints,
  walkBandFromMeters,
  walkPoints,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';

assert.equal(fev1Points('ge65'), 0);
assert.equal(fev1Points('50to64'), 1);
assert.equal(fev1Points('36to49'), 2);
assert.equal(fev1Points('le35'), 3);

assert.equal(walkPoints('ge350'), 0);
assert.equal(walkPoints('250to349'), 1);
assert.equal(walkPoints('150to249'), 2);
assert.equal(walkPoints('le149'), 3);

assert.equal(walkBandFromMeters(350), 'ge350');
assert.equal(walkBandFromMeters(349), '250to349');
assert.equal(walkBandFromMeters(250), '250to349');
assert.equal(walkBandFromMeters(249), '150to249');
assert.equal(walkBandFromMeters(149), 'le149');

assert.equal(mmrcPoints('0or1'), 0);
assert.equal(mmrcPoints('4'), 3);

const unanswered = calculateBodeIndex(createDefaultInput());
assert.equal(unanswered.score, null);

const bmiOnly = calculateBodeIndex({
  ...createDefaultInput(),
  bmiOver21: false,
});
assert.equal(bmiOnly.score, null);

const max = calculateBodeIndex(createExampleInput());
assert.equal(max.score, 10);
assert.deepEqual(max.points, { bmi: 1, fev1: 3, walk: 3, mmrc: 3 });

const min = calculateBodeIndex({
  bmiOver21: true,
  fev1: 'ge65',
  walk: 'ge350',
  mmrc: '0or1',
});
assert.equal(min.score, 0);

const boundaryWalk = calculateBodeIndex({
  bmiOver21: true,
  fev1: 'ge65',
  walk: walkBandFromMeters(349),
  mmrc: '0or1',
});
assert.equal(boundaryWalk.score, 1);

console.log('bode-index calculation.test.ts: ok');
