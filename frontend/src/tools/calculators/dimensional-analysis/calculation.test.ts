import assert from 'node:assert/strict';
import { getQuantity } from './catalog';
import {
  compareValues,
  convertWithinQuantity,
  fromKelvin,
  toKelvin,
  valuesApproximatelyEqual,
} from './calculation';
import {
  dim,
  dimsEqual,
  divideDims,
  formatDimension,
  multiplyDims,
  powerDims,
} from './dimensions';

function approx(actual: number, expected: number, rel = 1e-10): void {
  const scale = Math.max(1, Math.abs(expected));
  assert.ok(
    Math.abs(actual - expected) <= rel * scale,
    `expected ${expected}, got ${actual}`,
  );
}

// Dimensions
assert.equal(formatDimension(dim({ L: 1 })), 'L');
assert.equal(formatDimension(dim({ L: 2 })), 'L²');
assert.equal(formatDimension(dim({ L: 1, T: -1 })), 'LT⁻¹');
assert.equal(formatDimension(dim({ M: 1, L: 1, T: -2 })), 'MLT⁻²');
assert.equal(formatDimension(dim({ M: 1, L: 2, T: -2 })), 'ML²T⁻²');
assert.equal(formatDimension(dim({ M: 1, L: 2, T: -3 })), 'ML²T⁻³');
assert.equal(formatDimension(dim({ M: 1, L: -1, T: -2 })), 'ML⁻¹T⁻²');
assert.equal(formatDimension(dim({ M: 1, L: -3 })), 'ML⁻³');
assert.equal(formatDimension(dim({ T: -1 })), 'T⁻¹');
assert.equal(formatDimension(dim({ I: 1, T: 1 })), 'TI');

{
  const force = multiplyDims(dim({ M: 1 }), dim({ L: 1, T: -2 }));
  assert.ok(dimsEqual(force, dim({ M: 1, L: 1, T: -2 })));
  const energy = multiplyDims(force, dim({ L: 1 }));
  assert.ok(dimsEqual(energy, dim({ M: 1, L: 2, T: -2 })));
  const pressure = divideDims(force, dim({ L: 2 }));
  assert.ok(dimsEqual(pressure, dim({ M: 1, L: -1, T: -2 })));
  assert.ok(dimsEqual(powerDims(dim({ L: 1, T: -1 }), 2), dim({ L: 2, T: -2 })));
}

// Catalog dimensions
assert.ok(dimsEqual(getQuantity('length')!.dimension, dim({ L: 1 })));
assert.ok(dimsEqual(getQuantity('force')!.dimension, dim({ M: 1, L: 1, T: -2 })));
assert.ok(dimsEqual(getQuantity('energy')!.dimension, dim({ M: 1, L: 2, T: -2 })));
assert.ok(dimsEqual(getQuantity('power')!.dimension, dim({ M: 1, L: 2, T: -3 })));
assert.ok(dimsEqual(getQuantity('pressure')!.dimension, dim({ M: 1, L: -1, T: -2 })));
assert.ok(dimsEqual(getQuantity('density')!.dimension, dim({ M: 1, L: -3 })));
assert.ok(dimsEqual(getQuantity('frequency')!.dimension, dim({ T: -1 })));
assert.ok(dimsEqual(getQuantity('charge')!.dimension, dim({ I: 1, T: 1 })));

// Linear conversions
{
  const length = getQuantity('length')!;
  approx(convertWithinQuantity(length, 1, 'm', 'cm').ok ? (convertWithinQuantity(length, 1, 'm', 'cm') as { value: number }).value : NaN, 100);
  approx((convertWithinQuantity(length, 1, 'km', 'm') as { ok: true; value: number }).value, 1000);
  approx((convertWithinQuantity(length, 1, 'ft', 'm') as { ok: true; value: number }).value, 0.3048);
  approx((convertWithinQuantity(length, 1, 'in', 'cm') as { ok: true; value: number }).value, 2.54);
  approx((convertWithinQuantity(length, 5, 'm', 'ft') as { ok: true; value: number }).value, 16.404199475, 1e-8);
}

{
  const mass = getQuantity('mass')!;
  approx((convertWithinQuantity(mass, 1, 'kg', 'g') as { ok: true; value: number }).value, 1000);
}

{
  const time = getQuantity('time')!;
  approx((convertWithinQuantity(time, 1, 'h', 's') as { ok: true; value: number }).value, 3600);
}

// Temperature
approx(toKelvin(0, 'C'), 273.15);
approx(fromKelvin(273.15, 'C'), 0);
approx(toKelvin(32, 'F'), 273.15);
approx(fromKelvin(toKelvin(100, 'C'), 'F'), 212);
approx(toKelvin(0, 'K'), 0);
approx(toKelvin(491.67, 'R'), 273.15, 1e-8);

{
  const temp = getQuantity('temperature')!;
  const bad = convertWithinQuantity(temp, -300, 'C', 'K');
  assert.equal(bad.ok, false);
  approx((convertWithinQuantity(temp, 0, 'C', 'K') as { ok: true; value: number }).value, 273.15);
  approx((convertWithinQuantity(temp, 32, 'F', 'C') as { ok: true; value: number }).value, 0);
}

// SI identity for derived
{
  const force = getQuantity('force')!;
  approx((convertWithinQuantity(force, 1, 'N', 'N') as { ok: true; si: number }).si, 1);
  const energy = getQuantity('energy')!;
  approx((convertWithinQuantity(energy, 1, 'J', 'J') as { ok: true; si: number }).si, 1);
  const power = getQuantity('power')!;
  approx((convertWithinQuantity(power, 1, 'W', 'W') as { ok: true; si: number }).si, 1);
}

// Compare
{
  const r = compareValues('length', 1, 'm', 3, 'ft');
  assert.equal(r.ok, true);
  if (r.ok) {
    approx(r.value2InUnit1, 0.9144);
    approx(r.differenceSi, 1 - 0.9144);
    assert.equal(r.greater, 'first');
  }
}

{
  const r = compareValues('length', 1, 'm', 100, 'cm');
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.equal, true);
}

assert.ok(valuesApproximatelyEqual(1, 1 + 1e-12));
assert.ok(!valuesApproximatelyEqual(1, 1.01));

console.log('dimensional-analysis calculation.test.ts: ok');
