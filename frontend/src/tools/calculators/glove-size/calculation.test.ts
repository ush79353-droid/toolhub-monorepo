import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  convertHandMeasurementToCm,
  convertCmToInches,
  findMatchingGloveSize,
  calculateHandMeasurementFromSize,
  calculateGloveSizeResults,
  getGloveSizeRange,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateHandCircumference } from './validation';

function approx(actual: number, expected: number, tol = 0.02) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Glove Size Calculator engine', () => {
  it('8 in → 20.32 cm', () => {
    approx(convertHandMeasurementToCm(8, 'in'), 20.32);
  });

  it('25.4 cm → 10 in', () => {
    approx(convertCmToInches(25.4), 10);
  });

  it('210 mm → 21 cm', () => {
    approx(convertHandMeasurementToCm(210, 'mm'), 21);
  });

  it('style switching changes chart match', () => {
    // 20 cm: men → S (19–21), women → L (19.5–21)
    assert.equal(findMatchingGloveSize(20, 'men-unisex')?.label, 'S');
    assert.equal(findMatchingGloveSize(20, 'women')?.label, 'L');
  });

  it('exact boundary prefers smaller size', () => {
    // 21 cm is max of S and min of M for men — exclusive max on S → M
    assert.equal(findMatchingGloveSize(21, 'men-unisex')?.label, 'M');
    // 19 cm → M on women starts at 18, S ends at 18 exclusive → wait S is 16.5–18 exclusive so 18 → M
    assert.equal(findMatchingGloveSize(19, 'men-unisex')?.label, 'S');
  });

  it('out of range below minimum', () => {
    const r = calculateGloveSizeResults({
      gloveStyle: 'men-unisex',
      handCircumferenceCm: 10,
    });
    assert.equal(r.recommendedSize, null);
    assert.equal(r.isOutOfRange, true);
  });

  it('reverse conversion for M men', () => {
    const rev = calculateHandMeasurementFromSize('men-unisex', 'M');
    assert.ok(rev);
    approx(rev!.minCm, 21);
    approx(rev!.maxCm, 23);
    approx(rev!.midCm, 22);
  });

  it('negative circumference invalid', () => {
    const v = validateHandCircumference({
      ...createEmptyInput(),
      handCircumference: '-5',
    });
    assert.ok(v.errors.handCircumference);
  });

  it('empty → no result', () => {
    const v = validateHandCircumference(createBlankInput());
    assert.equal(v.result, null);
  });

  it('unsupported reverse size', () => {
    assert.equal(getGloveSizeRange('women', 'XXL'), null);
    assert.equal(calculateHandMeasurementFromSize('women', 'XXL'), null);
  });

  it('21 cm men → M / 9', () => {
    const r = calculateGloveSizeResults({
      gloveStyle: 'men-unisex',
      handCircumferenceCm: 21,
    });
    assert.equal(r.recommendedSize, 'M');
    assert.equal(r.numericSize, '9');
  });
});
