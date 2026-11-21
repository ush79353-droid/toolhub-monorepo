import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculatePenceToPounds,
  penceToPounds,
  poundsToPence,
} from './calculation';
import { createExampleInput, type PenceToPoundsInput } from './types';
import { validatePenceToPoundsInput } from './validation';

function base(patch: Partial<PenceToPoundsInput> = {}): PenceToPoundsInput {
  return { ...createExampleInput(), ...patch };
}

describe('pence ↔ pounds fixed ratio', () => {
  it('100 pence = 1 pound', () => {
    assert.equal(penceToPounds(100), 1);
    assert.equal(poundsToPence(1), 100);
  });

  it('worked example: 250p → £2.50', () => {
    assert.equal(penceToPounds(250), 2.5);
    const result = calculatePenceToPounds(createExampleInput());
    assert.ok(result);
    assert.equal(result.pounds, 2.5);
    assert.equal(result.pence, 250);
    assert.equal(result.source, 'pence');
  });

  it('reverse: £3.75 → 375p', () => {
    assert.equal(poundsToPence(3.75), 375);
    const result = calculatePenceToPounds(
      base({ pence: '', pounds: '3.75', lastEdited: 'pounds' }),
    );
    assert.ok(result);
    assert.equal(result.pence, 375);
  });

  it('zero is valid', () => {
    const result = calculatePenceToPounds(
      base({ pence: '0', pounds: '', lastEdited: 'pence' }),
    );
    assert.ok(result);
    assert.equal(result.pounds, 0);
  });

  it('rejects negative and non-finite', () => {
    assert.equal(
      calculatePenceToPounds(base({ pence: '-1', lastEdited: 'pence' })),
      null,
    );
    assert.equal(
      calculatePenceToPounds(base({ pence: 'Infinity', lastEdited: 'pence' })),
      null,
    );
    const validation = validatePenceToPoundsInput(
      base({ pence: '-5', lastEdited: 'pence' }),
    );
    assert.equal(validation.isValid, false);
  });
});
