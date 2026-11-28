import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateGreatCircleDistanceMeters,
  calculateNauticalMileFromInput,
  calculateTravelDistanceMeters,
  calculateTravelTimeSeconds,
  convertDistance,
  convertKilometersToNauticalMiles,
  convertMilesToNauticalMiles,
  convertNauticalMilesToKilometers,
  convertNauticalMilesToMiles,
  convertSpeed,
  fromMeters,
  toMeters,
  toMetersPerSecond,
  toSeconds,
  KM_PER_NMI,
} from './calculation';
import { createEmptyInput } from './types';
import { validateNauticalMileInputs } from './validation';

describe('Nautical Mile Calculator engine', () => {
  it('1 nmi = 1.852 km', () => {
    assert.equal(convertNauticalMilesToKilometers(1), 1.852);
  });
  it('5 nmi = 9.26 km', () => {
    assert.equal(convertNauticalMilesToKilometers(5), 9.26);
  });
  it('10 nmi = 18.52 km', () => {
    assert.equal(convertNauticalMilesToKilometers(10), 18.52);
  });
  it('50 nmi = 92.6 km', () => {
    assert.ok(Math.abs(convertNauticalMilesToKilometers(50) - 92.6) < 1e-12);
  });
  it('100 nmi = 185.2 km', () => {
    assert.ok(Math.abs(convertNauticalMilesToKilometers(100) - 185.2) < 1e-12);
  });

  it('1 nmi ≈ 1.150779 mi', () => {
    assert.ok(
      Math.abs(convertNauticalMilesToMiles(1) - 1.150779448) < 1e-6,
    );
  });
  it('10 nmi ≈ 11.507794 mi', () => {
    assert.ok(
      Math.abs(convertNauticalMilesToMiles(10) - 11.50779448) < 1e-5,
    );
  });

  it('100 km ≈ 53.99568 nmi', () => {
    assert.ok(
      Math.abs(convertKilometersToNauticalMiles(100) - 100 / KM_PER_NMI) <
        1e-9,
    );
  });
  it('100 mi ≈ 86.89762 nmi', () => {
    assert.ok(
      Math.abs(convertMilesToNauticalMiles(100) - 86.89762417) < 1e-5,
    );
  });

  it('1 kn = 1.852 km/h', () => {
    assert.ok(Math.abs(convertSpeed(1, 'kn', 'km/h') - 1.852) < 1e-12);
  });
  it('10 kn = 18.52 km/h', () => {
    assert.ok(Math.abs(convertSpeed(10, 'kn', 'km/h') - 18.52) < 1e-12);
  });
  it('20 kn = 37.04 km/h', () => {
    assert.ok(Math.abs(convertSpeed(20, 'kn', 'km/h') - 37.04) < 1e-12);
  });
  it('20 kn ≈ 23.0156 mph', () => {
    assert.ok(Math.abs(convertSpeed(20, 'kn', 'mph') - 23.015589) < 1e-4);
  });
  it('25 kn ≈ 46.3 km/h', () => {
    assert.ok(Math.abs(convertSpeed(25, 'kn', 'km/h') - 46.3) < 1e-12);
  });

  const distCases: Array<[number, number, number]> = [
    [10, 1, 10],
    [15, 4, 60],
    [20, 5, 100],
    [25, 6, 150],
    [30, 10, 300],
  ];
  for (const [kn, h, nmi] of distCases) {
    it(`${kn} kn × ${h} h → ${nmi} nmi`, () => {
      const m = calculateTravelDistanceMeters(
        toMetersPerSecond(kn, 'kn'),
        toSeconds(h, 'h'),
      );
      assert.ok(m != null);
      assert.ok(Math.abs(fromMeters(m!, 'nmi') - nmi) < 1e-9);
    });
  }

  const timeCases: Array<[number, number, number]> = [
    [100, 20, 5],
    [120, 20, 6],
    [150, 25, 6],
    [200, 25, 8],
    [300, 30, 10],
  ];
  for (const [nmi, kn, h] of timeCases) {
    it(`${nmi} nmi / ${kn} kn → ${h} h`, () => {
      const t = calculateTravelTimeSeconds(
        toMeters(nmi, 'nmi'),
        toMetersPerSecond(kn, 'kn'),
      );
      assert.ok(t != null);
      assert.ok(Math.abs(t! / 3600 - h) < 1e-9);
    });
  }

  it('default fixture convert 10 nmi + travel 60 nmi', () => {
    const r = calculateNauticalMileFromInput(createEmptyInput());
    assert.ok(r);
    assert.ok(r!.nauticalMiles != null);
    assert.ok(Math.abs(r!.nauticalMiles! - 10) < 1e-9);
    assert.ok(r!.kilometers != null);
    assert.ok(Math.abs(r!.kilometers! - 18.52) < 1e-9);
    assert.ok(r!.distanceNauticalMiles != null);
    assert.ok(Math.abs(r!.distanceNauticalMiles! - 60) < 1e-9);
  });

  it('negative nmi validation', () => {
    const v = validateNauticalMileInputs({
      ...createEmptyInput(),
      nmiValue: '-1',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.nmiValue);
  });

  it('empty convert + empty travel → no result', () => {
    const v = validateNauticalMileInputs({
      ...createEmptyInput(),
      nmiValue: '',
      speed: '',
      time: '',
    });
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });

  it('distance round-trip nmi → km → nmi', () => {
    const km = convertDistance(10, 'nmi', 'km');
    const back = convertDistance(km, 'km', 'nmi');
    assert.ok(Math.abs(back - 10) < 1e-12);
  });

  it('haversine London–Paris is finite positive nmi', () => {
    const m = calculateGreatCircleDistanceMeters(
      51.5074,
      -0.1278,
      48.8566,
      2.3522,
    );
    assert.ok(m != null && m > 0);
    const nmi = fromMeters(m!, 'nmi');
    assert.ok(nmi > 150 && nmi < 250);
  });

  it('zero speed with positive distance → time mode invalid', () => {
    const v = validateNauticalMileInputs({
      ...createEmptyInput(),
      calculationMode: 'time',
      distance: '100',
      speed: '0',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.speed);
  });
});
