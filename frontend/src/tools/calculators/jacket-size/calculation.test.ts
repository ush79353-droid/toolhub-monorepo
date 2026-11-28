import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  convertCircumferenceToCm,
  convertCircumferenceFromCm,
  convertHeightToCm,
  findMatchingSizeRange,
  calculateJacketSizeResults,
  calculateJacketLengthCategory,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateJacketInputs } from './validation';

function approx(actual: number, expected: number, tol = 0.02) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Jacket Size Calculator engine', () => {
  it('40 in → 101.6 cm', () => {
    approx(convertCircumferenceToCm(40, 'in'), 101.6);
  });

  it('100 cm → ≈ 39.37 in', () => {
    approx(convertCircumferenceFromCm(100, 'in'), 39.37, 0.01);
  });

  it('5 ft 10 in → 177.8 cm', () => {
    approx(convertHeightToCm(5, 'ft', 10), 177.8);
  });

  it('men 100 cm chest → US 40 / EU 50 / M', () => {
    const row = findMatchingSizeRange(100, 'men');
    assert.ok(row);
    assert.equal(row!.us, '40');
    assert.equal(row!.eu, '50');
    assert.equal(row!.international, 'M');
  });

  it('women 90 cm bust → US 6 / EU 38 / S', () => {
    const row = findMatchingSizeRange(90, 'women');
    assert.ok(row);
    assert.equal(row!.us, '6');
    assert.equal(row!.eu, '38');
    assert.equal(row!.international, 'S');
  });

  it('regional equivalents on result', () => {
    const r = calculateJacketSizeResults({
      category: 'men',
      chestCm: 100,
      heightCm: 178,
      hipsCm: null,
      fitPreference: 'regular',
      jacketStyle: 'suit',
      preferredRegion: 'EU',
    });
    assert.equal(r.euSize, '50');
    assert.equal(r.usSize, '40');
    assert.equal(r.primaryDisplay, 'EU 50');
    assert.equal(r.jacketLength, 'regular');
  });

  it('boundary near max → between sizes', () => {
    // men's 40 band ends at 104 exclusive → 103.5 near next
    const r = calculateJacketSizeResults({
      category: 'men',
      chestCm: 103.5,
      heightCm: 178,
      hipsCm: null,
      fitPreference: 'regular',
      jacketStyle: 'suit',
      preferredRegion: 'INT',
    });
    assert.equal(r.usSize, '40');
    assert.equal(r.isBetweenSizes, true);
    assert.ok(r.alternativeSizes.length > 0);
  });

  it('negative chest invalid', () => {
    const v = validateJacketInputs({
      ...createEmptyInput(),
      chest: '-5',
    });
    assert.ok(v.errors.chest);
    assert.equal(v.result, null);
  });

  it('missing height still sizes from chest', () => {
    const v = validateJacketInputs({
      ...createEmptyInput(),
      height: '',
      chest: '100',
    });
    assert.equal(v.result?.usSize, '40');
    assert.equal(v.result?.jacketLength, null);
  });

  it('unit switch preserves size', () => {
    const cm = calculateJacketSizeResults({
      category: 'men',
      chestCm: 101.6,
      heightCm: null,
      hipsCm: null,
      fitPreference: 'regular',
      jacketStyle: 'suit',
      preferredRegion: 'US',
    });
    const fromIn = convertCircumferenceToCm(40, 'in');
    const inchPath = calculateJacketSizeResults({
      category: 'men',
      chestCm: fromIn,
      heightCm: null,
      hipsCm: null,
      fitPreference: 'regular',
      jacketStyle: 'suit',
      preferredRegion: 'US',
    });
    assert.equal(cm.usSize, inchPath.usSize);
  });

  it('empty → no result', () => {
    const v = validateJacketInputs(createBlankInput());
    assert.equal(v.result, null);
  });

  it('length thresholds men', () => {
    assert.equal(calculateJacketLengthCategory(165, 'men'), 'short');
    assert.equal(calculateJacketLengthCategory(178, 'men'), 'regular');
    assert.equal(calculateJacketLengthCategory(190, 'men'), 'long');
  });
});
