import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  KT_TO_KMH,
  KT_TO_MPH,
  calculateCrosswindDirection,
  calculateHeadwindComponent,
  calculateRelativeWindAngle,
  calculateRunwayHeading,
  calculateSignedCrosswind,
  calculateWindComponentsFromInput,
  convertWindSpeed,
  trueToMagnetic,
} from './calculation';
import {
  createEmptyInput,
  createExampleHeadAndCross,
  createExampleLeftCrosswind,
  createExampleTailwind,
} from './types';
import { validateCrosswindInputs } from './validation';

describe('Crosswind Calculator engine', () => {
  it('runway 36 → heading 0°', () => {
    assert.equal(calculateRunwayHeading(36), 0);
  });

  it('runway 27 → 270°', () => {
    assert.equal(calculateRunwayHeading(27), 270);
  });

  it('RWY 36 · wind 090 · 20 kt → 20 kt right, 0 head', () => {
    const r = calculateWindComponentsFromInput(createEmptyInput());
    assert.ok(r);
    assert.ok(Math.abs(r.signedCrosswindKnots - 20) < 1e-9);
    assert.equal(r.crosswindDirection, 'right');
    assert.ok(Math.abs(r.signedHeadwindKnots) < 1e-9);
  });

  it('RWY 27 · wind 300 · 20 kt → 10 right, ≈17.32 head', () => {
    const r = calculateWindComponentsFromInput(createExampleHeadAndCross());
    assert.ok(r);
    assert.ok(Math.abs(r.signedCrosswindKnots - 10) < 1e-9);
    assert.equal(r.crosswindDirection, 'right');
    assert.ok(Math.abs(r.headwindMagnitudeKnots - 17.3205080757) < 1e-6);
  });

  it('RWY 18 · wind 000 · 15 kt → 15 tailwind', () => {
    const r = calculateWindComponentsFromInput(createExampleTailwind());
    assert.ok(r);
    assert.ok(Math.abs(r.crosswindMagnitudeKnots) < 1e-9);
    assert.ok(Math.abs(r.tailwindMagnitudeKnots - 15) < 1e-9);
    assert.equal(r.longitudinalWindType, 'tailwind');
  });

  it('RWY 09 · wind 030 · 20 kt → ≈17.32 left, 10 head', () => {
    const r = calculateWindComponentsFromInput(createExampleLeftCrosswind());
    assert.ok(r);
    assert.ok(Math.abs(r.signedCrosswindKnots + 17.3205080757) < 1e-6);
    assert.equal(r.crosswindDirection, 'left');
    assert.ok(Math.abs(r.headwindMagnitudeKnots - 10) < 1e-9);
  });

  it('RWY 36 · wind 000 · 15 → 15 headwind', () => {
    const input = createEmptyInput();
    input.windDirection = '0';
    input.windSpeed = '15';
    const r = calculateWindComponentsFromInput(input)!;
    assert.ok(Math.abs(r.headwindMagnitudeKnots - 15) < 1e-9);
    assert.equal(r.longitudinalWindType, 'headwind');
  });

  it('RWY 36 · wind 180 · 15 → 15 tailwind', () => {
    const input = createEmptyInput();
    input.windDirection = '180';
    input.windSpeed = '15';
    const r = calculateWindComponentsFromInput(input)!;
    assert.ok(Math.abs(r.tailwindMagnitudeKnots - 15) < 1e-9);
  });

  it('calm wind → all zero', () => {
    const input = createEmptyInput();
    input.windSpeed = '0';
    const r = calculateWindComponentsFromInput(input)!;
    assert.equal(r.crosswindMagnitudeKnots, 0);
    assert.equal(r.headwindMagnitudeKnots, 0);
    assert.equal(r.tailwindMagnitudeKnots, 0);
  });

  it('relative angle wraparound', () => {
    assert.equal(calculateRelativeWindAngle(10, 350), 20);
    assert.equal(calculateRelativeWindAngle(350, 10), -20);
  });

  it('0° and 360° wind equivalent', () => {
    const a = createEmptyInput();
    a.windDirection = '0';
    a.windSpeed = '10';
    const b = { ...a, windDirection: '360' };
    const ra = calculateWindComponentsFromInput(a)!;
    const rb = calculateWindComponentsFromInput(b)!;
    assert.ok(
      Math.abs(ra.signedHeadwindKnots - rb.signedHeadwindKnots) < 1e-9,
    );
  });

  it('unit conversions', () => {
    assert.ok(Math.abs(convertWindSpeed(1, 'kt', 'km/h') - KT_TO_KMH) < 1e-12);
    assert.ok(Math.abs(convertWindSpeed(1, 'kt', 'mph') - KT_TO_MPH) < 1e-9);
    assert.ok(
      Math.abs(convertWindSpeed(1, 'kt', 'm/s') - 1852 / 3600) < 1e-12,
    );
  });

  it('true → magnetic conversion', () => {
    assert.equal(trueToMagnetic(100, 10), 90);
  });

  it('invalid runway 00 / 37', () => {
    const a = createEmptyInput();
    a.runwayNumber = '00';
    assert.ok(validateCrosswindInputs(a).errors.runwayNumber);
    a.runwayNumber = '37';
    assert.ok(validateCrosswindInputs(a).errors.runwayNumber);
  });

  it('negative wind speed', () => {
    const input = createEmptyInput();
    input.windSpeed = '-1';
    assert.ok(validateCrosswindInputs(input).errors.windSpeed);
  });

  it('invalid wind direction', () => {
    const input = createEmptyInput();
    input.windDirection = '400';
    assert.ok(validateCrosswindInputs(input).errors.windDirection);
  });

  it('signed helpers', () => {
    assert.equal(calculateCrosswindDirection(5), 'right');
    assert.equal(calculateCrosswindDirection(-5), 'left');
    assert.equal(calculateSignedCrosswind(20, 90), 20);
    assert.ok(Math.abs(calculateHeadwindComponent(20, 30) - 17.3205080757) < 1e-6);
  });
});
