import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateSquareDiagonal,
  calculateSideFromDiagonal,
  calculateUnfinishedHSTSize,
  calculateTwoAtATimeRawSquare,
  calculateEightAtATimeRawSquare,
  calculateTraditionalHSTCuttingSize,
  calculateRequiredSquarePairs,
  calculateTotalFabricSquares,
  calculateHSTSurplus,
  convertLengthToInches,
  SQRT2,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateHSTInputs } from './validation';

function approx(actual: number, expected: number, tol = 0.0001) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Half Square Triangle Calculator engine', () => {
  it('diagonal 4√2', () => {
    approx(calculateSquareDiagonal(4), 4 * SQRT2);
  });

  it('side from diagonal ≈ 4', () => {
    approx(calculateSideFromDiagonal(4 * SQRT2), 4);
  });

  it('unfinished 4 + 2×0.25 = 4.5', () => {
    approx(calculateUnfinishedHSTSize(4, 0.25), 4.5);
  });

  it('two-at-a-time geometric ≈ 4.853553', () => {
    approx(calculateTwoAtATimeRawSquare(4, 0.25), 4 + 0.5 + 0.25 * SQRT2);
  });

  it('traditional two-at-a-time = 4.875', () => {
    approx(calculateTraditionalHSTCuttingSize(4, 'two-at-a-time'), 4.875);
  });

  it('eight-at-a-time geometric ≈ 9.353553', () => {
    approx(
      calculateEightAtATimeRawSquare(4, 0.25),
      8 + 1 + 0.25 * SQRT2,
    );
  });

  it('traditional eight-at-a-time = 9.75', () => {
    approx(calculateTraditionalHSTCuttingSize(4, 'eight-at-a-time'), 9.75);
  });

  it('20 HST two-at-a-time → 10 pairs · 20 squares', () => {
    assert.equal(calculateRequiredSquarePairs(20, 'two-at-a-time'), 10);
    assert.equal(calculateTotalFabricSquares(10), 20);
  });

  it('20 HST eight-at-a-time → 3 pairs · 6 squares · surplus 4', () => {
    assert.equal(calculateRequiredSquarePairs(20, 'eight-at-a-time'), 3);
    assert.equal(calculateTotalFabricSquares(3), 6);
    assert.equal(calculateHSTSurplus(3, 'eight-at-a-time', 20), 4);
  });

  it('2.54 cm → 1 in', () => {
    approx(convertLengthToInches(2.54, 'cm'), 1);
  });

  it('empty → no result', () => {
    const v = validateHSTInputs(createBlankInput());
    assert.equal(v.result, null);
  });

  it('worked traditional 4 in finished', () => {
    const v = validateHSTInputs(createEmptyInput());
    assert.ok(v.result);
    approx(v.result!.finishedSizeIn, 4);
    approx(v.result!.unfinishedSizeIn, 4.5);
    approx(v.result!.rawSquareSizeIn, 4.875);
    assert.equal(v.result!.blocksPerPair, 2);
  });

  it('zero finished invalid', () => {
    const v = validateHSTInputs({
      ...createEmptyInput(),
      finishedSize: '0',
    });
    assert.ok(v.errors.finishedSize);
  });
});
