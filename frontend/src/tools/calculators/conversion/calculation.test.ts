import assert from 'node:assert/strict';
import { convertValue, formatAmount, shareResultText } from './calculation';
import { parseAmountInput } from './validation';

function approx(actual: number, expected: number, tol = 1e-9) {
  assert.ok(
    Math.abs(actual - expected) <= tol * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

function must(category: Parameters<typeof convertValue>[0], from: string, to: string, value: number) {
  const r = convertValue(category, from, to, value);
  assert.equal(r.ok, true);
  if (!r.ok) throw new Error('unreachable');
  return r.value;
}

// Length
approx(must('length', 'm', 'cm', 1), 100);
approx(must('length', 'km', 'm', 1), 1000);
approx(must('length', 'in', 'cm', 1), 2.54);
approx(must('length', 'ft', 'in', 1), 12);
approx(must('length', 'mi', 'km', 1), 1.609344);

// Mass
approx(must('mass', 'kg', 'g', 1), 1000);
approx(must('mass', 'lb', 'kg', 1), 0.45359237);

// Temperature
approx(must('temperature', 'C', 'F', 0), 32);
approx(must('temperature', 'C', 'F', 100), 212);
approx(must('temperature', 'C', 'K', 0), 273.15);
approx(must('temperature', 'F', 'C', 32), 0);
approx(must('temperature', 'K', 'C', 273.15), 0);

// Time
approx(must('time', 'h', 'min', 1), 60);
approx(must('time', 'd', 'h', 1), 24);

// Speed
approx(must('speed', 'mps', 'kmh', 1), 3.6);

// Pressure
approx(must('pressure', 'atm', 'Pa', 1), 101_325);

// Energy
approx(must('energy', 'kWh', 'J', 1), 3_600_000);

// Data storage — decimal vs binary
approx(must('dataStorage', 'MB', 'B', 1), 1_000_000);
approx(must('dataStorage', 'MiB', 'B', 1), 1_048_576);

// Data transfer
approx(must('dataTransfer', 'Mbps', 'bps', 1), 1_000_000);

// Power / force / angle / area / volume smoke
approx(must('power', 'kW', 'W', 1), 1000);
approx(must('force', 'N', 'kN', 1000), 1);
approx(must('angle', 'deg', 'rad', 180), Math.PI, 1e-12);
approx(must('area', 'm2', 'ha', 10_000), 1);
approx(must('volume', 'gal_us', 'L', 1), 3.785411784);

// Fuel reciprocal
approx(must('fuelEconomy', 'km_L', 'L_100km', 10), 10);
approx(must('fuelEconomy', 'L_100km', 'km_L', 5), 20);
assert.equal(convertValue('fuelEconomy', 'L_100km', 'km_L', 0).ok, false);

// Bidirectional length consistency
{
  const cm = must('length', 'm', 'cm', 2.5);
  approx(cm, 250);
  approx(must('length', 'cm', 'm', cm), 2.5);
}

// Formatting / validation
assert.equal(formatAmount(100), '100');
assert.equal(parseAmountInput('').blank, true);
assert.equal(parseAmountInput('1.').incomplete, true);
assert.ok(parseAmountInput('abc').error);
assert.equal(parseAmountInput('1e3').value, 1000);

{
  const share = shareResultText({
    categoryId: 'length',
    sourceValue: '1',
    destValue: '100',
    sourceUnitId: 'm',
    destUnitId: 'cm',
  });
  assert.match(share, /Conversion Calculator/);
  assert.match(share, /Category: Length/);
  assert.match(share, /From: 1 Meter/);
  assert.match(share, /To: 100 Centimeter/);
}

console.log('conversion calculation.test.ts: ok');
