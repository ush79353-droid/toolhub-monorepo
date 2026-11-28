import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  convertCmToInches,
  convertInchesToCm,
  convertFromCm,
  findBustSizeMatch,
  findWaistSizeMatch,
  findHipSizeMatch,
  findRecommendedDressSize,
  calculateDressSizeResults,
  generateDressFitGuidance,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateDressMeasurements } from './validation';

function approx(actual: number, expected: number, tol = 0.02) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Dress Size Calculator engine', () => {
  it('38 in → 96.52 cm', () => {
    approx(convertInchesToCm(38), 96.52);
  });

  it('96 cm → ≈37.795 in', () => {
    approx(convertCmToInches(96), 37.79527559, 0.01);
  });

  it('single chart match (example 96/78/102 → US 12)', () => {
    const r = calculateDressSizeResults({
      bustCm: 96,
      waistCm: 78,
      hipsCm: 102,
      fitPreference: 'regular',
    });
    assert.ok(r.recommended);
    assert.equal(r.recommended!.usSize, '12');
    assert.equal(r.recommended!.ukSize, '16');
    assert.equal(r.recommended!.euSize, '44');
    assert.equal(r.recommended!.internationalSize, 'M');
  });

  it('mixed: bust US8 · waist US10 · hips US12 → overall US12', () => {
    // B=91 (8), W=75 (10), H=104 (12)
    assert.equal(findBustSizeMatch(91)?.usSize, '8');
    assert.equal(findWaistSizeMatch(75)?.usSize, '10');
    assert.equal(findHipSizeMatch(104)?.usSize, '12');
    const rec = findRecommendedDressSize(91, 75, 104);
    assert.equal(rec?.usSize, '12');
    const r = calculateDressSizeResults({
      bustCm: 91,
      waistCm: 75,
      hipsCm: 104,
      fitPreference: 'regular',
    });
    assert.equal(r.recommended?.usSize, '12');
    assert.equal(r.mixedSizes, true);
  });

  it('international labels from same chart entry', () => {
    const r = calculateDressSizeResults({
      bustCm: 96,
      waistCm: 78,
      hipsCm: 102,
      fitPreference: 'regular',
    });
    assert.equal(r.recommended?.usSize, '12');
    assert.equal(r.recommended?.ukSize, '16');
    assert.equal(r.recommended?.euSize, '44');
    assert.equal(r.recommended?.internationalSize, 'M');
  });

  it('above chart → out of range, no fabricated size', () => {
    const r = calculateDressSizeResults({
      bustCm: 160,
      waistCm: 140,
      hipsCm: 160,
      fitPreference: 'regular',
    });
    assert.equal(r.recommended, null);
    assert.equal(r.outOfRange, true);
    assert.match(r.fitGuidance, /outside the supported range/i);
  });

  it('negative bust invalid', () => {
    const v = validateDressMeasurements({
      ...createEmptyInput(),
      bust: '-10',
    });
    assert.ok(v.errors.bust);
  });

  it('empty → no result', () => {
    const v = validateDressMeasurements(createBlankInput());
    assert.equal(v.result, null);
  });

  it('unit switch 100 cm ↔ ≈39.37 in', () => {
    approx(convertFromCm(100, 'in'), 39.37007874, 0.01);
    approx(convertInchesToCm(39.37007874), 100, 0.01);
  });

  it('fit preference changes guidance, not chart size', () => {
    const reg = calculateDressSizeResults({
      bustCm: 96,
      waistCm: 78,
      hipsCm: 102,
      fitPreference: 'regular',
    });
    const rel = calculateDressSizeResults({
      bustCm: 96,
      waistCm: 78,
      hipsCm: 102,
      fitPreference: 'relaxed',
    });
    assert.equal(reg.recommended?.usSize, rel.recommended?.usSize);
    assert.notEqual(reg.fitGuidance, rel.fitGuidance);
    assert.match(rel.fitGuidance, /Relaxed fit/i);
    const g = generateDressFitGuidance(
      'close',
      false,
      reg.recommended,
      reg.bustMatch,
      reg.waistMatch,
      reg.hipsMatch,
    );
    assert.match(g, /Close fit/i);
  });
});
