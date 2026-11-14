import assert from 'node:assert/strict';
import {
  calculateCubicMeter,
  calculateMissingDimension,
  cubicFeetToCubicMeters,
  cubicMetersToCubicFeet,
  cubicMetersToVolume,
  formatMeasure,
  lengthToMeters,
  volumeToCubicMeters,
} from './calculation';
import {
  CUBIC_METERS_PER_CUBIC_FOOT,
  DEFAULT_CUBIC_METER_INPUT,
} from './types';
import { validateCubicMeter, validateMissingDimension } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(Math.abs(actual - expected) < eps, `expected ${expected}, got ${actual}`);
}

assertClose(CUBIC_METERS_PER_CUBIC_FOOT, 0.028316846592);
assertClose(CUBIC_METERS_PER_CUBIC_FOOT, 0.3048 ** 3);

{
  const cases: readonly [number, number, number, number][] = [
    [1, 1, 1, 1],
    [2, 2, 2, 8],
    [5, 4, 3, 60],
    [4, 3, 2, 24],
    [2, 1.5, 1, 3],
    [0.5, 0.4, 0.3, 0.06],
    [0, 4, 3, 0],
  ];
  for (const [l, w, h, vol] of cases) {
    const result = calculateCubicMeter({
      source: 'dimensions',
      length: l,
      width: w,
      height: h,
      lengthUnit: 'm',
      widthUnit: 'm',
      heightUnit: 'm',
      volume: null,
      volumeUnit: 'ft3',
    });
    assertClose(result.cubicMeters, vol);
  }
}

{
  const cmCases: readonly [number, number, number, number][] = [
    [100, 100, 100, 1],
    [50, 40, 30, 0.06],
    [200, 100, 50, 1],
  ];
  for (const [l, w, h, vol] of cmCases) {
    const result = calculateCubicMeter({
      source: 'dimensions',
      length: l,
      width: w,
      height: h,
      lengthUnit: 'cm',
      widthUnit: 'cm',
      heightUnit: 'cm',
      volume: null,
      volumeUnit: 'ft3',
    });
    assertClose(result.cubicMeters, vol);
  }
}

{
  // Mixed: 2 m × 100 cm × 500 mm = 1 m³
  const result = calculateCubicMeter({
    source: 'dimensions',
    length: 2,
    width: 100,
    height: 500,
    lengthUnit: 'm',
    widthUnit: 'cm',
    heightUnit: 'mm',
    volume: null,
    volumeUnit: 'ft3',
  });
  assertClose(result.cubicMeters, 1);
}

{
  assertClose(volumeToCubicMeters(1, 'L'), 0.001);
  assertClose(volumeToCubicMeters(1000, 'L'), 1);
  assertClose(volumeToCubicMeters(1, 'ft3'), CUBIC_METERS_PER_CUBIC_FOOT);
  assertClose(volumeToCubicMeters(100, 'ft3'), 2.8316846592);
  assertClose(volumeToCubicMeters(1, 'yd3'), 0.764554857984);
  assertClose(volumeToCubicMeters(1, 'usGal'), 0.003785411784);
  assertClose(volumeToCubicMeters(1, 'impGal'), 0.00454609);
  assertClose(volumeToCubicMeters(1, 'cm3'), 1e-6);
  assertClose(volumeToCubicMeters(1, 'mm3'), 1e-9);

  assertClose(cubicMetersToVolume(1, 'L'), 1000);
  assertClose(cubicMetersToVolume(1, 'ft3'), 1 / CUBIC_METERS_PER_CUBIC_FOOT);
  assertClose(cubicMetersToCubicFeet(1), 1 / CUBIC_METERS_PER_CUBIC_FOOT);
  assertClose(cubicFeetToCubicMeters(100), 2.8316846592);

  const fromFt = calculateCubicMeter({
    source: 'volume',
    length: null,
    width: null,
    height: null,
    lengthUnit: 'm',
    widthUnit: 'm',
    heightUnit: 'm',
    volume: 100,
    volumeUnit: 'ft3',
  });
  assertClose(fromFt.cubicMeters, 2.8316846592);
  assert.equal(fromFt.length, null);

  const fromL = calculateCubicMeter({
    source: 'volume',
    length: null,
    width: null,
    height: null,
    lengthUnit: 'm',
    widthUnit: 'm',
    heightUnit: 'm',
    volume: 1000,
    volumeUnit: 'L',
  });
  assertClose(fromL.cubicMeters, 1);
}

{
  const result = calculateCubicMeter(DEFAULT_CUBIC_METER_INPUT);
  assert.equal(result.cubicMeters, 60);
  const ft3 = result.otherUnits.find((row) => row.unit === 'ft³');
  assertClose(ft3?.value ?? NaN, 60 / CUBIC_METERS_PER_CUBIC_FOOT);
  const liters = result.otherUnits.find((row) => row.unit === 'L');
  assert.equal(liters?.value, 60_000);
}

{
  const length = calculateMissingDimension({
    unknown: 'length',
    volumeCubicMeters: 60,
    length: null,
    width: 4,
    height: 3,
    lengthUnit: 'm',
    widthUnit: 'm',
    heightUnit: 'm',
    resultUnit: 'm',
  });
  assertClose(length.value, 5);

  const height = calculateMissingDimension({
    unknown: 'height',
    volumeCubicMeters: 120,
    length: 5,
    width: 6,
    height: null,
    lengthUnit: 'm',
    widthUnit: 'm',
    heightUnit: 'm',
    resultUnit: 'm',
  });
  assertClose(height.value, 4);
}

{
  assertClose(lengthToMeters(1, 'dam'), 10);
  assert.equal(formatMeasure(0), '0');
  assert.equal(formatMeasure(60), '60');
}

{
  const ok = validateCubicMeter(DEFAULT_CUBIC_METER_INPUT);
  assert.equal(ok.isValid, true);

  const blank = validateCubicMeter({
    ...DEFAULT_CUBIC_METER_INPUT,
    length: null,
  });
  assert.equal(blank.isValid, false);

  const neg = validateCubicMeter({
    ...DEFAULT_CUBIC_METER_INPUT,
    height: -1,
  });
  assert.equal(neg.isValid, false);

  const volOk = validateCubicMeter({
    source: 'volume',
    length: null,
    width: null,
    height: null,
    lengthUnit: 'm',
    widthUnit: 'm',
    heightUnit: 'm',
    volume: 10,
    volumeUnit: 'ft3',
  });
  assert.equal(volOk.isValid, true);

  const zeroDiv = validateMissingDimension({
    unknown: 'length',
    volumeCubicMeters: 10,
    length: null,
    width: 0,
    height: 4,
    lengthUnit: 'm',
    widthUnit: 'm',
    heightUnit: 'm',
    resultUnit: 'm',
  });
  assert.equal(zeroDiv.isValid, false);
}

console.log('cubic-meter calculation.test.ts: ok');
