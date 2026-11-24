import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  BULLET_K,
  ELLIPSOID_K,
  bulletVolumeMl,
  ellipsoidVolumeMl,
  psaDensity,
} from './calculation';
import { createEmptyInput } from './types';
import { validateProstateVolumeInput } from './validation';

describe('prostate-volume', () => {
  it('4×3×5 cm ellipsoid → ≈31.42 mL', () => {
    const ml = ellipsoidVolumeMl(4, 3, 5);
    assert.ok(Math.abs(ml - 4 * 3 * 5 * ELLIPSOID_K) < 1e-12);
    assert.equal(ml.toFixed(2), '31.42');
  });

  it('bullet uses 5π/24', () => {
    const ml = bulletVolumeMl(4, 3, 5);
    assert.ok(Math.abs(ml - 4 * 3 * 5 * BULLET_K) < 1e-12);
    assert.ok(ml > ellipsoidVolumeMl(4, 3, 5));
  });

  it('zero-volume suppressed via validation', () => {
    const { result } = validateProstateVolumeInput({
      ...createEmptyInput(),
      length: '0',
      height: '3',
      width: '5',
    });
    assert.equal(result, null);
  });

  it('compare mode returns both volumes', () => {
    const { result } = validateProstateVolumeInput({
      ...createEmptyInput(),
      model: 'compare',
      length: '4',
      height: '3',
      width: '5',
    });
    assert.ok(result);
    assert.ok(result!.ellipsoidMl != null && result!.bulletMl != null);
  });

  it('PSA density = PSA / volume', () => {
    assert.equal(psaDensity(4, 40), 0.1);
  });
});
