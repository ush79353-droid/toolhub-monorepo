import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateCrossStitchResults,
  calculateRequiredFabricHeight,
  calculateRequiredFabricWidth,
  calculateTotalPatternPositions,
  calculateThreadRequirements,
  convertLengthToCm,
  getEffectiveStitchDensity,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateCrossStitchInputs } from './validation';

function approx(actual: number, expected: number, tol = 0.02) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Cross-Stitch Calculator engine', () => {
  it('14-count Aida over 1: 100×80 → ~7.14×5.71 in', () => {
    const r = calculateCrossStitchResults({
      patternWidth: 100,
      patternHeight: 80,
      fabricCount: 14,
      stitchOver: 1,
      extraFabricCm: 8,
    });
    approx(r.effectiveStitchesPerInch, 14);
    approx(r.finishedWidthCm / 2.54, 100 / 14, 0.01);
    approx(r.finishedHeightCm / 2.54, 80 / 14, 0.01);
    approx(r.finishedWidthCm, 18.14, 0.05);
    approx(r.finishedHeightCm, 14.51, 0.05);
    approx(r.fabricWidthCm, 34.14, 0.05);
    approx(r.fabricHeightCm, 30.51, 0.05);
    assert.equal(r.totalPatternPositions, 8000);
  });

  it('28-count over 2 → same density as 14 over 1', () => {
    approx(getEffectiveStitchDensity(28, 2), 14);
    const r = calculateCrossStitchResults({
      patternWidth: 100,
      patternHeight: 80,
      fabricCount: 28,
      stitchOver: 2,
      extraFabricCm: 0,
    });
    approx(r.finishedWidthCm / 2.54, 100 / 14, 0.01);
  });

  it('32-count over 2 → 16 spi', () => {
    approx(getEffectiveStitchDensity(32, 2), 16);
  });

  it('fabric allowance 20×15 + 8/side → 36×31', () => {
    approx(calculateRequiredFabricWidth(20, 8), 36);
    approx(calculateRequiredFabricHeight(15, 8), 31);
  });

  it('total positions 100×80 = 8000', () => {
    assert.equal(calculateTotalPatternPositions(100, 80), 8000);
  });

  it('10 in → 25.4 cm', () => {
    approx(convertLengthToCm(10, 'in'), 25.4);
  });

  it('fabric count 0 invalid', () => {
    const v = validateCrossStitchInputs({
      ...createEmptyInput(),
      fabricCount: '0',
    });
    assert.ok(v.errors.fabricCount);
    assert.equal(v.result, null);
  });

  it('negative width invalid', () => {
    const v = validateCrossStitchInputs({
      ...createEmptyInput(),
      patternWidth: '-10',
    });
    assert.ok(v.errors.patternWidth);
  });

  it('empty → no result', () => {
    const v = validateCrossStitchInputs(createBlankInput());
    assert.equal(v.result, null);
  });

  it('stitch over change alters finished size', () => {
    const a = calculateCrossStitchResults({
      patternWidth: 100,
      patternHeight: 80,
      fabricCount: 28,
      stitchOver: 1,
      extraFabricCm: 0,
    });
    const b = calculateCrossStitchResults({
      patternWidth: 100,
      patternHeight: 80,
      fabricCount: 28,
      stitchOver: 2,
      extraFabricCm: 0,
    });
    assert.ok(a.finishedWidthCm < b.finishedWidthCm);
  });

  it('allowance changes fabric only', () => {
    const a = calculateCrossStitchResults({
      patternWidth: 100,
      patternHeight: 80,
      fabricCount: 14,
      stitchOver: 1,
      extraFabricCm: 0,
    });
    const b = calculateCrossStitchResults({
      patternWidth: 100,
      patternHeight: 80,
      fabricCount: 14,
      stitchOver: 1,
      extraFabricCm: 8,
    });
    approx(a.finishedWidthCm, b.finishedWidthCm, 1e-9);
    assert.ok(b.fabricWidthCm > a.fabricWidthCm);
  });

  it('thread estimator skeins', () => {
    const t = calculateThreadRequirements({
      totalPositions: 8000,
      coveragePercentage: 50,
      flossStrands: 2,
      strandLengthPerCrossCm: 1,
      wastePercentage: 0,
      skeinLengthCm: 800,
      strandsPerSkein: 6,
    });
    // N=4000, L=4000*1*2=8000, available=800*(6/2)=2400 → ceil(8000/2400)=4
    assert.equal(t.estimatedCompletedCrosses, 4000);
    assert.equal(t.estimatedSkeins, 4);
  });
});
