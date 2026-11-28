import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  convertCmToInches,
  convertInchesToCm,
  calculateFlatWaistbandCircumference,
  findMatchingJeansWaistSize,
  findMatchingJeansInseamLength,
  calculateJeansSizeResults,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateJeansInputs } from './validation';

function approx(actual: number, expected: number, tol = 0.02) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Jeans Size Calculator engine', () => {
  it('32 in → 81.28 cm', () => {
    approx(convertInchesToCm(32), 81.28);
  });

  it('81.28 cm → 32 in', () => {
    approx(convertCmToInches(81.28), 32);
  });

  it('flat 16 in width → 32 in circumference', () => {
    const flatCm = convertInchesToCm(16);
    approx(calculateFlatWaistbandCircumference(flatCm), convertInchesToCm(32));
  });

  it('30 in inseam → 76.2 cm', () => {
    approx(convertInchesToCm(30), 76.2);
  });

  it('men waist 82 cm → W32', () => {
    const row = findMatchingJeansWaistSize(82, 'men');
    assert.equal(row?.waistLabel, 'W32');
  });

  it('women waist 70 cm → W28 / US 8', () => {
    const row = findMatchingJeansWaistSize(70, 'women');
    assert.ok(row);
    assert.equal(row!.waistLabel, 'W28');
    assert.equal((row as { us: string }).us, '8');
    assert.equal((row as { uk: string }).uk, '12');
    assert.equal((row as { eu: string }).eu, '40');
  });

  it('regional women result', () => {
    const r = calculateJeansSizeResults({
      category: 'women',
      measurementMethod: 'body',
      waistInputCm: 70,
      inseamCm: 81.28,
      hipsCm: null,
      preferredRegion: 'US',
      fit: 'regular',
      rise: 'mid',
    });
    assert.equal(r.waistSize, 'W28');
    assert.equal(r.usSize, '8');
    assert.equal(r.inseamSize, 'L32');
    assert.equal(r.combinedSize, 'W28 × L32');
  });

  it('between waist sizes', () => {
    // men's W32 max 84 exclusive → 83.5 near boundary
    const r = calculateJeansSizeResults({
      category: 'men',
      measurementMethod: 'body',
      waistInputCm: 83.5,
      inseamCm: 81,
      hipsCm: null,
      preferredRegion: 'INT',
      fit: 'regular',
      rise: 'mid',
    });
    assert.equal(r.waistSize, 'W32');
    assert.equal(r.isBetweenWaist, true);
    assert.ok(r.alternativeSizes.length > 0);
  });

  it('negative waist invalid', () => {
    const v = validateJeansInputs({
      ...createEmptyInput(),
      waist: '-10',
    });
    assert.ok(v.errors.waist);
    assert.equal(v.result, null);
  });

  it('unit switch preserves size', () => {
    const a = calculateJeansSizeResults({
      category: 'men',
      measurementMethod: 'body',
      waistInputCm: 81.28,
      inseamCm: 81.28,
      hipsCm: null,
      preferredRegion: 'US',
      fit: 'regular',
      rise: 'mid',
    });
    const b = calculateJeansSizeResults({
      category: 'men',
      measurementMethod: 'body',
      waistInputCm: convertInchesToCm(32),
      inseamCm: convertInchesToCm(32),
      hipsCm: null,
      preferredRegion: 'US',
      fit: 'regular',
      rise: 'mid',
    });
    assert.equal(a.waistSize, b.waistSize);
    assert.equal(a.inseamSize, b.inseamSize);
  });

  it('existing jeans flat mode doubles waist', () => {
    const r = calculateJeansSizeResults({
      category: 'men',
      measurementMethod: 'existing-jeans',
      waistInputCm: convertInchesToCm(16),
      inseamCm: convertInchesToCm(32),
      hipsCm: null,
      preferredRegion: 'US',
      fit: 'regular',
      rise: 'mid',
    });
    assert.equal(r.usedGarmentWaist, true);
    assert.equal(r.waistSize, 'W32');
  });

  it('empty → no result', () => {
    assert.equal(validateJeansInputs(createBlankInput()).result, null);
  });

  it('inseam nearest L30', () => {
    const m = findMatchingJeansInseamLength(convertInchesToCm(30));
    assert.equal(m.primary, 'L30');
  });
});
