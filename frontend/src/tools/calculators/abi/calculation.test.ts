import assert from 'node:assert/strict';
import {
  calculateAbi,
  computeSideAbi,
  formatAbi,
  parsePressureMmHg,
} from './calculation';
import { createDefaultInput } from './types';
import { validateAbiInput } from './validation';

assert.equal(parsePressureMmHg(''), null);
assert.equal(parsePressureMmHg('120'), 120);
assert.deepEqual(calculateAbi(createDefaultInput()), {
  right: null,
  left: null,
});

// Prompt fixture: arm 120, right 108 → 0.90; left 132 → 1.10
{
  const r = calculateAbi({
    armMmHg: '120',
    rightFootMmHg: '108',
    leftFootMmHg: '132',
  });
  assert.ok(r.right);
  assert.ok(r.left);
  assert.equal(r.right.formattedAbi, '0.90');
  assert.equal(r.left.formattedAbi, '1.10');
  assert.equal(formatAbi(108 / 120), '0.90');
}

// Independent legs: right only
{
  const r = calculateAbi({
    armMmHg: '120',
    rightFootMmHg: '108',
    leftFootMmHg: '',
  });
  assert.ok(r.right);
  assert.equal(r.left, null);
}

// Zero / missing arm denominator guarded
assert.equal(computeSideAbi(0, 108), null);
assert.equal(
  calculateAbi({ armMmHg: '', rightFootMmHg: '108', leftFootMmHg: '' }).right,
  null
);

const invalid = validateAbiInput({
  armMmHg: '0',
  rightFootMmHg: '108',
  leftFootMmHg: '',
});
assert.ok(invalid.errors.armMmHg);

console.log('abi calculation.test.ts: ok');
