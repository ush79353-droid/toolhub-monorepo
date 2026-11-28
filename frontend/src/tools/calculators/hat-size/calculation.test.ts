import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  convertCmToInches,
  convertInchesToCm,
  convertLengthToCm,
  formatFractionalHatSize,
  getAdultHatSize,
  getChildHatSize,
  calculateHatSizeResults,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateHeadCircumference } from './validation';

function approx(actual: number, expected: number, tol = 0.02) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Hat Size Calculator engine', () => {
  it('2.54 cm → 1 in', () => {
    approx(convertCmToInches(2.54), 1);
  });

  it('10 in → 25.4 cm', () => {
    approx(convertInchesToCm(10), 25.4);
  });

  it('adult 58 cm → L / 7¼ / 7⅛ / EU 58', () => {
    const r = calculateHatSizeResults({
      category: 'adult',
      headCircumferenceCm: 58,
    });
    assert.equal(r.international, 'L');
    assert.equal(r.us, '7¼');
    assert.equal(r.uk, '7⅛');
    assert.equal(r.eu, 58);
    assert.equal(r.isBetweenSizes, false);
  });

  it('adult 56 cm → M / 7 / 6⅞ / EU 56', () => {
    const r = calculateHatSizeResults({
      category: 'adult',
      headCircumferenceCm: 56,
    });
    assert.equal(r.international, 'M');
    assert.equal(r.us, '7');
    assert.equal(r.uk, '6⅞');
    assert.equal(r.eu, 56);
  });

  it('58 cm → ≈ 22.8346 in; size unchanged in inches path', () => {
    approx(convertCmToInches(58), 22.8346, 0.001);
    const fromIn = calculateHatSizeResults({
      category: 'adult',
      headCircumferenceCm: convertLengthToCm(convertCmToInches(58), 'in'),
    });
    assert.equal(fromIn.international, 'L');
    assert.equal(fromIn.us, '7¼');
  });

  it('58.5 cm between → recommend larger (59 cm row)', () => {
    const m = getAdultHatSize(58.5);
    assert.ok(m);
    assert.equal(m!.isBetweenSizes, true);
    assert.equal(m!.row.circumferenceCm, 59);
    assert.equal(m!.row.international, 'L');
    assert.equal(m!.row.us, '7⅜');
  });

  it('child chart match', () => {
    const m = getChildHatSize(45);
    assert.ok(m);
    assert.equal(m!.row.approximateAge, '6–12 months');
    const r = calculateHatSizeResults({
      category: 'child',
      headCircumferenceCm: 45,
    });
    assert.equal(r.childSizeLabel, '6–12 months');
    assert.equal(r.international, null);
  });

  it('negative circumference invalid', () => {
    const v = validateHeadCircumference({
      ...createEmptyInput(),
      headCircumference: '-5',
    });
    assert.ok(v.errors.headCircumference);
    assert.equal(v.result, null);
  });

  it('empty → no result', () => {
    const v = validateHeadCircumference(createBlankInput());
    assert.equal(v.result, null);
  });

  it('out of range adult', () => {
    const r = calculateHatSizeResults({
      category: 'adult',
      headCircumferenceCm: 40,
    });
    assert.equal(r.isOutOfRange, true);
    assert.equal(r.international, null);
  });

  it('fractional formatting 7.25 → 7¼', () => {
    assert.equal(formatFractionalHatSize(7.25), '7¼');
    assert.equal(formatFractionalHatSize(6.625), '6⅝');
    assert.equal(formatFractionalHatSize(7), '7');
  });

  it('zero invalid', () => {
    const v = validateHeadCircumference({
      ...createEmptyInput(),
      headCircumference: '0',
    });
    assert.ok(v.errors.headCircumference);
  });
});
