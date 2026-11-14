import assert from 'node:assert/strict';
import {
  calculateDecimeterToMeter,
  decimetersToMeters,
  formatLength,
  metersToDecimeters,
} from './calculation';
import {
  DEFAULT_DECIMETER_TO_METER_INPUT,
  METERS_PER_CM,
  METERS_PER_FOOT,
  METERS_PER_INCH,
  METERS_PER_KM,
  METERS_PER_MM,
  METERS_PER_YARD,
} from './types';
import { validateDecimeterToMeter } from './validation';

const cases: readonly [number, number][] = [
  [0, 0],
  [0.1, 0.01],
  [1, 0.1],
  [2, 0.2],
  [5, 0.5],
  [10, 1],
  [25, 2.5],
  [34.6, 3.46],
  [50, 5],
  [78, 7.8],
  [100, 10],
  [250, 25],
  [1000, 100],
  [43, 4.3],
  [77.8, 7.78],
];

function assertClose(actual: number, expected: number): void {
  assert.ok(
    Math.abs(actual - expected) < 1e-12,
    `expected ${expected}, got ${actual}`
  );
}

for (const [dm, m] of cases) {
  assertClose(decimetersToMeters(dm), m);
  assertClose(metersToDecimeters(m), dm);
  assertClose(
    calculateDecimeterToMeter({ source: 'decimeters', decimeters: dm, meters: null }).meters,
    m
  );
  assertClose(
    calculateDecimeterToMeter({ source: 'meters', decimeters: null, meters: m }).decimeters,
    dm
  );
}

{
  const result = calculateDecimeterToMeter(DEFAULT_DECIMETER_TO_METER_INPUT);
  assert.equal(result.decimeters, 34.6);
  assert.equal(result.meters, 3.46);
  const mm = result.otherUnits.find((row) => row.unit === 'mm');
  const cm = result.otherUnits.find((row) => row.unit === 'cm');
  const km = result.otherUnits.find((row) => row.unit === 'km');
  const inches = result.otherUnits.find((row) => row.unit === 'in');
  const ft = result.otherUnits.find((row) => row.unit === 'ft');
  const yd = result.otherUnits.find((row) => row.unit === 'yd');
  assert.ok(mm && Math.abs(mm.value - 3.46 / METERS_PER_MM) < 1e-9);
  assert.ok(cm && Math.abs(cm.value - 3.46 / METERS_PER_CM) < 1e-9);
  assert.ok(km && Math.abs(km.value - 3.46 / METERS_PER_KM) < 1e-15);
  assert.ok(inches && Math.abs(inches.value - 3.46 / METERS_PER_INCH) < 1e-9);
  assert.ok(ft && Math.abs(ft.value - 3.46 / METERS_PER_FOOT) < 1e-9);
  assert.ok(yd && Math.abs(yd.value - 3.46 / METERS_PER_YARD) < 1e-9);
}

{
  // 10 dm → exact customary checks from the brief.
  const result = calculateDecimeterToMeter({
    source: 'decimeters',
    decimeters: 10,
    meters: null,
  });
  assert.equal(result.meters, 1);
  const inches = result.otherUnits.find((row) => row.unit === 'in')!;
  const ft = result.otherUnits.find((row) => row.unit === 'ft')!;
  const yd = result.otherUnits.find((row) => row.unit === 'yd')!;
  assert.ok(Math.abs(inches.value - 1 / 0.0254) < 1e-12);
  assert.ok(Math.abs(ft.value - 1 / 0.3048) < 1e-12);
  assert.ok(Math.abs(yd.value - 1 / 0.9144) < 1e-12);
}

{
  // Round-trip: no accumulated drift.
  let meters = 7.8;
  for (let i = 0; i < 20; i += 1) {
    const dm = metersToDecimeters(meters);
    meters = decimetersToMeters(dm);
  }
  assert.equal(meters, 7.8);
}

{
  assert.equal(formatLength(3.46), '3.46');
  assert.equal(formatLength(0), '0');
  assert.equal(formatLength(0.1), '0.1');
}

{
  const ok = validateDecimeterToMeter({
    source: 'decimeters',
    decimeters: 10,
    meters: null,
  });
  assert.equal(ok.isValid, true);

  const blank = validateDecimeterToMeter({
    source: 'decimeters',
    decimeters: null,
    meters: null,
  });
  assert.equal(blank.isValid, false);

  const bad = validateDecimeterToMeter({
    source: 'meters',
    decimeters: null,
    meters: Number.NaN,
  });
  assert.equal(bad.isValid, false);
  assert.ok(bad.errors.meters);

  const negative = validateDecimeterToMeter({
    source: 'decimeters',
    decimeters: -5,
    meters: null,
  });
  assert.equal(negative.isValid, true);
  assert.equal(
    calculateDecimeterToMeter({ source: 'decimeters', decimeters: -5, meters: null }).meters,
    -0.5
  );
}

console.log('decimeter-to-meter calculation.test.ts: ok');
