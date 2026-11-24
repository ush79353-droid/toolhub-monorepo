import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  SHAPE_COEFFICIENT,
  formatVolume,
  toCm,
  volumeMlFromCm,
} from './calculation';
import { createEmptyInput } from './types';
import { validateBladderVolumeInput } from './validation';

describe('bladder-volume', () => {
  it('5×4×3 cm ellipsoid 0.81 → 48.6 mL', () => {
    const ml = volumeMlFromCm(5, 4, 3, SHAPE_COEFFICIENT.ellipsoid);
    assert.equal(ml, 48.6);
    assert.equal(formatVolume(ml, 'mL'), '48.6');
  });

  it('mm conversion preserves physical size', () => {
    assert.equal(toCm(50, 'mm'), 5);
    const ml = volumeMlFromCm(toCm(50, 'mm'), toCm(40, 'mm'), toCm(30, 'mm'), 0.81);
    assert.equal(ml, 48.6);
  });

  it('incomplete dimensions yield no result', () => {
    const input = { ...createEmptyInput(), dim1: '5', dim2: '4' };
    const { result } = validateBladderVolumeInput(input);
    assert.equal(result, null);
  });

  it('shape change keeps dimensions; cuboid coefficient applied', () => {
    const input = {
      ...createEmptyInput(),
      shape: 'cuboid' as const,
      dim1: '5',
      dim2: '4',
      dim3: '3',
    };
    const { result } = validateBladderVolumeInput(input);
    assert.ok(result);
    assert.equal(result!.coefficient, 0.89);
    assert.equal(result!.volumeMl, 5 * 4 * 3 * 0.89);
  });

  it('rejects non-positive dimension', () => {
    const { errors, result } = validateBladderVolumeInput({
      ...createEmptyInput(),
      dim1: '0',
      dim2: '4',
      dim3: '3',
    });
    assert.equal(result, null);
    assert.ok(errors.dim1);
  });
});
