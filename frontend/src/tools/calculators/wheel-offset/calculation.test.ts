import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateClearanceChange,
  calculatePositionChange,
  calculateWheelInnerPosition,
  calculateWheelOuterPosition,
  computeWheelOffset,
  convertLengthToMillimeters,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateWheelOffsetInputs } from './validation';

function approx(actual: number, expected: number, tol = 1e-9) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Wheel Offset Calculator engine', () => {
  it('7.5 in ET45 → 8.5 in ET35 → C=-2.7 · P=+22.7', () => {
    const r = computeWheelOffset({
      currentWidth: 7.5,
      currentWidthUnit: 'in',
      currentOffset: 45,
      currentOffsetUnit: 'mm',
      newWidth: 8.5,
      newWidthUnit: 'in',
      newOffset: 35,
      newOffsetUnit: 'mm',
    });
    approx(r.clearanceChangeMm, -2.7, 1e-9);
    approx(r.positionChangeMm, 22.7, 1e-9);
    approx(r.widthDifferenceMm, 25.4, 1e-9);
    approx(r.offsetDifferenceMm, -10, 1e-9);
  });

  it('identical wheels → 0 / 0', () => {
    const r = computeWheelOffset({
      currentWidth: 8,
      currentWidthUnit: 'in',
      currentOffset: 40,
      currentOffsetUnit: 'mm',
      newWidth: 8,
      newWidthUnit: 'in',
      newOffset: 40,
      newOffsetUnit: 'mm',
    });
    approx(r.clearanceChangeMm, 0);
    approx(r.positionChangeMm, 0);
  });

  it('same width, lower offset → +10 / +10', () => {
    const r = computeWheelOffset({
      currentWidth: 8,
      currentWidthUnit: 'in',
      currentOffset: 45,
      currentOffsetUnit: 'mm',
      newWidth: 8,
      newWidthUnit: 'in',
      newOffset: 35,
      newOffsetUnit: 'mm',
    });
    approx(r.clearanceChangeMm, 10);
    approx(r.positionChangeMm, 10);
  });

  it('same width, higher offset → -10 / -10', () => {
    const r = computeWheelOffset({
      currentWidth: 8,
      currentWidthUnit: 'in',
      currentOffset: 35,
      currentOffsetUnit: 'mm',
      newWidth: 8,
      newWidthUnit: 'in',
      newOffset: 45,
      newOffsetUnit: 'mm',
    });
    approx(r.clearanceChangeMm, -10);
    approx(r.positionChangeMm, -10);
  });

  it('wider wheel, same offset → -12.7 / +12.7', () => {
    const r = computeWheelOffset({
      currentWidth: 8,
      currentWidthUnit: 'in',
      currentOffset: 40,
      currentOffsetUnit: 'mm',
      newWidth: 9,
      newWidthUnit: 'in',
      newOffset: 40,
      newOffsetUnit: 'mm',
    });
    approx(r.clearanceChangeMm, -12.7, 1e-9);
    approx(r.positionChangeMm, 12.7, 1e-9);
  });

  it('negative offset 0 → -20 → +20 / +20', () => {
    const r = computeWheelOffset({
      currentWidth: 8,
      currentWidthUnit: 'in',
      currentOffset: 0,
      currentOffsetUnit: 'mm',
      newWidth: 8,
      newWidthUnit: 'in',
      newOffset: -20,
      newOffsetUnit: 'mm',
    });
    approx(r.clearanceChangeMm, 20);
    approx(r.positionChangeMm, 20);
  });

  it('8 in → 203.2 mm', () => {
    approx(convertLengthToMillimeters(8, 'in'), 203.2, 1e-9);
  });

  it('inner / outer helpers', () => {
    approx(calculateWheelInnerPosition(190.5, 45), 140.25);
    approx(calculateWheelOuterPosition(190.5, 45), 50.25);
    approx(calculateClearanceChange(140.25, 142.95), -2.7);
    approx(calculatePositionChange(72.95, 50.25), 22.7);
  });

  it('default fixture validates', () => {
    const v = validateWheelOffsetInputs(createEmptyInput());
    assert.equal(Object.keys(v.errors).length, 0);
    assert.ok(v.result);
    approx(v.result!.clearanceChangeMm, -2.7, 1e-9);
    approx(v.result!.positionChangeMm, 22.7, 1e-9);
  });

  it('negative width invalid', () => {
    const v = validateWheelOffsetInputs({
      ...createEmptyInput(),
      currentWidth: '-8',
    });
    assert.ok(v.errors.currentWidth);
    assert.equal(v.result, null);
  });

  it('zero width invalid', () => {
    const v = validateWheelOffsetInputs({
      ...createEmptyInput(),
      newWidth: '0',
    });
    assert.ok(v.errors.newWidth);
    assert.equal(v.result, null);
  });

  it('blank → no result', () => {
    const v = validateWheelOffsetInputs(createBlankInput());
    assert.equal(v.result, null);
  });
});
