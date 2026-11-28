import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateDistance,
  calculateSpeed,
  calculateTime,
  convertDistance,
  convertSpeed,
  convertTime,
  fromMeters,
  fromMps,
  fromSeconds,
  toMeters,
  toMps,
  toSeconds,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateSpeedInputs } from './validation';

const approx = (actual: number, expected: number, tol = 1e-9) => {
  assert.ok(
    Math.abs(actual - expected) < tol,
    `expected ≈ ${expected}, got ${actual}`,
  );
};

describe('Speed Calculator engine', () => {
  it('100 km / 2 h → 50 km/h', () => {
    const mps = calculateSpeed(toMeters(100, 'km'), toSeconds(2, 'h'));
    approx(fromMps(mps, 'km/h'), 50);
  });
  it('120 km / 2 h → 60 km/h', () => {
    approx(
      fromMps(calculateSpeed(toMeters(120, 'km'), toSeconds(2, 'h')), 'km/h'),
      60,
    );
  });
  it('150 km / 3 h → 50 km/h', () => {
    approx(
      fromMps(calculateSpeed(toMeters(150, 'km'), toSeconds(3, 'h')), 'km/h'),
      50,
    );
  });
  it('200 km / 4 h → 50 km/h', () => {
    approx(
      fromMps(calculateSpeed(toMeters(200, 'km'), toSeconds(4, 'h')), 'km/h'),
      50,
    );
  });
  it('300 km / 5 h → 60 km/h', () => {
    approx(
      fromMps(calculateSpeed(toMeters(300, 'km'), toSeconds(5, 'h')), 'km/h'),
      60,
    );
  });

  it('60 km/h × 2 h → 120 km', () => {
    approx(
      fromMeters(
        calculateDistance(toMps(60, 'km/h'), toSeconds(2, 'h')),
        'km',
      ),
      120,
    );
  });
  it('80 km/h × 3 h → 240 km', () => {
    approx(
      fromMeters(
        calculateDistance(toMps(80, 'km/h'), toSeconds(3, 'h')),
        'km',
      ),
      240,
    );
  });
  it('100 km/h × 1.5 h → 150 km', () => {
    approx(
      fromMeters(
        calculateDistance(toMps(100, 'km/h'), toSeconds(1.5, 'h')),
        'km',
      ),
      150,
    );
  });
  it('50 mph × 2 h → 100 mi', () => {
    approx(
      fromMeters(calculateDistance(toMps(50, 'mph'), toSeconds(2, 'h')), 'mi'),
      100,
    );
  });

  it('100 km / 50 km/h → 2 h', () => {
    approx(
      fromSeconds(
        calculateTime(toMeters(100, 'km'), toMps(50, 'km/h')),
        'h',
      ),
      2,
    );
  });
  it('240 km / 60 km/h → 4 h', () => {
    approx(
      fromSeconds(
        calculateTime(toMeters(240, 'km'), toMps(60, 'km/h')),
        'h',
      ),
      4,
    );
  });
  it('300 km / 75 km/h → 4 h', () => {
    approx(
      fromSeconds(
        calculateTime(toMeters(300, 'km'), toMps(75, 'km/h')),
        'h',
      ),
      4,
    );
  });
  it('120 mi / 60 mph → 2 h', () => {
    approx(
      fromSeconds(calculateTime(toMeters(120, 'mi'), toMps(60, 'mph')), 'h'),
      2,
    );
  });

  it('60 mph = 96.56064 km/h', () => {
    approx(convertSpeed(60, 'mph', 'km/h'), 96.56064);
  });
  it('100 km/h ≈ 62.1371 mph', () => {
    approx(convertSpeed(100, 'km/h', 'mph'), 62.1371, 0.001);
  });
  it('1 m/s = 3.6 km/h', () => {
    approx(convertSpeed(1, 'm/s', 'km/h'), 3.6);
  });
  it('1 kn = 1.852 km/h', () => {
    approx(convertSpeed(1, 'kn', 'km/h'), 1.852);
  });
  it('1 mi = 1609.344 m', () => {
    approx(convertDistance(1, 'mi', 'm'), 1609.344);
  });
  it('1 nmi = 1852 m', () => {
    approx(convertDistance(1, 'nmi', 'm'), 1852);
  });
  it('1 h = 3600 s', () => {
    approx(convertTime(1, 'h', 's'), 3600);
  });
  it('1 d = 86400 s', () => {
    approx(convertTime(1, 'd', 's'), 86400);
  });

  it('default fixture → 50 km/h', () => {
    const v = validateSpeedInputs(createEmptyInput());
    assert.ok(v.result);
    approx(v.result!.speedValue!, 50);
  });

  it('average segments 80+120 over 1+2 h → ≈66.67 km/h', () => {
    const v = validateSpeedInputs({
      ...createEmptyInput(),
      showAverage: true,
      distance: '',
      time: '',
    });
    assert.ok(v.result?.averageSpeedDisplay);
    approx(fromMps(v.result!.averageSpeedMps!, 'km/h'), 200 / 3, 0.01);
  });

  it('negative distance invalid', () => {
    const v = validateSpeedInputs({
      ...createEmptyInput(),
      distance: '-1',
    });
    assert.ok(v.errors.distance);
  });

  it('blank → no result', () => {
    const v = validateSpeedInputs(createBlankInput());
    assert.equal(v.result, null);
  });

  it('zero time with positive distance → undefined speed', () => {
    const v = validateSpeedInputs({
      ...createEmptyInput(),
      distance: '10',
      time: '0',
    });
    assert.ok(v.result);
    assert.equal(v.result!.speedDisplay, null);
    assert.match(v.result!.interpretation, /time/i);
  });
});
