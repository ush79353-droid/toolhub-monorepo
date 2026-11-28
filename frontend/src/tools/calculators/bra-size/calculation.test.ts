import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateBustUnderbustDifference,
  calculateBraSizeResults,
  convertLengthToCm,
  convertLength,
  formatBraSize,
  getSisterSizes,
  getBraSize,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateBraInputs } from './validation';

function approx(actual: number, expected: number, tol = 0.02) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Bra Size Calculator engine', () => {
  it('30 in → 76.2 cm', () => {
    approx(convertLengthToCm(30, 'in'), 76.2);
  });

  it('difference 90−75 = 15 cm', () => {
    approx(calculateBustUnderbustDifference(90, 75), 15);
  });

  it('US sister sizes around 34C → 32D / 36B', () => {
    const primary = {
      band: '34',
      cup: 'C',
      region: 'US' as const,
      fullSize: '34C',
    };
    const s = getSisterSizes(primary);
    assert.equal(s.smallerBand?.fullSize, '32D');
    assert.equal(s.largerBand?.fullSize, '36B');
  });

  it('unit switch preserves length', () => {
    const cm = 76.2;
    const inches = convertLength(cm, 'cm', 'in');
    approx(inches, 30);
    approx(convertLength(inches, 'in', 'cm'), 76.2, 1e-9);
  });

  it('US modern estimate for 75/90 cm yields a size', () => {
    const r = calculateBraSizeResults({
      underbustCm: 75,
      bustCm: 90,
      region: 'US',
      bandMethod: 'modern',
    });
    assert.ok(r);
    assert.ok(r!.estimatedSize.fullSize !== '—');
    assert.equal(r!.estimatedSize.region, 'US');
    assert.ok(r!.sisterSizes.primary.fullSize);
    assert.ok(r!.regionalConversions.UK);
    assert.ok(r!.regionalConversions.EU);
  });

  it('UK and EU produce region-labeled sizes', () => {
    for (const region of ['UK', 'EU', 'AU', 'FR'] as const) {
      const g = getBraSize({
        underbustCm: 75,
        bustCm: 90,
        region,
        bandMethod: 'modern',
      });
      assert.ok(g.size, region);
      assert.equal(g.size!.region, region);
    }
  });

  it('empty → no result', () => {
    const v = validateBraInputs(createBlankInput());
    assert.equal(v.result, null);
  });

  it('negative underbust invalid', () => {
    const v = validateBraInputs({
      ...createEmptyInput(),
      underbust: '-70',
    });
    assert.ok(v.errors.underbust);
    assert.equal(v.result, null);
  });

  it('zero bust invalid', () => {
    const v = validateBraInputs({
      ...createEmptyInput(),
      bust: '0',
    });
    assert.ok(v.errors.bust);
    assert.equal(v.result, null);
  });

  it('bust < underbust → warning, no invented cup', () => {
    const r = calculateBraSizeResults({
      underbustCm: 90,
      bustCm: 80,
      region: 'US',
      bandMethod: 'modern',
    });
    assert.ok(r);
    assert.equal(r!.estimatedSize.fullSize, '—');
    assert.ok(r!.warnings.some((w) => /smaller than underbust/i.test(w)));
  });

  it('out of range underbust', () => {
    const r = calculateBraSizeResults({
      underbustCm: 40,
      bustCm: 55,
      region: 'US',
      bandMethod: 'modern',
    });
    assert.ok(r);
    assert.equal(r!.outOfRange, true);
  });

  it('sister boundary at min band', () => {
    const s = getSisterSizes({
      band: '28',
      cup: 'A',
      region: 'US',
      fullSize: '28A',
    });
    assert.equal(s.smallerBand, null);
    assert.ok(s.largerBand);
  });

  it('formatBraSize', () => {
    assert.equal(
      formatBraSize({ band: '34', cup: 'C', region: 'US', fullSize: '34C' }),
      '34C (US)',
    );
  });

  it('default empty input validates', () => {
    const v = validateBraInputs(createEmptyInput());
    assert.ok(v.result);
    assert.ok(v.result!.disclaimer.length > 20);
  });
});
