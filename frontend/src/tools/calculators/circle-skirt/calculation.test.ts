import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateWaistRadius,
  calculateOuterRadius,
  calculateHemCircumference,
  calculateRadialCuttingDimension,
  calculateCircleSkirtResults,
  convertLengthToCm,
  getCircleFraction,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateCircleSkirtInputs } from './validation';

function approx(actual: number, expected: number, tol = 0.02) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Circle Skirt Calculator engine', () => {
  it('full circle: W=75 → R≈11.94', () => {
    const R = calculateWaistRadius(75, 1);
    approx(R, 75 / (2 * Math.PI));
    approx(R, 11.94, 0.01);
    approx(calculateOuterRadius(R, 70), 81.94, 0.01);
  });

  it('half circle: W=75 → R≈23.87', () => {
    approx(calculateWaistRadius(75, 0.5), 75 / Math.PI, 0.01);
    approx(calculateWaistRadius(75, 0.5), 23.87, 0.01);
  });

  it('quarter circle: W=80 → R≈50.93', () => {
    approx(calculateWaistRadius(80, 0.25), (2 * 80) / Math.PI, 0.01);
    approx(calculateWaistRadius(80, 0.25), 50.93, 0.01);
  });

  it('three-quarter: W=75 → R≈15.92', () => {
    approx(calculateWaistRadius(75, 0.75), 75 / (1.5 * Math.PI), 0.01);
    approx(calculateWaistRadius(75, 0.75), 15.92, 0.01);
  });

  it('30 in → 76.2 cm', () => {
    approx(convertLengthToCm(30, 'in'), 76.2);
  });

  it('fractions', () => {
    assert.equal(getCircleFraction('full'), 1);
    assert.equal(getCircleFraction('threeQuarter'), 0.75);
    assert.equal(getCircleFraction('half'), 0.5);
    assert.equal(getCircleFraction('quarter'), 0.25);
  });

  it('hem circumference', () => {
    const R = calculateWaistRadius(75, 0.5);
    const outer = calculateOuterRadius(R, 70);
    const hem = calculateHemCircumference(outer, 0.5);
    approx(hem, Math.PI * outer);
  });

  it('allowances change cutting, not finished R', () => {
    const base = calculateCircleSkirtResults({
      skirtType: 'half',
      waistCm: 75,
      skirtLengthCm: 70,
      waistSeamAllowanceCm: 0,
      hemAllowanceCm: 0,
      fabricWidthCm: null,
    });
    const withA = calculateCircleSkirtResults({
      skirtType: 'half',
      waistCm: 75,
      skirtLengthCm: 70,
      waistSeamAllowanceCm: 1,
      hemAllowanceCm: 2,
      fabricWidthCm: null,
    });
    approx(base.waistRadiusCm, withA.waistRadiusCm, 1e-9);
    approx(base.finishedOuterRadiusCm, withA.finishedOuterRadiusCm, 1e-9);
    approx(
      withA.radialCuttingDimensionCm,
      calculateRadialCuttingDimension(base.waistRadiusCm, 70, 3),
      1e-9,
    );
  });

  it('narrow fabric warns', () => {
    const r = calculateCircleSkirtResults({
      skirtType: 'full',
      waistCm: 75,
      skirtLengthCm: 70,
      waistSeamAllowanceCm: 0,
      hemAllowanceCm: 0,
      fabricWidthCm: 50,
    });
    assert.ok(r.fabricEstimate);
    assert.equal(r.fabricEstimate!.layoutSupported, false);
    assert.ok(r.fabricEstimate!.warning);
  });

  it('empty → no result', () => {
    const v = validateCircleSkirtInputs(createBlankInput());
    assert.equal(v.result, null);
  });

  it('negative waist invalid', () => {
    const v = validateCircleSkirtInputs({
      ...createEmptyInput(),
      waist: '-75',
    });
    assert.ok(v.errors.waist);
    assert.equal(v.result, null);
  });

  it('zero waist invalid', () => {
    const v = validateCircleSkirtInputs({
      ...createEmptyInput(),
      waist: '0',
    });
    assert.ok(v.errors.waist);
  });

  it('type switch changes R', () => {
    const full = calculateWaistRadius(75, getCircleFraction('full'));
    const half = calculateWaistRadius(75, getCircleFraction('half'));
    assert.ok(half > full);
  });

  it('default example validates', () => {
    const v = validateCircleSkirtInputs(createEmptyInput());
    assert.ok(v.result);
    approx(v.result!.waistRadiusCm, 75 / (2 * Math.PI), 0.01);
  });
});
