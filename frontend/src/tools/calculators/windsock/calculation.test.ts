import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateWindSpeedFromSegments,
  convertKnotsToFps,
  convertKnotsToKmh,
  convertKnotsToMph,
  convertKnotsToMs,
  convertKmhToKnots,
  computeWindsockFromKnots,
  computeWindsockFromSegments,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateWindsockInputs } from './validation';

function approx(actual: number, expected: number, tol = 0.02) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Windsock Calculator engine', () => {
  it('0 segments → 0 kn', () => {
    approx(calculateWindSpeedFromSegments(0), 0);
  });

  it('1 segment → 3 kn · ~3.45 mph · ~5.56 km/h', () => {
    const r = computeWindsockFromSegments(1);
    approx(r.windSpeedKnots, 3);
    approx(r.windSpeedMph, 3.45, 0.01);
    approx(r.windSpeedKmh, 5.56, 0.01);
  });

  it('2 segments → 6 kn', () => {
    const r = computeWindsockFromSegments(2);
    approx(r.windSpeedKnots, 6);
    approx(r.windSpeedMph, 6.9, 0.02);
    approx(r.windSpeedKmh, 11.11, 0.02);
  });

  it('3 segments → 9 kn · ~10.36 mph · ~16.67 km/h', () => {
    const r = computeWindsockFromSegments(3);
    approx(r.windSpeedKnots, 9);
    approx(r.windSpeedMph, 10.36, 0.01);
    approx(r.windSpeedKmh, 16.67, 0.01);
    approx(r.windSpeedMs, 4.63, 0.01);
  });

  it('4 segments → 12 kn', () => {
    const r = computeWindsockFromSegments(4);
    approx(r.windSpeedKnots, 12);
    approx(r.windSpeedMph, 13.81, 0.02);
    approx(r.windSpeedKmh, 22.22, 0.02);
  });

  it('5 segments → 15 kn', () => {
    const r = computeWindsockFromSegments(5);
    approx(r.windSpeedKnots, 15);
    approx(r.windSpeedMph, 17.26, 0.02);
    approx(r.windSpeedKmh, 27.78, 0.02);
  });

  it('10 kn conversions', () => {
    approx(convertKnotsToMph(10), 11.5077945, 1e-6);
    approx(convertKnotsToKmh(10), 18.52, 1e-9);
    approx(convertKnotsToMs(10), 5.1444444, 1e-6);
    approx(convertKnotsToFps(10), 16.8780986, 1e-6);
  });

  it('18.52 km/h → ~10 kn', () => {
    approx(convertKmhToKnots(18.52), 10, 1e-9);
  });

  it('25 kn above segment model', () => {
    const r = computeWindsockFromKnots(25);
    assert.equal(r.isAboveSegmentModelRange, true);
    assert.equal(r.estimatedSegments, 5);
    approx(r.windSpeedKmh, 46.3, 0.01);
  });

  it('default fixture validates', () => {
    const v = validateWindsockInputs(createEmptyInput());
    assert.ok(v.result);
    approx(v.result!.windSpeedKnots, 9);
  });

  it('negative segments invalid', () => {
    const v = validateWindsockInputs({
      ...createEmptyInput(),
      segments: '-1',
      calculationSource: 'segments',
    });
    assert.ok(v.errors.segments);
    assert.equal(v.result, null);
  });

  it('6 segments invalid', () => {
    const v = validateWindsockInputs({
      ...createEmptyInput(),
      segments: '6',
      calculationSource: 'segments',
    });
    assert.ok(v.errors.segments);
    assert.equal(v.result, null);
  });

  it('decimal segments invalid', () => {
    const v = validateWindsockInputs({
      ...createEmptyInput(),
      segments: '2.5',
      calculationSource: 'segments',
    });
    assert.ok(v.errors.segments);
    assert.equal(v.result, null);
  });

  it('blank → no result', () => {
    const v = validateWindsockInputs(createBlankInput());
    assert.equal(v.result, null);
  });
});
