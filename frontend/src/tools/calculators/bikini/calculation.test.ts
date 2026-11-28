import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateBikiniRecommendations,
  calculateWaistToHipRatio,
  calculateBustToHipRatio,
  classifyBodyShape,
  calculateBodyProportions,
  convertLengthToCm,
  convertLength,
  filterRecommendationsByPreferences,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateBikiniInputs } from './validation';

function approx(actual: number, expected: number, tol = 0.02) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Bikini Calculator engine', () => {
  it('36 in → 91.44 cm', () => {
    approx(convertLengthToCm(36, 'in'), 91.44);
  });

  it('WHR 70/100 = 0.70', () => {
    approx(calculateWaistToHipRatio(70, 100), 0.7);
  });

  it('BHR 95/100 = 0.95', () => {
    approx(calculateBustToHipRatio(95, 100), 0.95);
  });

  it('hourglass-like proportions', () => {
    const m = calculateBodyProportions(95, 70, 88, 96);
    const shape = classifyBodyShape(m);
    assert.equal(shape, 'hourglass');
    const r = calculateBikiniRecommendations({
      bustCm: 95,
      waistCm: 70,
      highHipCm: 88,
      hipCm: 96,
      coverage: '',
      support: '',
      style: '',
      activity: '',
    });
    assert.equal(r.bodyShape, 'hourglass');
    assert.ok(r.recommendedTops.length > 0);
    assert.ok(r.recommendedBottoms.length > 0);
  });

  it('hip-dominant with defined waist → bottom-hourglass', () => {
    const m = calculateBodyProportions(85, 70, 94, 105);
    const shape = classifyBodyShape(m);
    assert.equal(shape, 'bottom-hourglass');
  });

  it('upper-body-dominant → inverted-triangle', () => {
    const m = calculateBodyProportions(105, 80, 88, 92);
    assert.equal(classifyBodyShape(m), 'inverted-triangle');
  });

  it('rectangle-like proportions', () => {
    const m = calculateBodyProportions(90, 84, 91, 92);
    assert.equal(classifyBodyShape(m), 'rectangle');
  });

  it('spoon when high-hip close to hip', () => {
    const m = calculateBodyProportions(85, 72, 100, 105);
    assert.equal(classifyBodyShape(m), 'spoon');
  });

  it('negative waist invalid', () => {
    const v = validateBikiniInputs({
      ...createEmptyInput(),
      waist: '-50',
    });
    assert.ok(v.errors.waist);
    assert.equal(v.result, null);
  });

  it('zero hip invalid', () => {
    const v = validateBikiniInputs({
      ...createEmptyInput(),
      hip: '0',
    });
    assert.ok(v.errors.hip);
    assert.equal(v.result, null);
  });

  it('empty → no result', () => {
    const v = validateBikiniInputs(createBlankInput());
    assert.equal(v.result, null);
  });

  it('unit switch preserves length', () => {
    const cm = 91.44;
    const inches = convertLength(cm, 'cm', 'in');
    approx(inches, 36);
    approx(convertLength(inches, 'in', 'cm'), 91.44, 1e-9);
  });

  it('preferences reorder without changing shape', () => {
    const base = calculateBikiniRecommendations({
      bustCm: 95,
      waistCm: 70,
      highHipCm: 88,
      hipCm: 96,
      coverage: '',
      support: '',
      style: '',
      activity: '',
    });
    const pref = calculateBikiniRecommendations({
      bustCm: 95,
      waistCm: 70,
      highHipCm: 88,
      hipCm: 96,
      coverage: 'full',
      support: 'high',
      style: 'sporty',
      activity: 'swimming',
    });
    assert.equal(base.bodyShape, pref.bodyShape);
    const sorted = filterRecommendationsByPreferences(
      base.recommendedTops,
      'full',
      'high',
      'sporty',
      'swimming',
    );
    assert.equal(sorted.length, base.recommendedTops.length);
  });
});
