import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  MM_PER_IN,
  calculateTireCircumference,
  calculateTireDiameter,
  calculateTireSidewallHeight,
  calculateTireDimensions,
  calculateTireSizeComparison,
  convertLength,
  generateTireCode,
  parseTireCode,
  calculateRevolutionsPerKm,
  calculateRevolutionsPerMile,
} from './calculation';
import { createEmptyInput } from './types';
import { validateTireSizeInputs } from './validation';

function approx(actual: number, expected: number, tol = 0.05) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`,
  );
}

describe('Tire Size Calculator engine', () => {
  it('225/65 R17 sidewall, diameter, circumference, revs', () => {
    const d = calculateTireDimensions(225, 'mm', 65, 'R', 17, 'in');
    approx(d.sidewallHeightMm, 146.25, 1e-9);
    approx(d.rimDiameterMm, 431.8, 1e-9);
    approx(d.overallDiameterMm, 724.3, 1e-9);
    approx(d.overallDiameterIn, 28.515748031496, 0.01);
    approx(d.circumferenceMm, Math.PI * 724.3, 0.05);
    approx(d.circumferenceMm, 2275.5, 0.5);
    approx(d.revolutionsPerKm, 439.5, 0.5);
    approx(d.revolutionsPerMile, 707.3, 0.5);
    assert.equal(d.tireCode, '225/65 R17');
  });

  it('205/55 R16 dimensions', () => {
    const d = calculateTireDimensions(205, 'mm', 55, 'R', 16, 'in');
    approx(d.sidewallHeightMm, 112.75, 1e-9);
    approx(d.rimDiameterMm, 406.4, 1e-9);
    approx(d.overallDiameterMm, 631.9, 1e-9);
  });

  it('identical comparison → zero deltas', () => {
    const a = calculateTireDimensions(225, 'mm', 65, 'R', 17, 'in');
    const c = calculateTireSizeComparison(a, a, 60, 'mph');
    assert.equal(c.diameterDifferenceMm, 0);
    assert.equal(c.diameterDifferencePercent, 0);
    assert.equal(c.speedDifference, 0);
    assert.equal(c.groundClearanceDifferenceMm, 0);
  });

  it('235/60 R18 vs 225/65 R17 larger diameter', () => {
    const orig = calculateTireDimensions(225, 'mm', 65, 'R', 17, 'in');
    const neu = calculateTireDimensions(235, 'mm', 60, 'R', 18, 'in');
    const c = calculateTireSizeComparison(orig, neu, 60, 'mph');
    assert.ok(c.diameterDifferenceMm > 0);
    assert.ok(c.groundClearanceDifferenceMm > 0);
    assert.ok(c.estimatedActualSpeed > 60);
    approx(
      c.estimatedActualSpeed,
      60 * (neu.overallDiameterMm / orig.overallDiameterMm),
      1e-9,
    );
  });

  it('25.4 mm = 1 in', () => {
    approx(convertLength(25.4, 'mm', 'in'), 1, 1e-12);
    approx(convertLength(1, 'in', 'mm'), MM_PER_IN, 1e-12);
  });

  it('parse and generate tire code', () => {
    const p = parseTireCode('225/65R17');
    assert.ok(p);
    assert.equal(p!.widthMm, 225);
    assert.equal(p!.aspectRatio, 65);
    assert.equal(p!.construction, 'R');
    assert.equal(p!.rimIn, 17);
    assert.equal(generateTireCode(225, 65, 'R', 17), '225/65 R17');
    const withMark = parseTireCode('225/65 R17 98H');
    assert.ok(withMark);
    assert.equal(withMark!.loadIndex, 98);
    assert.equal(withMark!.speedRating, 'H');
  });

  it('helpers match formulas', () => {
    const h = calculateTireSidewallHeight(225, 65);
    const rim = 17 * 25.4;
    const d = calculateTireDiameter(rim, h);
    const c = calculateTireCircumference(d);
    approx(calculateRevolutionsPerKm(c), 1_000_000 / c, 1e-12);
    approx(calculateRevolutionsPerMile(c), 1_609_344 / c, 1e-12);
  });

  it('default fixture validates', () => {
    const v = validateTireSizeInputs(createEmptyInput());
    assert.equal(Object.keys(v.errors).length, 0);
    assert.ok(v.result);
    approx(v.result!.primary.overallDiameterMm, 724.3, 0.05);
  });

  it('negative width invalid', () => {
    const v = validateTireSizeInputs({
      ...createEmptyInput(),
      primary: { ...createEmptyInput().primary, width: '-10' },
    });
    assert.ok(v.errors.width);
    assert.equal(v.result, null);
  });

  it('blank → no result', () => {
    const v = validateTireSizeInputs({
      ...createEmptyInput(),
      primary: {
        ...createEmptyInput().primary,
        width: '',
        aspectRatio: '',
        rimDiameter: '',
      },
    });
    assert.equal(v.result, null);
  });

  it('compare mode validates indicated speed', () => {
    const base = createEmptyInput();
    const v = validateTireSizeInputs({
      ...base,
      compare: true,
      indicatedSpeed: '0',
    });
    assert.ok(v.errors.indicatedSpeed);
  });

  it('invalid tire code parse', () => {
    assert.equal(parseTireCode('not-a-tire'), null);
  });
});
