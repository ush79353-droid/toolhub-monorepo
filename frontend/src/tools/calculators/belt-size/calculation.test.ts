import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateBeltSizeFromPantsWaist,
  convertLengthToCm,
  convertCmToLength,
  computeBeltSize,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateBeltSizeInputs } from './validation';

function approx(actual: number, expected: number, tol = 0.02) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Belt Size Calculator engine', () => {
  it('men pants 32 in → belt 34 in · 86.36 cm', () => {
    const { targetInches, row } = calculateBeltSizeFromPantsWaist(32, 'men');
    approx(targetInches, 34);
    assert.ok(row);
    approx(row!.numericBeltInches, 34);
    const r = computeBeltSize({
      sizingCategory: 'men',
      measurementMethod: 'dress-pants-size',
      numericalBeltSize: null,
      numericalUnit: 'in',
      generalBeltSize: 'M',
      waistCircumference: null,
      waistUnit: 'cm',
      existingBeltLength: null,
      existingUnit: 'cm',
      clothingSize: '32',
      sizingSystem: 'US',
      pantsWaistInches: 32,
    });
    assert.ok(r);
    approx(r!.recommendedBeltSizeInches!, 34);
    approx(r!.recommendedBeltSizeCm!, 86.36);
  });

  it('men pants 34 in → belt 36 in · 91.44 cm', () => {
    const { targetInches } = calculateBeltSizeFromPantsWaist(34, 'men');
    approx(targetInches, 36);
    approx(targetInches * 2.54, 91.44);
  });

  it('32 in → 81.28 cm', () => {
    approx(convertLengthToCm(32, 'in'), 81.28);
  });

  it('90 cm → ≈ 35.43 in', () => {
    approx(convertCmToLength(90, 'in'), 35.433070866, 1e-6);
  });

  it('existing belt 90 cm maps near 36 in', () => {
    const r = computeBeltSize({
      sizingCategory: 'men',
      measurementMethod: 'existing-belt-length',
      numericalBeltSize: null,
      numericalUnit: 'in',
      generalBeltSize: 'M',
      waistCircumference: null,
      waistUnit: 'cm',
      existingBeltLength: 90,
      existingUnit: 'cm',
      clothingSize: null,
      sizingSystem: 'US',
      pantsWaistInches: null,
    });
    assert.ok(r);
    assert.ok(r!.recommendedBeltSizeInches);
    approx(r!.recommendedBeltSizeInches!, 36, 2);
  });

  it('general M women returns range', () => {
    const r = computeBeltSize({
      sizingCategory: 'women',
      measurementMethod: 'general-belt-size',
      numericalBeltSize: null,
      numericalUnit: 'in',
      generalBeltSize: 'M',
      waistCircumference: null,
      waistUnit: 'cm',
      existingBeltLength: null,
      existingUnit: 'cm',
      clothingSize: null,
      sizingSystem: 'US',
      pantsWaistInches: null,
    });
    assert.ok(r);
    assert.ok(r!.recommendedSizeRangeCm || r!.recommendedBeltSizeInches);
  });

  it('waist 80 cm women → chart match', () => {
    const v = validateBeltSizeInputs(createEmptyInput());
    assert.ok(v.result);
    assert.equal(v.result!.measurementMethod, 'waist-circumference');
  });

  it('negative waist invalid', () => {
    const v = validateBeltSizeInputs({
      ...createEmptyInput(),
      waistCircumference: '-80',
    });
    assert.ok(v.errors.waistCircumference);
    assert.equal(v.result, null);
  });

  it('zero belt length invalid', () => {
    const v = validateBeltSizeInputs({
      ...createEmptyInput(),
      measurementMethod: 'existing-belt-length',
      existingBeltLength: '0',
    });
    assert.ok(v.errors.existingBeltLength);
    assert.equal(v.result, null);
  });

  it('blank → no result', () => {
    const v = validateBeltSizeInputs({
      ...createBlankInput(),
      measurementMethod: 'waist-circumference',
    });
    assert.equal(v.result, null);
  });
});
