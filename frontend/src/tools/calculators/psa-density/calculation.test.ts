import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  ELLIPSOID_K,
  ellipsoidVolumeMl,
  formatDensity,
  psaDensity,
} from './calculation';
import { createExampleInput } from './types';
import { validatePsaDensityInput } from './validation';

describe('psa-density', () => {
  it('4×3×5 cm ellipsoid → 10π mL', () => {
    const ml = ellipsoidVolumeMl(4, 3, 5);
    assert.ok(Math.abs(ml - 4 * 3 * 5 * ELLIPSOID_K) < 1e-12);
    assert.ok(Math.abs(ml - 10 * Math.PI) < 1e-12);
  });

  it('PSA 3.1416 over 10π volume → 0.10', () => {
    const vol = ellipsoidVolumeMl(4, 3, 5);
    const d = psaDensity(3.1416, vol);
    assert.ok(d != null);
    assert.equal(formatDensity(d), '0.10');
  });

  it('example input validates density', () => {
    const { errors, result } = validatePsaDensityInput(createExampleInput());
    assert.equal(Object.keys(errors).length, 0);
    assert.ok(result);
    assert.equal(result!.formattedPsaDensity, '0.10');
  });

  it('direct volume without dimensions', () => {
    const { result } = validatePsaDensityInput({
      ...createExampleInput(),
      length: '',
      width: '',
      height: '',
      prostateVolume: '40',
      volumeManual: true,
    });
    assert.ok(result);
    assert.equal(result!.formattedPsaDensity, '0.08');
  });
});